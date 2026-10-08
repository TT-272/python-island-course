# 判题 runner —— 在 Pyodide 里执行学员代码 + 判分用例，返回 JSON 字符串
import sys, io, json, time, traceback, re, ast as _ast

_LOC_RE = re.compile(r"\s*\((?:main\.py|<test>), line \d+\)\s*$")

# ---------- AST 代码检查 ----------
# 结构性要求白名单：学员代码必须真的用到这些语法构造，防止「直接 print 答案」蒙混过关。
# 只约束结构（有没有用 if / 循环 / 函数 / 读输入），不约束写法风格，给不同解法留空间。
_REQ_LABELS = {
    "if": "if 判断",
    "for": "for 循环",
    "while": "while 循环",
    "def": "def 函数",
    "input": "input() 读取输入",
    "dict": "字典",
    "list": "列表",
    "random": "random 随机数",
}


def _ast_features(code):
    """收集学员代码里出现的结构性构造集合（None = 语法错误，交给正常报错流程）"""
    try:
        tree = _ast.parse(code)
    except SyntaxError:
        return None
    feats = set()
    class _V(_ast.NodeVisitor):
        def generic_visit(self, node):
            if isinstance(node, _ast.If):
                feats.add("if")
            elif isinstance(node, _ast.For):
                feats.add("for")
            elif isinstance(node, _ast.While):
                feats.add("while")
            elif isinstance(node, _ast.FunctionDef):
                feats.add("def")
            elif isinstance(node, _ast.Dict):
                feats.add("dict")
            elif isinstance(node, _ast.List):
                feats.add("list")
            elif isinstance(node, _ast.Call):
                f = node.func
                name = f.id if isinstance(f, _ast.Name) else (f.attr if isinstance(f, _ast.Attribute) else None)
                if name in ("input", "random"):
                    feats.add(name)
            elif isinstance(node, (_ast.Import, _ast.ImportFrom)):
                mod = getattr(node, "module", None) or ""
                names = [a.name for a in getattr(node, "names", [])]
                if "random" in mod or "random" in names:
                    feats.add("random")
            super().generic_visit(node)
    _V().visit(tree)
    return feats


def _check_requires(code, requires):
    """返回缺失项的中文说明列表；全满足或无需检查返回 []"""
    reqs = [r for r in (requires or []) if r in _REQ_LABELS]
    if not reqs:
        return []
    feats = _ast_features(code)
    if feats is None:
        return []  # 语法错误会在 exec 阶段带行号报出，这里不重复报
    missing = [(_REQ_LABELS[r], r) for r in reqs if r not in feats]
    if not missing:
        return []
    names = "、".join(label for label, _ in missing)
    return ["建议：这道题想让你练的是 %s；你这次没用到，确认一下是不是漏了（用别的方式解决也行）。" % names]


def _clean(msg):
    """去掉 Python 3.11+ 附在消息尾巴上的 (main.py, line N)，中文提示里统一表达行号"""
    return _LOC_RE.sub("", msg).strip()


def _run(code, stdin_text, tests, requires=None, soft_checks=None):
    out = io.StringIO()
    old_out, old_in = sys.stdout, sys.stdin
    sys.stdout = out
    sys.stdin = io.StringIO(stdin_text or "")
    ns = {"__name__": "__main__"}
    err = None
    t0 = time.time()
    try:
        exec(compile(code, "main.py", "exec"), ns)
    except BaseException as e:
        err = e
    finally:
        sys.stdout, sys.stdin = old_out, old_in
    ms = int((time.time() - t0) * 1000)

    res = {"stdout": out.getvalue(), "ms": ms, "error": None, "tests": [], "notes": []}

    if err is not None:
        lineno = getattr(err, "lineno", None)          # SyntaxError / IndentationError 自带行号
        if lineno is None:
            tb = getattr(err, "__traceback__", None)
            if tb is not None:
                for fr in reversed(traceback.extract_tb(tb)):
                    if fr.filename == "main.py":
                        lineno = fr.lineno
                        break
        res["error"] = {
            "type": type(err).__name__,
            "message": _clean(str(err)),
            "line": lineno,
        }
        return json.dumps(res, ensure_ascii=False)

    # 结构建议：没用到题目想练的构造时，只给提示，不拦截 —— 给不同解法留空间
    for msg in _check_requires(code, requires):
        res["notes"].append(msg)

    # 测试用例里可以引用 _stdout 和 _code，也能直接读学员定义的变量
    ns["_stdout"] = res["stdout"]
    ns["_code"] = code
    for i, t in enumerate(tests or []):
        name = t.get("name") or ("测试 %d" % (i + 1))
        try:
            exec(compile(t["code"], "<test>", "exec"), ns)
            res["tests"].append({"name": name, "passed": True, "detail": ""})
        except AssertionError as e:
            res["tests"].append({
                "name": name, "passed": False,
                "detail": _clean(str(e)) or "结果不符合预期",
            })
        except BaseException as e:
            res["tests"].append({
                "name": name, "passed": False,
                "detail": "%s: %s" % (type(e).__name__, _clean(str(e))),
            })
    # 软检查：没通过只在提示区说一句，不判失败（用于"建议用某写法"这类引导）
    for i, t in enumerate(soft_checks or []):
        name = t.get("name") or ("建议 %d" % (i + 1))
        try:
            exec(compile(t["code"], "<soft>", "exec"), ns)
        except BaseException as e:
            detail = _clean(str(e)) or "建议再检查一下这种写法"
            res["notes"].append("%s：%s" % (name, detail))
    return json.dumps(res, ensure_ascii=False)

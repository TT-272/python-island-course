# 判题 runner —— 在 Pyodide 里执行学员代码 + 判分用例，返回 JSON 字符串
import sys, io, json, time, traceback, re

_LOC_RE = re.compile(r"\s*\((?:main\.py|<test>), line \d+\)\s*$")


def _clean(msg):
    """去掉 Python 3.11+ 附在消息尾巴上的 (main.py, line N)，中文提示里统一表达行号"""
    return _LOC_RE.sub("", msg).strip()


def _run(code, stdin_text, tests):
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

    res = {"stdout": out.getvalue(), "ms": ms, "error": None, "tests": []}

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
    return json.dumps(res, ensure_ascii=False)

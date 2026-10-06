#!/usr/bin/env python3
"""为 40 关的 exercise 生成 requires（AST 结构要求）。
要求 = 参考答案用到的结构性构造（白名单内）；有 altSolution 时取交集。
只加白名单内的结构（if/for/while/def/input/dict/list/random），不约束写法。
"""
import re, ast, sys
from pathlib import Path

LESSONS = Path(r"D:\Hermes\python-island-course\python-island\src\content\lessons")

WHITELIST = {"if", "for", "while", "def", "input", "dict", "list", "random"}

def js_unescape(s: str) -> str:
    """TS 单引号字符串里的常见转义 → 真实文本（文件是 UTF-8，中文是原文，只需处理这几个）"""
    out, i = [], 0
    while i < len(s):
        c = s[i]
        if c == "\\" and i + 1 < len(s):
            n = s[i + 1]
            if n == "n": out.append("\n"); i += 2; continue
            if n == "t": out.append("\t"); i += 2; continue
            if n in ("'", '"', "\\"): out.append(n); i += 2; continue
        out.append(c); i += 1
    return "".join(out)

def features(code: str) -> set:
    try:
        tree = ast.parse(code)
    except SyntaxError:
        return set()
    feats = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.If): feats.add("if")
        elif isinstance(node, ast.For): feats.add("for")
        elif isinstance(node, ast.While): feats.add("while")
        elif isinstance(node, ast.FunctionDef): feats.add("def")
        elif isinstance(node, ast.Dict): feats.add("dict")
        elif isinstance(node, ast.List): feats.add("list")
        elif isinstance(node, ast.Call):
            f = node.func
            name = f.id if isinstance(f, ast.Name) else (f.attr if isinstance(f, ast.Attribute) else None)
            if name in ("input", "random"): feats.add(name)
        elif isinstance(node, (ast.Import, ast.ImportFrom)):
            mod = getattr(node, "module", None) or ""
            names = [a.name for a in getattr(node, "names", [])]
            if "random" in mod or "random" in names: feats.add("random")
    return feats & WHITELIST

STR = r"'((?:[^'\\]|\\.)*)'"  # JS 单引号字符串

total = changed = 0
for f in sorted(LESSONS.glob("py-*.ts")):
    total += 1
    text = f.read_text(encoding="utf-8")
    m_sol = re.search(r"solution: " + STR, text)
    if not m_sol:
        print(f"!! {f.name}: 没有 solution"); continue
    sol_feats = features(js_unescape(m_sol.group(1)))

    # altSolution（若有）：取它 code: '...' 里的代码，求交集
    m_alt = re.search(r"altSolution: \{[^}]*?code: " + STR, text, re.S)
    if m_alt:
        alt_feats = features(js_unescape(m_alt.group(1)))
        reqs = sorted(sol_feats & alt_feats, key=["if","for","while","def","input","dict","list","random"].index)
    else:
        reqs = sorted(sol_feats, key=["if","for","while","def","input","dict","list","random"].index)

    if not reqs or "requires:" in text:
        continue

    # 插到主 exercise 的 tests: 之前（文件里第一个 4 空格缩进的 tests:）
    line = "    requires: [" + ", ".join(f"'{r}'" for r in reqs) + "],\n"
    new_text, n = re.subn(r"\n(    tests: \[)", "\n" + line + r"\1", text, count=1)
    if n != 1:
        print(f"!! {f.name}: 没找到插入点"); continue
    f.write_text(new_text, encoding="utf-8")
    changed += 1
    print(f"{f.name}: {reqs}")

print(f"\n{changed}/{total} 关加入了 requires")

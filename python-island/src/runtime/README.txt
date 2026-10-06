判题引擎说明（三段式）

1. judge.ts        —— 主线程侧。负责超时（默认 6 秒）、worker 终止与重启、
                      Python 报错 → 中文人话的翻译。
                      API: judge.run(code, { stdin, tests, timeoutMs })
                      状态: judge.onStatus((s, msg) => ...)  s ∈ loading|ready|failed

2. pyodide.worker.ts —— Web Worker。在里面加载 Pyodide（从 node_modules 导入 loader，
                        wasm/stdlib 运行时从 /pyodide/ 取），加载 runner.py，转发结果。
                        页面一打开就预热，学员读完讲解时它已经就绪。

3. runner.py       —— 在 Pyodide 里执行的 Python 侧逻辑。
                      执行学员代码（捕获 stdout、喂 stdin、开新命名空间），
                      再在同一个命名空间里跑判分用例。
                      判分用例里可用的变量：_stdout（完整输出字符串）+ 学员定义的变量。
                      测试用 assert，assert 的第二个参数就是给学员看的话。

⚠️ 修改 runner.py 时不要用 JS 的 String.replace 去拼文件：
   $' 是 JS 替换模式里的特殊符号（表示"匹配之后的全部内容"），会被静默改写文件。
   已经被这个坑咬过一次（runner.py 被截断，引擎起不来）。

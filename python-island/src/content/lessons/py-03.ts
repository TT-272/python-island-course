import type { Lesson } from '../types';

export const py03: Lesson = {
  id: 'py-03',
  region: 'beach',
  order: 3,
  title: '引号的故事',
  type: 'debug',
  xp: 10,
  summary: '第一次读懂报错，然后把它修好',
  content: [
    { t: 'p', text: '编辑器里这段代码是故意写坏的。' },
    { t: 'p', text: '引号没闭合，是新手最常见的错误 —— 你以后一定会遇到很多次。' },
    { t: 'p', text: '好消息是：Python 会明确告诉你错在第几行。' },
    { t: 'p', text: '你的任务不是重写，是把它修好。' },
    { t: 'tip', text: '这一关学的东西比 print 重要得多：看懂报错 → 找到问题 → 修好它。这个循环你以后要走几千遍。' },
    { t: 'code', lang: 'python', code: '# 运行后会看到类似这样一行报错：\n# SyntaxError: unterminated string literal (detected at line 1)\n# 翻译成人话：第 1 行的字符串引号没关上。', demo: true, demoNote: '这是用来演示报错长什么样的，不是能跑的代码' },
    { t: 'key', text: '报错会告诉你错在第几行；引号、括号没配对是最常见的错。' },
  ],
  exercise: {
    prompt: '编辑器里这段代码跑不起来。修好它，让它打印出：Python 很好玩',
    // 故意不加换行：光标落在第 1 行末尾，正好是缺引号的位置
    starterCode: 'print("Python 很好玩)',
    tests: [
      {
        name: '代码能跑通',
        code: 'assert True, ""',
      },
      {
        name: '输出内容正确',
        code: 'assert _stdout.strip() == "Python 很好玩", f"应该输出 Python 很好玩，你的程序输出的是 {_stdout.strip()!r}"',
      },
    ],
    hints: [
      '数一数这一行的引号，是不是少了一个？',
      '引号必须成对：开头一个，结尾一个。可以写成 print("Python 很好玩") 或 print(\'Python 很好玩\')',
    ],
    solution: 'print("Python 很好玩")',
    bugSpot: {
      at: '很好玩)',
      note: '开头有引号，结尾却没有 —— 字符串在这里就断了。',
    },
  },
};

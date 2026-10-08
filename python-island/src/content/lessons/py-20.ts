import type { Lesson } from '../types';

export const py20: Lesson = {
  id: 'py-20',
  region: 'forest',
  order: 20,
  title: '如果……',
  type: 'guided',
  xp: 10,
  summary: 'if：条件成立才执行那一段',
  content: [
    { t: 'p', text: '你每天都在做判断：如果下雨，就带伞。Python 也会判断，用的是 if。' },
    { t: 'code', lang: 'python', code: 'weather = "下雨"\n\nif weather == "下雨":\n    print("带伞")' },
    { t: 'p', text: '读法是：如果 weather 等于 下雨（冒号），那么（缩进的那一块）打印 带伞。' },
    { t: 'p', text: '两样东西是这一关的重点：行尾的冒号，和下一行开头的缩进。这两样凑在一起，就是 Python 在说"下面这一块归 if 管"。' },
    { t: 'p', text: '如果条件不成立，缩进的那一整块会被直接跳过 —— 里面的代码像是没写过一样。' },
    { t: 'tip', text: '在别的语言里，缩进只是让人看着舒服。在 Python 里它是语法 —— 少一个空格就报 IndentationError。这是 Python 最独特的脾气。' },
    { t: 'key', text: 'if 后面要冒号 :，下面那段要缩进 —— 缩进就代表「属于这个条件」。' },
  ],
  exercise: {
    prompt: 'age 现在是 20。\n\n写一个 if：如果 age 大于等于 18，就打印 可以进场。\n\n（预期输出：可以进场）',
    starterCode: 'age = 20\n\n# 如果 age >= 18，就打印 "可以进场"\n# 两样东西别忘：行尾的冒号，下一行开头的 4 个空格\n\n',
    requires: ['if'],
    tests: [
      {
        name: '输出对了',
        code: 'assert _stdout.strip() == "可以进场", f"应该输出 可以进场，你的程序输出的是 {_stdout.strip()!r}"',
      },
      {
        name: '只有一行',
        code: 'assert len([l for l in _stdout.strip().split("\\n") if l.strip()]) == 1, "只应该输出一行"',
      },
    ],
    hints: [
      '条件那行写成：if age >= 18: —— 末尾那个冒号很容易漏。',
      '下一行要缩进 4 个空格，再写 print("可以进场")。',
      '缩进用空格，别用 Tab，也别把两者混着用。',
    ],
    solution: 'age = 20\nif age >= 18:\n    print("可以进场")',
  },
};

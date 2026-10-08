import type { Lesson } from '../types';

export const py24: Lesson = {
  id: 'py-24',
  region: 'forest',
  order: 24,
  title: '一起判断',
  type: 'debug',
  xp: 10,
  summary: 'and / or / not：把几个条件连起来',
  content: [
    { t: 'p', text: '一个条件不够用的时候，可以把几个条件连起来判断。三个连接词：and、or、not。' },
    { t: 'code', lang: 'python', code: 'age = 20\n\nif age >= 18 and age < 60:\n    print("正值壮年")' },
    { t: 'p', text: 'and 是"两个都成立才算"；or 是"有一个成立就算"；not 把真假反过来。' },
    { t: 'code', lang: 'python', code: 'print(True and False)   # False   要两个都真\nprint(True or False)    # True    一个真就够\nprint(not True)         # False   反过来' },
    { t: 'tip', text: '英文读一遍就懂了：a and b 是"a 并且 b"，a or b 是"a 或者 b"，not a 是"不是 a"。三个词都必须小写。' },
    { t: 'tip', text: '混着用 and 和 or 时，and 会先算（就像乘法比加法先算）。不确定顺序就先加括号，比如 a and (b or c) —— 别靠猜。' },
    { t: 'key', text: 'and 要两边都真，or 只要一边真，not 把真假反过来。' },
  ],
  exercise: {
    prompt: '编辑器里这段代码想判断"年龄在 18 到 60 之间"，但条件写错了，15 岁也会被放行。\n\n修好它，让 age 是 15 的时候打印 不符合条件。',
    starterCode: 'age = 15\n\n# 想判断：年龄在 18 到 60 之间\nif age >= 18 or age < 60:\n    print("符合条件")\nelse:\n    print("不符合条件")\n',
    requires: ['if'],
    tests: [
      {
        name: '15 岁被拦住了',
        code: 'assert _stdout.strip() == "不符合条件", f"age 是 15，应该打印 不符合条件，你的程序输出的是 {_stdout.strip()!r}"',
      },
      {
        name: '只有一行',
        code: 'assert len([l for l in _stdout.strip().split("\\n") if l.strip()]) == 1, "只应该输出一行"',
      },
    ],
    hints: [
      '读一遍那个条件：age >= 18 或者 age < 60。15 岁的孩子"小于 60"是成立的，所以被放行了。',
      '要"两个都成立"，中间得用 and。',
      '改完是：if age >= 18 and age < 60:',
    ],
    solution: 'age = 15\nif age >= 18 and age < 60:\n    print("符合条件")\nelse:\n    print("不符合条件")',
    bugSpot: {
      at: 'age >= 18 or age < 60',
      note: 'or 只要有一样成立就放行 —— 15 < 60 成立，所以这一行把 15 岁也放进去了。',
    },
  },
};

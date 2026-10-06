import type { Lesson } from '../types';

export const py15: Lesson = {
  id: 'py-15',
  region: 'warehouse',
  order: 15,
  title: '数一数、找一找',
  type: 'scratch',
  xp: 10,
  summary: 'count / index / in：盘点三连问',
  content: [
    { t: 'p', text: '仓库盘点的时候，你会问三个问题：这东西还有几个？它在第几格？还有没有别的？' },
    { t: 'p', text: 'Python 对这三个问题各有一个现成的答案：' },
    { t: 'code', lang: 'python', code: 'bag = ["苹果", "面包", "苹果", "牛奶"]\nprint(bag.count("苹果"))   # 2      有几个\nprint(bag.index("面包"))   # 1      在第几格\nprint("西瓜" in bag)       # False  有没有' },
    { t: 'p', text: 'count 只数长得一样的东西；index 给你第一个的编号（还是从 0 开始）；in 给你 True 或 False。' },
    { t: 'tip', text: '"西瓜" in bag 读起来就是英文的"西瓜在不在背包里"，Python 回你 True 或 False —— 跟第 8 关学的布尔值是一家人。' },
  ],
  exercise: {
    prompt: 'bag 已经建好了，里面装着 苹果、面包、苹果、牛奶。\n\n写三行 print，依次输出：\n\n1. 苹果有几个\n2. 面包在第几格\n3. 有没有西瓜\n\n（预期输出三行：2 / 1 / False）',
    starterCode: 'bag = ["苹果", "面包", "苹果", "牛奶"]\n\n# 1. 苹果有几个\n\n# 2. 面包在第几格\n\n# 3. 有没有西瓜\n',
    requires: ['list'],
    tests: [
      {
        name: '一共三行',
        code: 'assert len([l for l in _stdout.strip().split("\\n") if l.strip()]) == 3, f"应该输出三行，你输出了 {len([l for l in _stdout.strip().split(chr(10)) if l.strip()])} 行"',
      },
      {
        name: '结果与顺序正确',
        code: '_n = [x.strip() for x in _stdout.strip().split("\\n") if x.strip()]\nassert len(_n) == 3, "先让程序输出正好三行"\nassert _n == ["2", "1", "False"], f"应该依次输出 2 / 1 / False，你输出的是 {_n}"',
      },
    ],
    hints: [
      '数有几个用 count：bag.count("苹果")',
      '找第几格用 index：bag.index("面包")',
      '问有没有用 in： "西瓜" in bag',
    ],
    solution: 'bag = ["苹果", "面包", "苹果", "牛奶"]\nprint(bag.count("苹果"))\nprint(bag.index("面包"))\nprint("西瓜" in bag)',
  },
};
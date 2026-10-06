import type { Lesson } from '../types';

export const py33: Lesson = {
  id: 'py-33',
  region: 'workshop',
  order: 33,
  title: '掷骰子',
  type: 'guided',
  xp: 10,
  summary: 'import random：让程序给你一个随机数',
  content: [
    { t: 'p', text: '到现在的程序都是"你给它什么，它给你什么"。但游戏需要意外 —— 需要随机。' },
    { t: 'p', text: 'Python 自带一个装随机数的工具箱，叫 random。用之前要先把它拿进来：' },
    { t: 'code', lang: 'python', code: 'import random\n\nprint(random.randint(1, 6))' },
    { t: 'p', text: 'import 要写在最上面。random.randint(1, 6) 的意思是"随便给我一个 1 到 6 之间的整数"。' },
    { t: 'p', text: '注意 randint 的两个数字都包含：1 可能出现，6 也可能出现。这跟 range 的"含头不含尾"正相反。' },
    { t: 'tip', text: 'import 就是"把别人写好的工具箱搬进来"。Python 自带上百个工具箱，以后你会经常用到这行。' },
  ],
  exercise: {
    prompt: '掷 5 次骰子，把每次的结果打印出来（一行一个）。\n\n用 for 循环，每次打印 random.randint(1, 6)。\n\n（每次运行结果都不一样，这是正常的）',
    starterCode: 'import random\n\n# 用 for 循环掷 5 次，每次打印 random.randint(1, 6)\n\n',
    requires: ['for', 'random'],
    tests: [
      {
        name: '掷了 5 次',
        code: '_lines = [x.strip() for x in _stdout.strip().split("\\n") if x.strip()]\nassert len(_lines) == 5, f"应该输出 5 行（掷 5 次），你输出了 {len(_lines)} 行"',
      },
      {
        name: '每次都是 1 到 6 的整数',
        code: '_lines = [x.strip() for x in _stdout.strip().split("\\n") if x.strip()]\nassert all(l.isdigit() and 1 <= int(l) <= 6 for l in _lines), f"每一行都应该是 1 到 6 之间的整数，你输出的是 {_lines}"',
      },
    ],
    hints: [
      '循环写成：for i in range(5): —— 跑 5 次。',
      '循环体里缩进 4 个空格：print(random.randint(1, 6))。',
      'import random 必须在最上面，否则会报"找不到 random"。',
    ],
    solution: 'import random\nfor i in range(5):\n    print(random.randint(1, 6))',
  },
};
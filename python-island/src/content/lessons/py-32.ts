import type { Lesson } from '../types';

export const py32: Lesson = {
  id: 'py-32',
  region: 'workshop',
  order: 32,
  title: '循环的坑',
  type: 'debug',
  xp: 10,
  summary: 'range 含头不含尾、还有那个转不完的死循环',
  content: [
    { t: 'p', text: '这一关不讲新东西，专讲两个新手必踩的坑。' },
    { t: 'p', text: '坑一：range 含头不含尾。' },
    { t: 'code', lang: 'python', code: 'for i in range(5):\n    print(i)      # 0 1 2 3 4 —— 没有 5\n\nfor i in range(1, 5):\n    print(i)      # 1 2 3 4 —— 也没有 5' },
    { t: 'p', text: '右边那个数字本身永远不包含。想打印到 5，就得写 range(6)，或者 range(1, 6)。' },
    { t: 'p', text: '坑二：死循环。while 的条件如果永远成立，程序就永远停不下来：' },
    { t: 'code', lang: 'python', code: 'n = 1\nwhile n <= 5:\n    print(n)\n    # 忘了 n = n + 1 → 这一行下面全是 1，永远停不下来' },
    { t: 'tip', text: '写 while 的时候，养成一个习惯：写完先问自己一句"什么东西在变？它早晚会让条件不成立吗？" 答不上来，多半就是死循环。' },
    { t: 'key', text: 'range(5) 给的是 0~4；忘了更新条件就是死循环。' },
  ],
  exercise: {
    prompt: '编辑器里这段想打印 1 到 5，但只打印到 4 就停了。\n\n找出问题，修好它。\n\n（预期输出：1 / 2 / 3 / 4 / 5）',
    starterCode: '# 想打印 1 到 5\nfor i in range(1, 5):\n    print(i)\n',
    requires: ['for'],
    tests: [
      {
        name: '五行的都对',
        code: '_n = [x.strip() for x in _stdout.strip().split("\\n") if x.strip()]\nassert len(_n) == 5, f"应该输出五行（1 到 5），你输出了 {len(_n)} 行"\nassert _n == ["1", "2", "3", "4", "5"], f"应该依次输出 1 2 3 4 5，你输出的是 {_n}"',
      },
    ],
    hints: [
      '先运行看看：只打印到 4。',
      'range(1, 5) 给的是 1、2、3、4 —— 右边那个 5 本身不包含在内。',
      '想打到 5，右边要写 6：range(1, 6)。',
    ],
    solution: 'for i in range(1, 6):\n    print(i)',
    bugSpot: {
      at: 'range(1, 5)',
      note: 'range 含头不含尾 —— 到 5 之前就停了，所以 5 永远打不出来。',
    },
  },
};

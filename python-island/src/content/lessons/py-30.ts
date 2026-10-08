import type { Lesson } from '../types';

export const py30: Lesson = {
  id: 'py-30',
  region: 'workshop',
  order: 30,
  title: '刹车与跳过',
  type: 'debug',
  xp: 10,
  summary: 'break 是整个停下，continue 是只跳过这一圈',
  content: [
    { t: 'p', text: '循环跑到一半想提前走，有两个刹车：break 和 continue。' },
    { t: 'code', lang: 'python', code: '# break：整个循环立刻结束\nfor i in range(1, 10):\n    if i == 4:\n        break\n    print(i)      # 1 2 3' },
    { t: 'code', lang: 'python', code: '# continue：只跳过这一圈，下一圈照跑\nfor i in range(1, 6):\n    if i == 3:\n        continue\n    print(i)      # 1 2 4 5' },
    { t: 'p', text: '一句话分清：break 是"不干了"，continue 是"这个不要，继续下一个"。' },
    { t: 'tip', text: '两个都只影响它们所在的那一层循环。以后写嵌套循环的时候，这点会变得很重要。' },
    { t: 'key', text: 'break 是整个停下，continue 是只跳过这一圈。' },
  ],
  exercise: {
    prompt: '编辑器里这段想"碰到 3 就整个停下来"，只打印 1 和 2。\n\n但现在打印出来是 1 2 4 5 —— 循环没停住。修好它。\n\n（预期输出：1 / 2）',
    starterCode: '# 想在 i 等于 3 的时候整个停下来，只打印 1 和 2\nfor i in range(1, 6):\n    if i == 3:\n        continue\n    print(i)\n',
    requires: ['if', 'for'],
    tests: [
      {
        name: '只输出了 1 和 2',
        code: '_n = [x.strip() for x in _stdout.strip().split("\\n") if x.strip()]\nassert _n == ["1", "2"], f"应该只输出 1 和 2 两行，你输出的是 {_n}"',
      },
    ],
    hints: [
      '先运行看看：它打印了 1 2 4 5。continue 只跳过了 3 那一圈，循环本身还在跑。',
      '要"整个循环立刻结束"，用 break。',
      '把 continue 换成 break 就行，别的都不用动。',
    ],
    solution: 'for i in range(1, 6):\n    if i == 3:\n        break\n    print(i)',
    bugSpot: {
      at: 'continue',
      note: 'continue 是"这一圈跳过"，循环还会往下跑 —— 所以 4 和 5 照样被打印了出来。',
    },
  },
};

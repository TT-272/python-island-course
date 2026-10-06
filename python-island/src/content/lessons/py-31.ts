import type { Lesson } from '../types';

export const py31: Lesson = {
  id: 'py-31',
  region: 'workshop',
  order: 31,
  title: '循环里还有循环',
  type: 'predict',
  xp: 10,
  summary: '嵌套循环：外面跑一圈，里面跑完整整一圈',
  content: [
    { t: 'p', text: '循环里面还能再放循环。听起来绕，其实规则很简单：外面每跑一圈，里面都要从头到尾跑完一整圈。' },
    { t: 'code', lang: 'python', code: 'for i in range(2):\n    for j in range(3):\n        print(i, j)' },
    { t: 'p', text: '上面这段会打印 6 行：i 是 0 的时候，j 跑 0、1、2；然后 i 变成 1，j 又跑 0、1、2。' },
    { t: 'p', text: 'print 里用逗号隔开好几样东西，Python 会挨着打印出来，中间自动加一个空格 —— 所以你看到的是 0 0、0 1、0 2……' },
    { t: 'tip', text: '数一共跑几圈，把两个 range 里的数字乘起来就行：2 × 3 = 6 行。三层嵌套就是三个数字相乘。' },
  ],
  exercise: {
    prompt: '先自己猜：下面这个双重循环会打印几行？第四行是什么？\n\n外层 i 从 1 到 3，内层 j 从 1 到 3，每圈打印 i * j。\n\n猜完把它写进编辑器，运行对答案。\n\n（预期输出九行数字）',
    starterCode: '# 双重循环：i 和 j 都从 1 到 3，打印 i * j\n# 先猜结果，再运行对答案\n\n',
    requires: ['for'],
    tests: [
      {
        name: '一共九行',
        code: 'assert len([l for l in _stdout.strip().split("\\n") if l.strip()]) == 9, f"外层 3 圈 × 内层 3 圈 = 9 行，你输出了 {len([l for l in _stdout.strip().split(chr(10)) if l.strip()])} 行"',
      },
      {
        name: '九个数都对',
        code: '_n = [x.strip() for x in _stdout.strip().split("\\n") if x.strip()]\nassert len(_n) == 9, "先让程序输出正好九行"\nassert _n == ["1", "2", "3", "2", "4", "6", "3", "6", "9"], f"应该依次输出 1 2 3 2 4 6 3 6 9，你输出的是 {_n}"',
      },
    ],
    hints: [
      '外层写：for i in range(1, 4):',
      '内层要缩进 4 个空格：for j in range(1, 4):',
      '打印那行再缩进 4 个空格：print(i * j)。',
    ],
    solution: 'for i in range(1, 4):\n    for j in range(1, 4):\n        print(i * j)',
  },
};
import type { Lesson } from '../types';

export const py16: Lesson = {
  id: 'py-16',
  region: 'warehouse',
  order: 16,
  title: '不能改的列表',
  type: 'debug',
  xp: 10,
  summary: '元组：上锁的列表，改它就会报错',
  content: [
    { t: 'p', text: '有一种列表是上锁的：建好之后，谁也不许改。它叫元组（tuple），用圆括号 ( ) 包起来。' },
    { t: 'code', lang: 'python', code: 'point = (3, 5)\nprint(point[0])   # 3      取值没问题\npoint[0] = 9      # 报错！元组不让改' },
    { t: 'p', text: '取值可以，改不行。那真要改怎么办？先把它变成列表 —— 这就是你学过的变形术：' },
    { t: 'code', lang: 'python', code: 'point = (3, 5)\npoint = list(point)   # 元组 → 列表\npoint[1] = 9\nprint(point)          # [3, 9]' },
    { t: 'p', text: 'list() 跟 int()、str() 是一家人，只不过这次变的是"元组变列表"。' },
    { t: 'tip', text: '那什么时候用元组？当这份数据本来就不该变的时候，比如一个坐标、一个颜色值。上锁是有意设计，不是 Python 的疏忽。' },
  ],
  exercise: {
    prompt: '下面这段代码想改元组，一跑就报错。\n\n修好它，让它打印出：\n\n[3, 9]\n\n（注意：这一关要的是能改的列表，不是重新造一个新元组）',
    starterCode: 'point = (3, 5)\n\n# 想把第二格改成 9\npoint[1] = 9\n\nprint(point)\n',
    tests: [
      {
        name: '打印出了 [3, 9]',
        code: 'assert _stdout.strip().endswith("[3, 9]"), f"应该打印出 [3, 9]，你的程序输出的是 {_stdout.strip()!r}"',
      },
      {
        name: 'point 变成了能改的列表',
        code: 'assert "point" in globals(), "point 这个变量不见了"\nassert list(point) == [3, 9], f"point 里应该是 [3, 9]，现在是 {point!r}"',
      },
    ],
    hints: [
      '报错的那一行没写错 —— 错的是 point 还是个元组。元组不能改。',
      '先用 list() 把它变成列表：point = list(point)，写在改第二格之前。',
      '变成列表之后再 point[1] = 9 就没问题了，最后 print(point) 会打印出 [3, 9]。',
    ],
    solution: 'point = (3, 5)\npoint = list(point)\npoint[1] = 9\nprint(point)',
    bugSpot: {
      at: 'point[1] = 9',
      note: '元组建好就改不了 —— 这一行一执行就报 TypeError。得先把它变成列表。',
    },
  },
};
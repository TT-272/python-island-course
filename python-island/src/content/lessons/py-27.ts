import type { Lesson } from '../types';

export const py27: Lesson = {
  id: 'py-27',
  region: 'workshop',
  order: 27,
  title: '重复做',
  type: 'guided',
  xp: 10,
  summary: 'for + range()：重复做，还能倒着数',
  content: [
    { t: 'p', text: '想让计算机把同一件事做几遍，你不需要把那一行抄十次。用 for。' },
    { t: 'code', lang: 'python', code: 'for i in range(3):\n    print(i)' },
    { t: 'p', text: 'range(3) 给你三个数：0、1、2。每一圈，i 依次变成其中一个，缩进的那块就跑一遍。' },
    { t: 'p', text: '所以"跑 3 遍"写 range(3)，"跑 5 遍"写 range(5)。想从 1 开始，可以写 range(1, 4) —— 给你 1、2、3。' },
    { t: 'p', text: 'range 还能收第三个数字，叫"步长"，也就是每次走几步：' },
    { t: 'code', lang: 'python', code: 'range(5)          # 0 1 2 3 4       从 0 数 5 个\nrange(1, 4)       # 1 2 3           从 1 数到 4 之前\nrange(0, 10, 2)   # 0 2 4 6 8       每次跳 2 个\nrange(5, 0, -1)   # 5 4 3 2 1       步长写 -1 就是倒着数' },
    { t: 'tip', text: '注意 range(3) 里没有 3，只到 2 就停。这叫"含头不含尾"，跟列表编号从 0 开始是同一个脾气 —— 你会在这一关栽好几次，栽完就记住了。' },
  ],
  exercise: {
    prompt: '分两段打印，一共十行：\n\n第一段：用 range(5) 打印 0、1、2、3、4\n第二段：用 range 的步长倒着打印 5、4、3、2、1\n\n（预期输出：0 1 2 3 4 5 4 3 2 1，一行一个）',
    starterCode: '# 第一段：用 range(5) 打印 0 到 4\n\n# 第二段：用 range 的第三个参数倒着打印 5 到 1\n\n',
    requires: ['for'],
    tests: [
      {
        name: '一共十行',
        code: 'assert len([l for l in _stdout.strip().split("\\n") if l.strip()]) == 10, f"应该输出十行，你输出了 {len([l for l in _stdout.strip().split(chr(10)) if l.strip()])} 行"',
      },
      {
        name: '十行都对',
        code: '_n = [x.strip() for x in _stdout.strip().split("\\n") if x.strip()]\nassert len(_n) == 10, "先让程序输出正好十行"\nassert _n == ["0", "1", "2", "3", "4", "5", "4", "3", "2", "1"], f"应该依次输出 0 1 2 3 4 5 4 3 2 1，你输出的是 {_n}"',
      },
      {
        name: '第二段用了步长',
        code: '_c = _code.replace(" ", "")\nassert "range(5,0,-1)" in _c, "第二段要用 range 的第三个参数来倒数，像 range(5, 0, -1)"',
      },
    ],
    hints: [
      '第一段：for i in range(5): 然后缩进一行 print(i)。',
      '第二段要用第三个参数：for i in range(5, 0, -1):',
      '步长写 -1，就会从 5 开始往回数：5、4、3、2、1。',
    ],
    solution: 'for i in range(5):\n    print(i)\n\nfor i in range(5, 0, -1):\n    print(i)',
  },
};
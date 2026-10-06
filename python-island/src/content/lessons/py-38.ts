import type { Lesson } from '../types';

export const py38: Lesson = {
  id: 'py-38',
  region: 'forge',
  order: 38,
  title: '传值的秘密',
  type: 'predict',
  xp: 10,
  summary: '数字改了不影响外面，列表改了会影响外面',
  content: [
    { t: 'p', text: '这儿有个坑，不少老手也栽过。先看数字：' },
    { t: 'code', lang: 'python', code: 'def change(n):\n    n = 100\n\nx = 5\nchange(x)\nprint(x)      # 还是 5 —— 没变！' },
    { t: 'p', text: '传进去的是值本身。函数里的 n 跟外面的 x 是两份，改 n 动不了 x。' },
    { t: 'p', text: '但列表完全不一样：' },
    { t: 'code', lang: 'python', code: 'def add(lst):\n    lst.append(99)\n\nbag = [1, 2]\nadd(bag)\nprint(bag)    # [1, 2, 99] —— 变了！' },
    { t: 'p', text: '因为列表是"一箱子东西"。传进去的是这个箱子本身（不是箱子的复印件），在函数里往箱子里放东西，外面看到的还是同一个箱子。' },
    { t: 'tip', text: '记这一句就够：数字、字符串在函数里改了，外面不变；列表在函数里改了，外面会变。' },
  ],
  exercise: {
    prompt: '下面两个函数已经写好了：add_one 把数字加 1，add_item 往列表末尾加一个苹果。\n\n先自己猜：\n\nscore 是 10，调用 add_one(score) 之后打印 score，会输出什么？\nbag 是 ["面包"]，调用 add_item(bag) 之后打印 bag，会输出什么？\n\n猜完把这两段补进编辑器，运行对答案。\n\n（预期输出两行）',
    starterCode: 'def add_one(n):\n    n = n + 1\n\ndef add_item(lst):\n    lst.append("苹果")\n\n# 1. score = 10，调用 add_one(score)，然后打印 score\n\n# 2. bag = ["面包"]，调用 add_item(bag)，然后打印 bag\n',
    tests: [
      {
        name: '两行都对',
        code: '_n = [x.strip() for x in _stdout.strip().split("\\n") if x.strip()]\nassert len(_n) == 2, f"应该输出两行，你输出了 {len(_n)} 行"\nassert _n[0] == "10", f"第一行应该是 10（数字在函数里改了，外面不变），你输出的是 {_n[0]!r}"\nassert _n[1] == "[\'面包\', \'苹果\']", f"第二行应该是带上苹果的那个列表，你输出的是 {_n[1]!r}"',
      },
    ],
    hints: [
      '第一个是数字：传进去的是值本身，函数里改 n 动不了外面的 score。',
      '第二个是列表：传进去的就是那个列表本身，函数里 append 会改变外面看到的它。',
      '所以第一行是 10；第二行是那个列表，末尾多了 苹果。',
    ],
    solution: 'def add_one(n):\n    n = n + 1\n\ndef add_item(lst):\n    lst.append("苹果")\n\nscore = 10\nadd_one(score)\nprint(score)\n\nbag = ["面包"]\nadd_item(bag)\nprint(bag)',
  },
};
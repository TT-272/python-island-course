import type { Lesson } from '../types';

export const py36: Lesson = {
  id: 'py-36',
  region: 'forge',
  order: 36,
  title: '传东西进去',
  type: 'fill',
  xp: 10,
  summary: '参数：让函数每次处理不同的东西',
  content: [
    { t: 'p', text: '上一关那个函数，每次都说同一句话。想让它说不同的话，就得给它传东西。' },
    { t: 'code', lang: 'python', code: 'def say_hi(name):\n    print("你好，" + name)\n\nsay_hi("小明")\nsay_hi("小红")' },
    { t: 'p', text: '括号里的 name 叫参数 —— 它是一个空位子，等着被填。' },
    { t: 'p', text: '调用的时候，你给的"小明"会装进 name 里，函数体就能拿它用了。给"小红"，它就变成"小红"。' },
    { t: 'tip', text: '参数可以有很多个：def add(a, b): 那调用的时候就得给两个值 add(1, 2)，一个都不能少。给少了会直接报错。' },
  ],
  exercise: {
    prompt: '这个函数已经会接名字了，但它打印出来的总是问号。\n\n把 "???" 换成正确的东西，让它打印出：\n\n你好，小明\n你好，小红',
    starterCode: 'def say_hi(name):\n    print("你好，" + "???")\n\nsay_hi("小明")\nsay_hi("小红")\n',
    tests: [
      {
        name: '两行都对',
        code: '_n = [x.strip() for x in _stdout.strip().split("\\n") if x.strip()]\nassert len(_n) == 2, f"应该输出两行，你输出了 {len(_n)} 行"\nassert _n == ["你好，小明", "你好，小红"], f"应该输出 你好，小明 和 你好，小红，你输出的是 {_n}"',
      },
    ],
    hints: [
      '要打印的是传进来的那个名字，也就是参数 name。',
      '把 "???" 整个换成 name —— 记得去掉引号。',
      '带上引号就变成打印三个问号了，所以它会一直说"你好，???"。',
    ],
    solution: 'def say_hi(name):\n    print("你好，" + name)\n\nsay_hi("小明")\nsay_hi("小红")',
  },
};
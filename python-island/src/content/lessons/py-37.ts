import type { Lesson } from '../types';

export const py37: Lesson = {
  id: 'py-37',
  region: 'forge',
  order: 37,
  title: '把结果送出来',
  type: 'scratch',
  xp: 10,
  summary: 'return：算出结果交给外面用',
  content: [
    { t: 'p', text: '前面两个函数都是直接打印。但很多时候你要的不是"打印出来"，而是"算出一个结果，交给我用"。' },
    { t: 'p', text: '这时候用 return：' },
    { t: 'code', lang: 'python', code: 'def double(n):\n    return n * 2\n\nresult = double(5)\nprint(result)      # 10' },
    { t: 'p', text: 'return 的意思是"把结果送出来"。送出来的东西可以装进变量、可以接着算、也可以再传给别的函数。' },
    { t: 'p', text: 'return 和 print 是两回事：print 只是给人看的，return 才是真的把值交出来。' },
    { t: 'code', lang: 'python', code: 'def f():\n    return 3\n\nprint(f() + 1)     # 4   送出来的值能接着算' },
    { t: 'tip', text: '函数跑到 return 那一行就结束了，后面的代码一概不执行。' },
  ],
  exercise: {
    prompt: '写一个函数 double：接收一个数字，返回它的两倍。\n\n然后打印 double(5) 和 double(12) 的结果。\n\n（预期输出两行：10 / 24）',
    starterCode: '# 写一个函数 double：接收一个数字，返回它的两倍\n# 用 return 把结果送出来（不是 print）\n\n# 然后打印 double(5) 和 double(12)\n\n',
    requires: ['def'],
    tests: [
      {
        name: '两行都对',
        code: '_n = [x.strip() for x in _stdout.strip().split("\\n") if x.strip()]\nassert len(_n) == 2, f"应该输出两行，你输出了 {len(_n)} 行"\nassert _n == ["10", "24"], f"应该依次输出 10 和 24，你输出的是 {_n}"',
      },
      {
        name: 'double 真的把值送出来了',
        code: 'assert "double" in globals(), "还没有定义 double 这个函数"\nassert callable(double), "double 应该是一个函数"\nassert double(5) == 10 and double(12) == 24, f"double(5) 应该返回 10，现在是 {double(5)!r}。记得用 return 把值送出来，而不是 print 出来。"',
      },
    ],
    hints: [
      '函数体就一行：return n * 2',
      '调用的时候把结果交给 print：print(double(5))',
      '如果写成 print(n * 2) 而不 return，外面拿到的就是空 —— 第二项检查会告诉你。',
    ],
    solution: 'def double(n):\n    return n * 2\n\nprint(double(5))\nprint(double(12))',
  },
};
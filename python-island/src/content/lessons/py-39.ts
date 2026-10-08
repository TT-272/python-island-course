import type { Lesson } from '../types';

export const py39: Lesson = {
  id: 'py-39',
  region: 'forge',
  order: 39,
  title: '一句话函数',
  type: 'fill',
  xp: 10,
  summary: 'lambda：短到只有一行的函数',
  content: [
    { t: 'p', text: '第 37 关写的那个 double 函数只有两行，短得有点啰嗦。这种"一行就能算完"的函数，Python 给了个更短的写法：lambda。' },
    { t: 'code', lang: 'python', code: 'double = lambda n: n * 2\nprint(double(5))     # 10' },
    { t: 'p', text: '看这个形状：lambda 参数: 表达式。冒号后面直接写结果，不用写 return，也不用缩进。' },
    { t: 'p', text: 'lambda 本身没有名字（所以也叫匿名函数），你通常把它塞给一个变量，或者直接交给别的函数用。' },
    { t: 'tip', text: '大多数时候你还是用 def 更清楚。lambda 适合"一眼就能看懂"的小计算 —— 看到别人代码里有它，别被吓到。' },
    { t: 'key', text: 'lambda 是只写一行的迷你函数。' },
  ],
  exercise: {
    prompt: '编辑器里这个 lambda 算出来的永远是 0。\n\n把它补成正确的：接收 n，返回 n 的两倍。\n\n（预期输出两行：10 / 24）',
    starterCode: '# 把冒号后面的 0 换成正确的算式\ndouble = lambda n: 0\n\nprint(double(5))\nprint(double(12))\n',
    tests: [
      {
        name: '两行都对',
        code: '_n = [x.strip() for x in _stdout.strip().split("\\n") if x.strip()]\nassert len(_n) == 2, f"应该输出两行，你输出了 {len(_n)} 行"\nassert _n == ["10", "24"], f"应该依次输出 10 和 24，你输出的是 {_n}"',
      },
      {
        name: 'double 能算出两倍',
        code: 'assert "double" in globals(), "还没有定义 double"\nassert double(3) == 6 and double(7) == 14, f"double(3) 应该算出 6，现在是 {double(3)!r}"',
      },
    ],
    hints: [
      'lambda n: 后面直接写结果，不用 return。',
      '要两倍就是 n * 2。',
      '整行是：double = lambda n: n * 2',
    ],
    solution: 'double = lambda n: n * 2\n\nprint(double(5))\nprint(double(12))',
  },
};

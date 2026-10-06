import type { Lesson } from '../types';

export const py08: Lesson = {
  id: 'py-08',
  region: 'village',
  order: 8,
  title: '真假之间',
  type: 'predict',
  xp: 10,
  summary: 'True 和 False，还有 == 和 = 的区别',
  content: [
    { t: 'p', text: '还有第三种盒子：里面只装得下两样东西 —— True（真）和 False（假）。这叫布尔值。' },
    { t: 'p', text: '注意大小写：True、False，第一个字母要大写。写成 true，Python 不认识。' },
    { t: 'p', text: '布尔值一般不是手写进去的，而是比出来的：' },
    { t: 'code', lang: 'python', code: 'print(5 > 3)     # True\nprint(5 < 3)     # False\nprint(10 == 10)  # True\nprint(10 != 10)  # False' },
    { t: 'p', text: '比较用的符号：> 大于、< 小于、>= 大于等于、<= 小于等于、== 等于、!= 不等于。' },
    { t: 'p', text: '最容易搞混的是 = 和 ==：一个等号是"装进盒子"，两个等号是"问一句相不相等"。' },
    { t: 'tip', text: '大小写也算数。"a" == "A" 是 False —— 在 Python 眼里，a 和 A 是两个完全不同的字符。' },
  ],
  exercise: {
    prompt: '写五行 print，输出下面五个式子的结果（一行一个）：\n\n5 > 3\n5 < 3\n10 == 10\n10 != 10\n"a" == "A"\n\n（先猜结果，再运行对答案）',
    starterCode: '# 五行 print，一行一个结果\n',
    tests: [
      {
        name: '一共五行',
        code: 'assert len([l for l in _stdout.strip().split("\\n") if l.strip()]) == 5, f"应该输出五行，你输出了 {len([l for l in _stdout.strip().split(chr(10)) if l.strip()])} 行"',
      },
      {
        name: '结果与顺序正确',
        code: '_b = [x.strip() for x in _stdout.strip().split("\\n") if x.strip()]\nassert len(_b) == 5, "先让程序输出正好五行"\nassert _b == ["True", "False", "True", "False", "False"], f"应该是 True / False / True / False / False，你写的是 {_b}"',
      },
    ],
    hints: [
      '直接 print(算式)，Python 会把 True 或 False 打出来。',
      '注意输出的大小写：必须是 True 和 False，首字母大写。',
      '"a" == "A" 是 False —— Python 区分大小写。',
    ],
    solution: 'print(5 > 3)\nprint(5 < 3)\nprint(10 == 10)\nprint(10 != 10)\nprint("a" == "A")',
  },
};
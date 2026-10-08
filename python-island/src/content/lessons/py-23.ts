import type { Lesson } from '../types';

export const py23: Lesson = {
  id: 'py-23',
  region: 'forest',
  order: 23,
  title: '比大小',
  type: 'predict',
  xp: 10,
  summary: '比较运算符全家，还有文字比大小的怪规矩',
  content: [
    { t: 'p', text: '判断的核心是比大小。第 8 关你见过 > < == !=，这里是完整的一张表：' },
    { t: 'code', lang: 'python', code: 'print(5 > 3)    # True   大于\nprint(5 >= 5)   # True   大于等于\nprint(5 <= 3)   # False  小于等于\nprint(5 == 5)   # True   等于\nprint(5 != 5)   # False  不等于' },
    { t: 'p', text: '再念叨一遍那个最容易搞错的：一个等号是装进盒子，两个等号是问相不相等。' },
    { t: 'p', text: '还有一件新手想不到的事：文字也能比大小，但比的是"一个一个字符往下比"，跟数值大小完全没关系。' },
    { t: 'code', lang: 'python', code: 'print("apple" < "banana")   # True   a 排在 b 前面\nprint("10" < "9")           # True   第一位 1 比 9 小，后面就不看了' },
    { t: 'tip', text: '数字和文字不能比大小：5 < "6" 会直接报 TypeError。想比就先变形，让两边变成同一种东西。' },
    { t: 'key', text: '== 是问相等，= 是赋值；文字也能比大小（按字典顺序）。' },
  ],
  exercise: {
    prompt: '先自己算一遍，再写五行 print 把它们打出来（一行一个）：\n\n10 >= 10\n10 <= 9\n"apple" < "banana"\n"2" == 2\n"10" < "9"\n\n（猜完再点运行对答案，最后两个最值得琢磨）',
    starterCode: '# 五行 print，一行一个结果\n\n',
    tests: [
      {
        name: '一共五行',
        code: 'assert len([l for l in _stdout.strip().split("\\n") if l.strip()]) == 5, f"应该输出五行，你输出了 {len([l for l in _stdout.strip().split(chr(10)) if l.strip()])} 行"',
      },
      {
        name: '结果与顺序正确',
        code: '_b = [x.strip() for x in _stdout.strip().split("\\n") if x.strip()]\nassert len(_b) == 5, "先让程序输出正好五行"\nassert _b == ["True", "False", "True", "False", "True"], f"应该依次是 True / False / True / False / True，你输出的是 {_b}"',
      },
    ],
    hints: [
      '前两行直接 print(10 >= 10) 这样写，让 Python 算给你看。',
      '文字比大小是按字符顺序一个一个比，不是按数字大小。"10" < "9" 是 True，因为第一位 1 比 9 小。',
      '"2" == 2 是 False —— 左边是文字，右边是数字，它们永远不相等。',
    ],
    solution: 'print(10 >= 10)\nprint(10 <= 9)\nprint("apple" < "banana")\nprint("2" == 2)\nprint("10" < "9")',
  },
};

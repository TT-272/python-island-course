import type { Lesson } from '../types';

export const py14: Lesson = {
  id: 'py-14',
  region: 'warehouse',
  order: 14,
  title: '列表会算数',
  type: 'predict',
  xp: 10,
  summary: 'len / sum / max / min / sorted / pow',
  content: [
    { t: 'p', text: '一架子数字，能不能整体算一算？能，而且一行就够。' },
    { t: 'code', lang: 'python', code: 'scores = [8, 3, 10, 5]\nprint(len(scores))     # 4   一共几个\nprint(sum(scores))     # 26  加起来\nprint(max(scores))     # 10  最大的\nprint(min(scores))     # 3   最小的\nprint(sorted(scores))  # [3, 5, 8, 10]  从小到大排好' },
    { t: 'p', text: '这五个都是 Python 自带的函数，不用你写，直接拿来用。' },
    { t: 'p', text: 'sorted() 给你的是排好序的新列表，原来的 scores 一点没动。' },
    { t: 'p', text: 'max 和 min 还能直接比两个数，不用先装进列表：max(3, 5) 得 5，min(-1, 7) 得 -1。' },
    { t: 'p', text: '还有一个 pow —— 它是幂的函数写法：pow(2, 3) 就是 2 的 3 次方，跟 2 ** 3 完全一样。' },
    { t: 'tip', text: '名字都是英文缩写：len = length 长度，sum = 求和，max = maximum 最大，min = minimum 最小，sorted = 排好序，pow = power 幂。' },
  ],
  exercise: {
    prompt: 'scores 里装着 [8, 3, 10, 5]。\n\n先自己算一遍，再写七行 print，依次输出：\n\n1. 一共几个\n2. 加起来多少\n3. 最大的\n4. 最小的\n5. 从小到大排好\n6. max(3, 5) 的结果\n7. pow(2, 3) 的结果\n\n（先猜答案，再点运行对一下）',
    starterCode: 'scores = [8, 3, 10, 5]\n\n# 七行 print：数量、总和、最大、最小、排好序、max(3, 5)、pow(2, 3)\n\n',
    requires: ['list'],
    tests: [
      {
        name: '一共七行',
        code: 'assert len([l for l in _stdout.strip().split("\\n") if l.strip()]) == 7, f"应该输出七行，你输出了 {len([l for l in _stdout.strip().split(chr(10)) if l.strip()])} 行"',
      },
      {
        name: '前五行正确',
        code: '_n = [x.strip() for x in _stdout.strip().split("\\n") if x.strip()]\nassert len(_n) == 7, "先让程序输出正好七行"\nassert _n[:5] == ["4", "26", "10", "3", "[3, 5, 8, 10]"], f"前五行应该依次是 4 / 26 / 10 / 3 / [3, 5, 8, 10]，你输出的是 {_n[:5]}"',
      },
      {
        name: '第六行是 5',
        code: 'assert _n[5] == "5", f"第六行应该是 5（max(3, 5) 的结果），你写的是 {_n[5]!r}"',
      },
      {
        name: '第七行是 8',
        code: 'assert _n[6] == "8", f"第七行应该是 8（pow(2, 3) 的结果），你写的是 {_n[6]!r}"',
      },
      {
        name: '用上了 max(a, b) 和 pow()',
        code: '_c = _code.replace(" ", "")\nassert "max(3,5)" in _c, "第六行要用 max(a, b) 这种直接比两个数的写法"\nassert "pow(" in _c, "第七行要用 pow() 来算幂"',
      },
    ],
    hints: [
      '前五行直接 print(len(scores))、print(sum(scores))…… 让 Python 帮你算。',
      '第五行用 sorted(scores)，它会把排好序的新列表给你： [3, 5, 8, 10]',
      '第六行写 print(max(3, 5)) —— max 也能直接比两个数。',
      '第七行写 print(pow(2, 3)) —— pow 是幂的函数写法，结果是 8。',
    ],
    solution: 'scores = [8, 3, 10, 5]\nprint(len(scores))\nprint(sum(scores))\nprint(max(scores))\nprint(min(scores))\nprint(sorted(scores))\nprint(max(3, 5))\nprint(pow(2, 3))',
  },
};
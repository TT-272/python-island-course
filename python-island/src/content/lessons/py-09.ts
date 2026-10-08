import type { Lesson } from '../types';

export const py09: Lesson = {
  id: 'py-09',
  region: 'village',
  order: 9,
  title: '变形术',
  type: 'scratch',
  xp: 10,
  summary: 'int() float() str() 和 f-string：在数字和文字之间变来变去',
  content: [
    { t: 'p', text: '现在你知道 Python 里有数字，也有文字。麻烦的是：这两家人不能直接混着用。' },
    { t: 'code', lang: 'python', code: 'print("我今年" + 18)   # 报错！', demo: true, demoNote: '这段是故意报错的例子，别直接跑' },
    { t: 'p', text: '报错的原因是：文字和数字拼不到一起。得先把 18 变成文字。' },
    { t: 'p', text: '这时候就该变形术上场了。三个函数，把值从一种类型变成另一种：' },
    { t: 'code', lang: 'python', code: 'int("42")      # 文字 "42"   →  整数 42\nfloat("3.14")  # 文字 "3.14" →  小数 3.14\nstr(42)        # 整数 42     →  文字 "42"' },
    { t: 'p', text: '名字也很好记：int 是整数（integer），float 是小数，str 是字符串（string）。' },
    { t: 'p', text: '拼字符串还有第二种写法，叫 f-string —— 在引号前面加个 f，要放东西的地方写一对花括号：' },
    { t: 'code', lang: 'python', code: 'num = 42\n\nprint(str(num) + "号")   # 老写法：先变形，再拼起来\nprint(f"编号{num}")       # f-string：直接塞进去' },
    { t: 'p', text: 'f 是 format（格式化）的意思。花括号里不只能放变量，还能放算式 —— f"{num + 1}" 会得到 43。' },
    { t: 'p', text: '那 str() 还有用吗？有。str() 是"把数字变成文字"，f-string 是"把东西塞进句子里"，分工不同，两个都要会。' },
    { t: 'tip', text: '这几招最常用来对付 input() —— 因为 input() 拿回来的永远是文字，哪怕用户输入的是数字。下一关你就会撞上它。' },
    { t: 'tip', text: '变形术有前提：只能变"长得像数字"的文字。int("abc") 会报错；int("3.5") 也会报错 —— 小数要用 float()。' },
    { t: 'key', text: '数字和文字不能直接相加。要先用 int() / float() / str() 变形，或者用 f-string 直接塞进去。' },
  ],
  exercise: {
    prompt: '起手代码里已经给你三个值：raw、raw2、num（都是"格式不对"的样子）。帮它们变个形，让程序输出四行：\n\n43\n6.28\n42号\n编号42\n\n第 3 行用 str() 拼出来，第 4 行用 f-string 写。',
    starterCode: 'raw = "42"\nraw2 = "3.14"\nnum = 42\n\n# 第 1 行：把 raw 变成整数，加 1，打印\n\n# 第 2 行：把 raw2 变成小数，乘 2，打印\n\n# 第 3 行：把 num 变成文字，拼上 "号"，打印\n\n# 第 4 行：用 f-string 打印"编号"加上 num\n',
    tests: [
      {
        name: '一共四行',
        code: 'assert len([l for l in _stdout.strip().split("\\n") if l.strip()]) == 4, f"应该输出四行，你输出了 {len([l for l in _stdout.strip().split(chr(10)) if l.strip()])} 行"',
      },
      {
        name: '前三行正确',
        code: '_n = [x.strip() for x in _stdout.strip().split("\\n") if x.strip()]\nassert len(_n) == 4, "先让程序输出正好四行"\nassert _n[0] == "43", f"第一行应该是 43，你写的是 {_n[0]!r}。先 int(raw) 变成整数，再加 1"\nassert _n[1] == "6.28", f"第二行应该是 6.28，你写的是 {_n[1]!r}。先 float(raw2) 变成小数，再乘 2"\nassert _n[2] == "42号", f"第三行应该是 42号，你写的是 {_n[2]!r}。数字不能直接拼文字，要用 str(num)"',
      },
      {
        name: '第四行是 编号42',
        code: 'assert _n[3] == "编号42", f"第四行应该是 编号42，你写的是 {_n[3]!r}"',
      },
    ],
    softChecks: [
      {
        name: '第四行用了 f-string',
        code: 'assert ("f\'" in _code) or (\'f"\' in _code), "第四行要用 f-string 写：引号前面加个 f，变量放进花括号"',
      },
    ],
    hints: [
      '第 1 行：print(int(raw) + 1)',
      '第 2 行：print(float(raw2) * 2)',
      '第 3 行：print(str(num) + "号")',
      '第 4 行用 f-string：print(f"编号{num}") —— 引号前面有个 f，num 写在花括号里。',
    ],
    solution: 'raw = "42"\nraw2 = "3.14"\nnum = 42\nprint(int(raw) + 1)\nprint(float(raw2) * 2)\nprint(str(num) + "号")\nprint(f"编号{num}")',
    altSolution: {
      label: '另一种写法 · 第 3 行也能用 f-string',
      code: 'raw = "42"\nraw2 = "3.14"\nnum = 42\nprint(int(raw) + 1)\nprint(float(raw2) * 2)\nprint(f"{num}号")\nprint(f"编号{num}")',
    },
  },
};

import type { Lesson } from '../types';

export const py17: Lesson = {
  id: 'py-17',
  region: 'warehouse',
  order: 17,
  title: '名字对应值',
  type: 'guided',
  xp: 10,
  summary: '字典：按名字找，不按编号找',
  content: [
    { t: 'p', text: '列表是按编号找东西。但很多时候你根本记不住编号 —— 你只记得它叫什么。' },
    { t: 'p', text: '仓库的登记簿就是这样：名字 → 数量。这种"名字对应值"的结构叫字典（dict），用花括号 { } 装起来。' },
    { t: 'code', lang: 'python', code: 'stock = {"苹果": 3, "面包": 5}\nprint(stock["苹果"])   # 3\nprint(stock["面包"])   # 5' },
    { t: 'p', text: '冒号左边是名字，右边是值。取值的时候把名字写进方括号 —— 这里是名字，不是编号。' },
    { t: 'tip', text: '列表和字典的区别，一句话就说完：列表按"第几个"找，字典按"叫什么"找。用哪个，看你怎么记住这个东西。' },
  ],
  exercise: {
    prompt: '建一个字典 stock，装两样货：苹果 3 个、面包 5 个。\n\n然后打印出面包的数量。\n\n（预期输出：5）',
    starterCode: '# 建一个字典 stock：苹果 3 个，面包 5 个\n\n# 打印面包的数量\n',
    tests: [
      {
        name: '字典建对了',
        code: 'assert "stock" in globals(), "还没有创建 stock 这个变量"\nassert stock == {"苹果": 3, "面包": 5}, f"stock 里应该是 苹果 3 个、面包 5 个，现在是 {stock}"',
      },
      {
        name: '输出对了',
        code: 'assert _stdout.strip() == "5", f"应该输出 5，你的程序输出的是 {_stdout.strip()!r}"',
      },
    ],
    hints: [
      '字典的写法：stock = {"苹果": 3, "面包": 5}',
      '取值把名字写进方括号：print(stock["面包"])',
    ],
    solution: 'stock = {"苹果": 3, "面包": 5}\nprint(stock["面包"])',
  },
};
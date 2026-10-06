import type { Lesson } from '../types';

export const py13: Lesson = {
  id: 'py-13',
  region: 'warehouse',
  order: 13,
  title: '往里加东西',
  type: 'fill',
  xp: 10,
  summary: 'append / insert / remove / pop：货架能改',
  content: [
    { t: 'p', text: '货架空着要补货，东西不想要了要下架。列表最有用的一点就是它能改。' },
    { t: 'p', text: '四个最常用的动作：' },
    { t: 'code', lang: 'python', code: '货架.append(东西)       # 加到末尾\n货架.insert(位置, 东西)  # 插到指定位置\n货架.remove(东西)       # 按内容拿掉\n货架.pop()              # 拿掉最后一个' },
    { t: 'p', text: 'append 是"追加"，insert 是"插入"，remove 是"移除"，pop 是"弹出来" —— 英文名就是它们干的事。' },
    { t: 'p', text: 'remove 和 pop 容易混：remove 是"我知道不要哪个，按内容找"，pop 是"我知道不要第几个，按位置拿"。pop 不填位置就默认拿最后一个。' },
    { t: 'p', text: '注意 insert 有两个参数：先写插到第几格，再写插什么。' },
    { t: 'tip', text: 'insert 之后，原来那一格以及它后面的东西都会自动往后挪一格 —— 列表会自己腾地方，你不用管。' },
  ],
  exercise: {
    prompt: 'shelf 这个货架现在装着 ["苹果", "牛奶"]。\n\n把下面三个 "???" 换成正确的东西，再加一行用 pop() 把最后一个拿掉。\n\n货架最后应该变成：\n\n[\'鸡蛋\', \'苹果\']\n\n也就是：末尾加上面包、最前面插入鸡蛋、把牛奶拿掉、最后 pop 掉一个。',
    starterCode: 'shelf = ["苹果", "牛奶"]\n\n# 把下面三个 "???" 换成题目要求的东西\nshelf.append("???")\nshelf.insert(0, "???")\nshelf.remove("???")\n\n# 再加一行：用 pop() 把最后一个拿掉\n\nprint(shelf)\n',
    requires: ['list'],
    tests: [
      {
        name: '货架摆对了',
        code: 'assert shelf == ["鸡蛋", "苹果"], f"货架最后应该按顺序剩下 鸡蛋、苹果，现在是 {shelf}"',
      },
      {
        name: '整个货架打印出来了',
        code: 'assert _stdout.strip().endswith("[\'鸡蛋\', \'苹果\']"), f"最后应该用 print(shelf) 把整个货架打出来，你的程序输出的是 {_stdout.strip()!r}"',
      },
      {
        name: '用上了 pop()',
        code: 'assert ".pop(" in _code, "最后要加一行 shelf.pop() —— 它按位置拿，不填位置就是拿掉最后一个"',
      },
    ],
    hints: [
      'append 是加到末尾：shelf.append("面包")',
      'insert 是插到指定位置：shelf.insert(0, "鸡蛋")',
      'remove 是按内容拿掉：shelf.remove("牛奶")',
      '最后再加一行 shelf.pop() —— 不填位置就是拿掉最后一个。',
    ],
    solution: 'shelf = ["苹果", "牛奶"]\nshelf.append("面包")\nshelf.insert(0, "鸡蛋")\nshelf.remove("牛奶")\nshelf.pop()\nprint(shelf)',
    altSolution: {
      label: '另一种写法 · 不用 pop，也能拿掉最后一个',
      code: 'shelf = ["苹果", "牛奶"]\nshelf.append("面包")\nshelf.insert(0, "鸡蛋")\nshelf.remove("牛奶")\nshelf.remove(shelf[-1])\nprint(shelf)',
    },
  },
};

import type { Lesson } from '../types';

export const py07: Lesson = {
  id: 'py-07',
  region: 'village',
  order: 7,
  title: '文字的重量',
  type: 'fill',
  xp: 10,
  summary: '用 len() 数一数文字有几个字',
  content: [
    { t: 'p', text: '文字在 Python 里有个正式名字：字符串（string，简写成 str）。' },
    { t: 'p', text: '字符串能称重 —— 数一数它有几个字符。称重用的是 len()。' },
    { t: 'code', lang: 'python', code: 'print(len("你好"))    # 2\nprint(len("Python"))  # 6' },
    { t: 'p', text: 'len 是 length（长度）的缩写。汉字、英文字母、数字，每一个都算一个字符。' },
    { t: 'p', text: '空格也算！len("a b") 是 3 —— a、空格、b。引号本身不算在里面。' },
    { t: 'tip', text: '这个有什么用？以后你要检查用户输入合不合理（比如密码够不够长、名字有没有填），靠的就是它。' },
    { t: 'p', text: 'len 既能量直接写出来的文字，也能量变量里装着的文字：' },
    { t: 'code', lang: 'python', code: 'name = "小船长"\nprint(len(name))    # 3\nprint(len("abc"))   # 3' },
    { t: 'tip', text: 'len 只能量"有长度"的东西。len("3") 是 1（一个字符），但 len(3) 会报错 —— 数字没有长度。' },
    { t: 'key', text: 'len() 数的是字符个数：空格也算一个，引号本身不算。' },
  ],
  exercise: {
    prompt: '编辑器里那行 len("") 量错了东西。把括号里的内容换成正确的，让程序打印出 word 有几个字。\n\n（预期输出：3）',
    starterCode: 'word = "冒险者"\n\n# 把 len("") 里的空字符串换成该量的东西\nprint(len(""))\n',
    tests: [
      {
        name: '长度对了',
        code: 'assert _stdout.strip() == "3", f"应该输出 3，你的程序输出的是 {_stdout.strip()!r}"',
      },
      {
        name: '没有多余的输出',
        code: 'assert len([l for l in _stdout.strip().split("\\n") if l.strip()]) == 1, "只应该输出一行"',
      },
    ],
    hints: [
      'len() 的括号里要写"量谁" —— 这里要量的是 word。',
      '写成 print(len(word))。注意 word 不要加引号：加了引号，量的是 word 这四个字母，结果是 4。',
    ],
    solution: 'word = "冒险者"\nprint(len(word))',
  },
};

import type { Lesson } from '../types';

export const py29: Lesson = {
  id: 'py-29',
  region: 'workshop',
  order: 29,
  title: '数不清的时候',
  type: 'scratch',
  xp: 10,
  summary: 'while：只要条件成立就一直跑',
  content: [
    { t: 'p', text: 'for 适合"我知道要跑几遍"。可有时候你并不知道要跑几遍 —— 你只知道"跑到满意为止"。' },
    { t: 'p', text: '这时候用 while：只要条件成立，它就一圈一圈跑下去。' },
    { t: 'code', lang: 'python', code: 'n = 1\n\nwhile n <= 5:\n    print(n)\n    n = n + 1' },
    { t: 'p', text: '这个程序会打印 1 到 5。关键是循环体里那行 n = n + 1 —— 它每跑一圈就让 n 长大一点，条件早晚会不成立，循环才停得下来。' },
    { t: 'p', text: 'n = n + 1 有个简写：n += 1。减就是 n -= 1。意思一模一样，只是少打几个字 —— 以后看别人的代码别不认识。' },
    { t: 'tip', text: 'while 的条件不是检查一次就完事，是每跑完一圈就重新检查一次。所以只要条件一直成立，它就会一直跑 —— 忘了让 n 变化，程序就卡死了。' },
  ],
  exercise: {
    prompt: '用 while 倒数：打印 5、4、3、2、1，一行一个。\n\n（从 5 开始，每圈减 1，减到 0 就停。减 1 要用简写 n -= 1）',
    starterCode: '# 用 while 倒数：5 → 1，一行一个\n# 提示：n 从 5 开始，每圈用简写 n -= 1 减 1，条件是 n >= 1\n\n',
    tests: [
      {
        name: '一共五行',
        code: 'assert len([l for l in _stdout.strip().split("\\n") if l.strip()]) == 5, f"应该输出五行，你输出了 {len([l for l in _stdout.strip().split(chr(10)) if l.strip()])} 行"',
      },
      {
        name: '从 5 数到 1',
        code: '_n = [x.strip() for x in _stdout.strip().split("\\n") if x.strip()]\nassert len(_n) == 5, "先让程序输出正好五行"\nassert _n == ["5", "4", "3", "2", "1"], f"应该依次输出 5 4 3 2 1，你输出的是 {_n}"',
      },
      {
        name: '用了简写 -=',
        code: 'assert "-=" in _code, "这一关的减 1 要用简写 n -= 1（它跟 n = n - 1 意思一样）"',
      },
    ],
    hints: [
      '开头：n = 5，然后 while n >= 1:',
      '循环体里两行：先 print(n)，再让 n 减 1。',
      '减 1 用简写写成 n -= 1。这一行千万别忘 —— 少了它 n 永远是 5，就死循环了。',
    ],
    solution: 'n = 5\nwhile n >= 1:\n    print(n)\n    n -= 1',
    altSolution: {
      label: '另一种写法 · 写全了也行（这一关专门练简写）',
      code: 'n = 5\nwhile n >= 1:\n    print(n)\n    n = n - 1',
    },
  },
};

import type { Lesson } from '../types';

export const py10: Lesson = {
  id: 'py-10',
  region: 'village',
  order: 10,
  title: '问用户要数据',
  type: 'guided',
  xp: 10,
  summary: '用 input() 让程序开口提问',
  content: [
    { t: 'p', text: '到现在为止，你的程序只会说它自己想说的话。现在让它学会问。' },
    { t: 'code', lang: 'python', code: 'name = input("你叫什么名字？")\nprint(name)' },
    { t: 'p', text: 'input() 会做三件事：把括号里的话显示出来 → 停下来等用户打字 → 把用户打的字拿回来。前面的 name = 就是把它拿回来的东西装进盒子。' },
    { t: 'p', text: '重点来了：input() 拿回来的永远是文字。用户输入 18，你拿到的是文字 "18"，不是数字 18。' },
    { t: 'p', text: '想拿数字，得套上上一关的变形术：age = int(input("你多大了？"))' },
    { t: 'tip', text: '因为这个"永远是文字"的脾气，无数新手第一次做计算题时被卡住。记住它，你就领先一半人了。' },
  ],
  exercise: {
    prompt: '问一句「你叫什么名字？」，把回答装进变量 name，然后打印出来。\n\n点「运行」的时候，系统会自动替你回答：小船长。\n\n（自动填的答案不换行，所以你会在同一行看到问题和答案 —— 这是正常的。最后要打印出来的还是 小船长）',
    starterCode: '# 用 input() 问一句，把回答装进 name\n\n# 然后打印 name\n',
    // 运行和判分时自动喂给 input() 的答案
    stdin: '小船长',
    tests: [
      {
        name: '把回答接住了',
        code: 'assert "name" in globals(), "还没有创建 name 这个变量"\nassert name == "小船长", f"name 里装的应该是 小船长，现在装的是 {name!r}"',
      },
      {
        name: '打印出来了',
        code: 'assert _stdout.strip().endswith("小船长"), f"最后应该打印出 小船长，你的程序输出的是 {_stdout.strip()!r}"',
      },
    ],
    hints: [
      '写成 name = input("你叫什么名字？")',
      '然后再写一行 print(name)。',
    ],
    solution: 'name = input("你叫什么名字？")\nprint(name)',
  },
};
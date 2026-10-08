import type { Lesson } from '../types';

export const py40: Lesson = {
  id: 'py-40',
  region: 'forge',
  order: 40,
  title: '结业：猜数字游戏',
  type: 'free',
  xp: 30,
  boss: true,
  summary: '把学过的零件拼成一个真能玩的游戏',
  content: [
    { t: 'p', text: '到这儿，你已经走完 40 关里的最后一段路了。' },
    { t: 'p', text: '这一关不讲新东西 —— 要把你手上的零件拼成一个真能玩的小游戏：猜数字。' },
    { t: 'p', text: '零件清单：random 出秘密数字、input 问用户、int 做变形、while 反复猜、if / elif 给提示、print 说话。缺哪个都不行。' },
    { t: 'p', text: '还有个老手都在用的技巧：调试的时候先把秘密数字写死成 3。固定住不动的部分，你才能确定出错的是别的地方 —— 跑通了再换成随机数。' },
    { t: 'tip', text: 'input 的提示语和后面打印的东西会挤在同一行（浏览器里没有终端回显）。想让提示语单独占一行，可以先用 print 提问，再用不填参数的 input() 读。' },
    { t: 'key', text: '把变量、判断、循环、函数拼起来，就成了一个真能玩的游戏。' },
  ],
  exercise: {
    prompt: '写一个猜数字游戏：\n\n1. 秘密数字先写死：secret = 3\n2. 用 while 一直猜，直到猜中为止\n3. 每轮用 input() 问用户猜几，用 int() 变成整数\n4. 猜小了打印 小了；猜大了打印 大了；猜中打印 猜对了！\n\n点「运行」时，系统会连续回答：1、5、3\n\n（跑通之后，把 secret = 3 换成 random.randint(1, 6)，自己玩几把）',
    starterCode: '# 猜数字游戏\n# 1. 秘密数字先写死：secret = 3\n\n# 2. while 的条件怎么写？先给一个初值接住猜测，比如 guess = 0\n\n# 3. 循环里：用 input + int() 拿到猜测，再用 if / elif 给提示\n\n',
    // 运行和判分时连续喂给 input() 的三次猜测
    stdin: '1\n5\n3',
    requires: ['if', 'while', 'input'],
    tests: [
      {
        name: '两次提示都对',
        code: 'assert "小了" in _stdout, f"猜 1 的时候（比 3 小）应该提示 小了，你的输出是 {_stdout.strip()!r}"\nassert "大了" in _stdout, f"猜 5 的时候（比 3 大）应该提示 大了，你的输出是 {_stdout.strip()!r}"\nassert _stdout.index("小了") < _stdout.index("大了"), "顺序不对：先猜的是 1，应该先出现 小了"',
      },
      {
        name: '最后猜中了',
        code: 'assert _stdout.strip().endswith("猜对了！"), f"最后猜中 3 的时候应该打印 猜对了！，你的输出是 {_stdout.strip()!r}"',
      },
      {
        name: '猜对之后就结束',
        code: 'assert _stdout.count("猜对了！") == 1, "猜对之后循环就该停了，猜对了！只应该出现一次"',
      },
    ],
    hints: [
      '开头两行：secret = 3，然后 guess = 0（先给个初值，while 才好判断）。',
      '循环写成 while guess != secret: —— 不相等就一直猜。',
      '循环体里：guess = int(input("猜一个数字："))，然后 if guess < secret: 打印 小了；elif guess > secret: 打印 大了；else: 打印 猜对了！',
    ],
    solution: 'secret = 3\nguess = 0\n\nwhile guess != secret:\n    guess = int(input("猜一个数字："))\n    if guess < secret:\n        print("小了")\n    elif guess > secret:\n        print("大了")\n    else:\n        print("猜对了！")',
    altSolution: {
      label: '另一种写法 · 用 while True + break',
      code: 'secret = 3\n\nwhile True:\n    guess = int(input("猜一个数字："))\n    if guess < secret:\n        print("小了")\n    elif guess > secret:\n        print("大了")\n    else:\n        print("猜对了！")\n        break',
    },
    bonus: {
      prompt: '进阶挑战：加上计数 —— 猜中之后，再打印一句"一共猜了几次"。\n\n（喂进去的是 1、5、3，所以正确的次数是 3）',
      starterCode: '# 在猜数字游戏的基础上加一个计数器\n# 每猜一轮就加 1，猜中之后把次数打印出来\n\n',
      tests: [
        {
          name: '次数正确',
          code: '_n = [x.strip() for x in _stdout.strip().split("\\n") if x.strip()]\nassert _n[-1] == "3", f"最后一行应该是次数 3，你输出的是 {_n[-1]!r}"',
        },
        {
          name: '提示和结果都还在',
          code: 'assert "小了" in _stdout and "大了" in _stdout and "猜对了！" in _stdout, f"游戏本身的提示不能丢，你的输出是 {_stdout.strip()!r}"',
        },
      ],
    },
  },
};

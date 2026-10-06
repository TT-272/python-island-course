import type { Lesson } from '../types';

export const py34: Lesson = {
  id: 'py-34',
  region: 'workshop',
  order: 34,
  title: '猜数字前传',
  type: 'scratch',
  xp: 30,
  boss: true,
  summary: 'for 循环 + 输入 + 判断，先做一版只猜三次的',
  content: [
    { t: 'p', text: '工坊的结业作品是"猜数字游戏"。这一关先做它的前传 —— 完整版留到熔炉。' },
    { t: 'p', text: '游戏需要三样东西：一个藏起来的秘密数字、用户的猜测、还有一个判断。' },
    { t: 'p', text: '1. 秘密数字先写死成 4\n2. 用 for 循环猜 3 次\n3. 每轮用 input() 问，再用 int() 把回答变成整数\n4. 猜小了说 小了，猜大了说 大了，猜中就说 猜对了！' },
    { t: 'p', text: '为什么叫"前传"？因为这一版只管猜 3 次，猜完就结束。真正的游戏要"一直猜到对"—— 那得换 while 来做，也就是熔炉的结业作品。' },
    { t: 'tip', text: '写游戏的老规矩：调试的时候先把秘密数字写死。把不动的那部分固定住，你才能确定出错的是别的地方 —— 跑通了，再换成 random.randint(1, 6)。' },
  ],
  exercise: {
    prompt: '写一个猜数字游戏的前传，四步：\n\n1. 秘密数字先写死：secret = 4\n2. 用 for 循环猜 3 次\n3. 每轮用 input() 问用户猜几，用 int() 变成整数\n4. 猜小了打印 小了；猜大了打印 大了；猜中打印 猜对了！\n\n点「运行」时，系统会连续回答：2、6、4\n\n（跑通之后，把 secret = 4 换成 random.randint(1, 6)，自己玩几把）',
    starterCode: '# 猜数字前传\n# 1. 秘密数字先写死：secret = 4\n\n# 2. for 循环猜 3 次\n\n# 3. 循环里：用 input 问一句，再用 int() 变成整数\n\n# 4. 用 if / elif / else 给提示\n',
    // 运行和判分时连续喂给 input() 的三次猜测
    stdin: '2\n6\n4',
    requires: ['if', 'for', 'input'],
    tests: [
      {
        name: '两次提示都对',
        code: 'assert "小了" in _stdout, f"猜 2 的时候（比 4 小）应该提示 小了，你的输出是 {_stdout.strip()!r}"\nassert "大了" in _stdout, f"猜 6 的时候（比 4 大）应该提示 大了，你的输出是 {_stdout.strip()!r}"\nassert _stdout.index("小了") < _stdout.index("大了"), "顺序不对：先猜的是 2，应该先出现 小了"',
      },
      {
        name: '最后猜中了',
        code: 'assert _stdout.strip().endswith("猜对了！"), f"最后猜中 4 的时候应该打印 猜对了！，你的输出是 {_stdout.strip()!r}"',
      },
      {
        name: '一共给了三次提示',
        code: '_total = _stdout.count("小了") + _stdout.count("大了") + _stdout.count("猜对了！")\nassert _total == 3, f"for 循环跑 3 次，应该有 3 条提示，你的输出里有 {_total} 条"',
      },
    ],
    hints: [
      '开头：secret = 4，然后 for i in range(3):',
      '循环体第一行：guess = int(input("猜一个数字：")) —— 别忘 int()。',
      '然后再写判断：if guess < secret: 打印 小了；elif guess > secret: 打印 大了；else: 打印 猜对了！',
    ],
    solution: 'secret = 4\nfor i in range(3):\n    guess = int(input("猜一个数字："))\n    if guess < secret:\n        print("小了")\n    elif guess > secret:\n        print("大了")\n    else:\n        print("猜对了！")',
  },
};
import type { Lesson } from '../types';

export const py05: Lesson = {
  id: 'py-05',
  region: 'village',
  order: 5,
  title: '会变的盒子',
  type: 'guided',
  xp: 10,
  summary: '把值装进变量，随时取出来用',
  content: [
    { t: 'p', text: '上一关你让 Python 开了口。但它有个毛病：说完就忘。' },
    { t: 'p', text: '想让程序记住点东西，得给它一个盒子，盒子上贴个名字 —— 这就是"变量"。' },
    { t: 'code', lang: 'python', code: 'name = "小船长"\nprint(name)' },
    { t: 'p', text: '这里的 = 不是数学里的"等于"，是"把右边装进左边"。上面这行读作：把 "小船长" 装进叫 name 的盒子。' },
    { t: 'p', text: '盒子里的东西随时能取出来用，而且取多少次都不会少。' },
    { t: 'tip', text: '变量名用英文小写，比如 name、age、score —— 这是全世界的习惯。Python 其实允许中文变量名，但没人那么写，你以后看别人的代码会看不懂。' },
    { t: 'p', text: '盒子里的东西还能换 —— 再赋一次值，新的就盖掉旧的：' },
    { t: 'code', lang: 'python', code: 'score = 10\nprint(score)   # 10\nscore = 20     # 重新装一次，旧的被盖掉\nprint(score)   # 20' },
    { t: 'key', text: '= 不是"等于"，是"把右边装进左边"；变量名用小写英文，比如 name、age。' },
  ],
  exercise: {
    prompt: '照上面的写法，建一个变量 name，把 "小船长" 装进去，然后打印它。\n\n（预期输出：小船长）',
    // 末尾换行：光标落在最后一行，学员直接往下写
    starterCode: '# 建一个变量 name，把 "小船长" 装进去\n\n# 然后把它打印出来\n',
    tests: [
      {
        name: '变量装对了',
        code: 'assert "name" in globals(), "还没有创建 name 这个变量"\nassert name == "小船长", f"name 里装的应该是 小船长，现在装的是 {name!r}"',
      },
      {
        name: '打印出来了',
        code: 'assert _stdout.strip() == "小船长", f"应该打印出 小船长，你的程序输出的是 {_stdout.strip()!r}"',
      },
    ],
    hints: [
      '先把变量建起来：name = "小船长"',
      '再打印它：print(name)。注意 name 两边不要加引号 —— 加了引号就变成打印 name 这四个字母了。',
    ],
    solution: 'name = "小船长"\nprint(name)',
  },
};

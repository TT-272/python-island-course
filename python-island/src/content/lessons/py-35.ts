import type { Lesson } from '../types';

export const py35: Lesson = {
  id: 'py-35',
  region: 'forge',
  order: 35,
  title: '打包一段代码',
  type: 'guided',
  xp: 10,
  summary: 'def：写一次，用很多次',
  content: [
    { t: 'p', text: '有些代码你会写一遍又一遍。想写一次、用很多次，就把它打包起来 —— 用 def 造一个你自己的命令。' },
    { t: 'code', lang: 'python', code: 'def say_hi():\n    print("你好！")\n\nsay_hi()\nsay_hi()' },
    { t: 'p', text: 'def 那一行是"造这个命令"，底下缩进的那块是"这个命令做什么"。' },
    { t: 'p', text: '关键的一点：定义的时候不会执行。真正跑起来，是在你写 say_hi() 的那一刻 —— 这叫"调用"。' },
    { t: 'p', text: '注意最后两行 say_hi() 是顶格的，没有缩进 —— 它们不属于函数，是函数外面的调用。' },
    { t: 'tip', text: '函数名也用英文小写，多个单词用下划线连起来（比如 say_hi）—— 跟变量名是同一套习惯。' },
  ],
  exercise: {
    prompt: '写一个函数 say_hi，让它打印 你好！\n\n然后调用它三次。\n\n（预期输出三行，每行都是 你好！）',
    starterCode: '# 1. 定义函数 say_hi，让它打印 你好！\n\n# 2. 调用它三次\n\n',
    tests: [
      {
        name: '三行都对',
        code: '_n = [x.strip() for x in _stdout.strip().split("\\n") if x.strip()]\nassert _n == ["你好！", "你好！", "你好！"], f"应该输出三行 你好！，你输出的是 {_n}"',
      },
      {
        name: '函数真的定义出来了',
        code: 'assert "say_hi" in globals(), "还没有定义 say_hi 这个函数"\nassert callable(say_hi), "say_hi 应该是一个函数"',
      },
    ],
    hints: [
      '定义写成：def say_hi(): —— 末尾的冒号别忘了。',
      '下一行缩进 4 个空格，写 print("你好！")。',
      '换行、顶格，写三次 say_hi()。',
    ],
    solution: 'def say_hi():\n    print("你好！")\n\nsay_hi()\nsay_hi()\nsay_hi()',
  },
};
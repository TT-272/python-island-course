import type { Lesson } from '../types';

export const py22: Lesson = {
  id: 'py-22',
  region: 'forest',
  order: 22,
  title: '多条岔路',
  type: 'scratch',
  xp: 10,
  summary: 'elif：三条以上的岔路怎么走',
  content: [
    { t: 'p', text: '两个分支不够用的时候怎么办？在中间加 elif —— 读作"否则如果"。' },
    { t: 'code', lang: 'python', code: 'score = 85\n\nif score >= 90:\n    print("优秀")\nelif score >= 60:\n    print("及格")\nelse:\n    print("不及格")' },
    { t: 'p', text: 'Python 从上往下一条一条检查，谁先成立就走谁，走完直接跳出去，后面的一律不再看。' },
    { t: 'p', text: '所以顺序很重要。要是把 score >= 60 写在最前面，85 分会走进"及格"，永远到不了"优秀" —— 因为轮到第二行的时候已经跳出去了。' },
    { t: 'tip', text: 'elif 可以写很多个，最后那个 else 是可选的。不过建议都加上 —— 它能兜住你没想到的情况，不至于什么都不输出。' },
  ],
  exercise: {
    prompt: 'score 现在是 72。\n\n写一个三岔判断，打印分数对应的等级：\n\n90 分及以上 → 优秀\n60 分及以上 → 及格\n其他 → 不及格\n\n（预期输出：及格）\n\n写完之后，把 score 改成 95 和 40 各跑一遍，看看三条路是不是都走得到。',
    starterCode: 'score = 72\n\n# 三岔判断：优秀 / 及格 / 不及格\n# 提示：if、elif、else，每一块都要缩进 4 个空格\n\n',
    tests: [
      {
        name: '走到正确的分支',
        code: 'assert _stdout.strip() == "及格", f"72 分应该打印 及格，你的程序输出的是 {_stdout.strip()!r}"',
      },
      {
        name: '只有一行',
        code: 'assert len([l for l in _stdout.strip().split("\\n") if l.strip()]) == 1, "只应该输出一行"',
      },
    ],
    hints: [
      '第一岔：if score >= 90: 然后缩进打印 优秀。',
      '第二岔：elif score >= 60: 然后缩进打印 及格。elif 就是"否则如果"。',
      '最后一岔：else: 然后缩进打印 不及格 —— 兜住剩下的所有情况。',
    ],
    solution: 'score = 72\nif score >= 90:\n    print("优秀")\nelif score >= 60:\n    print("及格")\nelse:\n    print("不及格")',
    altSolution: {
      label: '另一种写法 · 用嵌套 if 代替 elif',
      code: 'score = 72\nif score >= 60:\n    if score >= 90:\n        print("优秀")\n    else:\n        print("及格")\nelse:\n    print("不及格")',
    },
  },
};

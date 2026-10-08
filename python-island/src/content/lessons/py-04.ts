import type { Lesson } from '../types';

export const py04: Lesson = {
  id: 'py-04',
  region: 'beach',
  order: 4,
  title: '篝火夜话',
  type: 'scratch',
  xp: 30,
  boss: true,
  summary: '用三行输出，写下今天的三句话',
  content: [
    { t: 'p', text: '一个程序可以有很多行。Python 从上往下，一行一行地执行。' },
    { t: 'p', text: 'print() 写几次，就输出几行。就这么简单。' },
    { t: 'p', text: '这一关没有新语法 —— 用你已经会的东西就够了。' },
    { t: 'p', text: '天黑了。篝火点起来，写下你今天的三句话。' },
    { t: 'p', text: '注意顺序：Python 从上往下执行，先写的先输出。' },
    { t: 'key', text: '想输出几行，就写几行 print()。' },
  ],
  exercise: {
    prompt: '依次输出三行（内容和顺序都要对）：\n\n我在 Python 岛\n今天学会了 print\n明天继续',
    starterCode: '# 写三行 print\n',
    tests: [
      {
        name: '一共三行',
        code: 'assert len([l for l in _stdout.strip().split("\\n") if l.strip()]) == 3, f"应该输出三行，你输出了 {len([l for l in _stdout.strip().split(chr(10)) if l.strip()])} 行"',
      },
      {
        name: '第一行正确',
        code: '_l = [x.strip() for x in _stdout.strip().split("\\n") if x.strip()]\nassert len(_l) == 3, "先让程序输出正好三行"\nassert _l[0] == "我在 Python 岛", f"第一行应该是 我在 Python 岛，你写的是 {_l[0]!r}"',
      },
      {
        name: '第二行正确',
        code: 'assert _l[1] == "今天学会了 print", f"第二行应该是 今天学会了 print，你写的是 {_l[1]!r}"',
      },
      {
        name: '第三行正确',
        code: 'assert _l[2] == "明天继续", f"第三行应该是 明天继续，你写的是 {_l[2]!r}"',
      },
    ],
    hints: [
      '一行 print 负责一行输出。三行内容 → 三行 print。',
      '注意第二行里的 print 是文字的一部分，所以要用引号包在字符串里面。',
    ],
    solution: 'print("我在 Python 岛")\nprint("今天学会了 print")\nprint("明天继续")',
    bonus: {
      prompt: '进阶挑战：用四行，把「明天继续」改成「明天见，Python 岛！」，并在最后加一行「（完）」',
      starterCode: '# 四行 print，内容照题目写的来\n',
      tests: [
        {
          name: '一共四行',
          code: 'assert len([l for l in _stdout.strip().split("\\n") if l.strip()]) == 4, f"应该输出四行，你输出了 {len([l for l in _stdout.strip().split(chr(10)) if l.strip()])} 行"',
        },
        {
          name: '内容与顺序正确',
          code: '_b = [x.strip() for x in _stdout.strip().split("\\n") if x.strip()]\nassert _b == ["我在 Python 岛", "今天学会了 print", "明天见，Python 岛！", "（完）"], f"内容对不上，你写的是 {_b}"',
        },
      ],
    },
  },
};

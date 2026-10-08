import type { Lesson } from '../types';

export const py21: Lesson = {
  id: 'py-21',
  region: 'forest',
  order: 21,
  title: '否则',
  type: 'fill',
  xp: 10,
  summary: 'else：条件不成立的时候走这边',
  content: [
    { t: 'p', text: 'if 只管"成立的时候"。那不成立的时候怎么办？加一个 else。' },
    { t: 'code', lang: 'python', code: 'score = 45\n\nif score >= 60:\n    print("及格")\nelse:\n    print("不及格")' },
    { t: 'p', text: 'else 就是"否则"。条件不成立，代码就拐到它这边来。' },
    { t: 'p', text: '注意 else 后面也有冒号，后面也要缩进一块 —— 跟 if 一样的规矩。' },
    { t: 'tip', text: '二选一的判断，一定有且只有一个分支会执行：要么 if 那块，要么 else 那块。不会两个都跑，也不会两个都不跑。' },
    { t: 'key', text: 'else 是「否则」：if 不成立时走这边。' },
  ],
  exercise: {
    prompt: '编辑器里这段代码只写了一半：条件成立时打印 可以进网吧，但条件不成立时什么都不做。\n\n把"否则"的那一半补上，让它不成立时打印 回家写作业。\n\n（age 是 15，所以预期输出：回家写作业）',
    starterCode: 'age = 15\n\nif age >= 18:\n    print("可以进网吧")\n\n# 还差一半：否则就打印 "回家写作业"\n\n',
    requires: ['if'],
    tests: [
      {
        name: '走到正确的分支',
        code: 'assert _stdout.strip() == "回家写作业", f"age 是 15，应该走到否则那一支打印 回家写作业，你的程序输出的是 {_stdout.strip()!r}"',
      },
      {
        name: '只有一行',
        code: 'assert len([l for l in _stdout.strip().split("\\n") if l.strip()]) == 1, "只应该输出一行"',
      },
    ],
    hints: [
      '补上一块：else: —— 别忘了冒号。',
      '下一行缩进 4 个空格，写 print("回家写作业")。',
      'else 不能单独出现，它必须紧跟在一个 if 的后面。',
    ],
    solution: 'age = 15\nif age >= 18:\n    print("可以进网吧")\nelse:\n    print("回家写作业")',
  },
};

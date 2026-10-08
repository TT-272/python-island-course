import type { Lesson } from '../types';

export const py25: Lesson = {
  id: 'py-25',
  region: 'forest',
  order: 25,
  title: '真假不用比',
  type: 'predict',
  xp: 10,
  summary: '0、""、[]、None 本身就当假处理',
  content: [
    { t: 'p', text: '到现在为止，真假都是比出来的。但 Python 比你想的更宽松：有些东西不用比，它自己就顶得上 False。' },
    { t: 'code', lang: 'python', code: 'if 0:\n    print("这行不会打印")\n\nif 1:\n    print("这行会打印")   # 1 是真的' },
    { t: 'p', text: '记一张"假名单"：0、0.0、空字符串 ""、空列表 []、空字典 {}、还有 None —— 这几样都当 False 用。' },
    { t: 'p', text: '除了它们，其他基本都是 True。特别注意：" "（里面有一个空格）不是空的，所以它是 True。' },
    { t: 'p', text: '想亲眼看看某样东西是真是假，用 bool() 套一下就行 —— 又是变形术，跟 int()、str() 是一家人。' },
    { t: 'tip', text: '这个特性很实用：想检查用户有没有填东西、列表里有没有内容，直接写 if 列表: 就行，不用写 if len(列表) > 0:。' },
    { t: 'key', text: '0、""、[]、None 本身就当「假」处理。' },
  ],
  exercise: {
    prompt: '先自己猜一遍，再写六行 print 输出下面六个式子的结果（一行一个）：\n\nbool(0)\nbool(1)\nbool("")\nbool(" ")\nbool([])\nbool(None)\n\n（第四个是个小陷阱，看仔细）',
    starterCode: '# 六行 print，一行一个结果\n\n',
    requires: ['list'],
    tests: [
      {
        name: '一共六行',
        code: 'assert len([l for l in _stdout.strip().split("\\n") if l.strip()]) == 6, f"应该输出六行，你输出了 {len([l for l in _stdout.strip().split(chr(10)) if l.strip()])} 行"',
      },
      {
        name: '结果与顺序正确',
        code: '_b = [x.strip() for x in _stdout.strip().split("\\n") if x.strip()]\nassert len(_b) == 6, "先让程序输出正好六行"\nassert _b == ["False", "True", "False", "True", "False", "False"], f"应该依次是 False / True / False / True / False / False，你输出的是 {_b}"',
      },
    ],
    hints: [
      '直接 print(bool(0)) 这样写，让 Python 告诉你。',
      '0、空字符串 ""、空列表 []、None 都是假。',
      'bool(" ") 是 True —— 里面有一个空格，它就不算空了。',
    ],
    solution: 'print(bool(0))\nprint(bool(1))\nprint(bool(""))\nprint(bool(" "))\nprint(bool([]))\nprint(bool(None))',
  },
};

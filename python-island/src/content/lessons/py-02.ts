import type { Lesson } from '../types';

export const py02: Lesson = {
  id: 'py-02',
  region: 'beach',
  order: 2,
  title: '你好，世界',
  type: 'guided',
  xp: 10,
  summary: '引号成对，标点一模一样',
  content: [
    { t: 'p', text: '引号里的文字，在 Python 里叫"字符串"。' },
    { t: 'p', text: '单引号 \'...\' 和双引号 "..." 都可以用，但开头的和结尾的必须是同一种。' },
    { t: 'p', text: '还有一件事要提前说：计算机不会"猜"你的意思。逗号、感叹号、空格，它都会逐字比对。' },
    { t: 'p', text: '多一个空格，它就说你错了。听上去苛刻，但这也是它可靠的原因。' },
  ],
  exercise: {
    prompt: '打印出：Hello, Python!',
    starterCode: '# 打印 Hello, Python!\n',
    tests: [
      {
        name: '输出内容正确',
        code: 'assert _stdout.strip() == "Hello, Python!", f"应该输出 Hello, Python!，你的程序输出的是 {_stdout.strip()!r}"',
      },
      {
        name: '感叹号是英文的',
        code: 'assert "！" not in _stdout, "你用的是中文感叹号「！」，Python 这边要英文的「!」"',
      },
    ],
    hints: [
      '注意最后那个感叹号。',
      '完整写法长这样：print("Hello, Python!")',
    ],
    solution: 'print("Hello, Python!")',
  },
};

import type { Lesson } from '../types';

export const py28: Lesson = {
  id: 'py-28',
  region: 'workshop',
  order: 28,
  title: '挨个看一遍',
  type: 'fill',
  xp: 10,
  summary: 'for 直接遍历列表和字符串',
  content: [
    { t: 'p', text: 'for 最常见的用法不是数数字，而是"把一堆东西挨个看一遍"。' },
    { t: 'code', lang: 'python', code: 'names = ["小明", "小红", "小刚"]\n\nfor n in names:\n    print(n)' },
    { t: 'p', text: '这里没有 range —— 直接把列表交给 for，它就一个一个拿给你。变量 n 每跑一圈就变成列表里的下一个。' },
    { t: 'p', text: '字符串也能挨个看，一个字符一次：' },
    { t: 'code', lang: 'python', code: 'for c in "abc":\n    print(c)      # a b c' },
    { t: 'tip', text: '这个写法叫"遍历"。列表、字符串、还有你学过的字典，都能被 for 遍历 —— 这是 Python 里最好用的一招。' },
  ],
  exercise: {
    prompt: 'songs 里装着三首歌。\n\n把下面那行的 "???" 换成正确的东西，让程序挨个把三首歌打印出来。\n\n（预期输出三行：稻香 / 晴天 / 七里香）',
    starterCode: 'songs = ["稻香", "晴天", "七里香"]\n\n# 把 "???" 换成正确的东西\nfor s in "???":\n    print(s)\n',
    requires: ['for', 'list'],
    tests: [
      {
        name: '三行都对',
        code: '_n = [x.strip() for x in _stdout.strip().split("\\n") if x.strip()]\nassert len(_n) == 3, f"应该输出三行，你输出了 {len(_n)} 行"\nassert _n == ["稻香", "晴天", "七里香"], f"应该依次输出 稻香 晴天 七里香，你输出的是 {_n}"',
      },
      {
        name: '只有三行',
        code: 'assert len([l for l in _stdout.strip().split("\\n") if l.strip()]) == 3, "不应该有多余的输出"',
      },
    ],
    hints: [
      '要挨个看的是那个列表，它叫 songs。',
      '把 "???" 整个换成 songs —— 记得去掉引号。',
      '带上引号就变成遍历那三个问号了，所以你会看到三个 ?。',
    ],
    solution: 'songs = ["稻香", "晴天", "七里香"]\nfor s in songs:\n    print(s)',
  },
};
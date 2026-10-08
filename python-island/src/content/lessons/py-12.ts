import type { Lesson } from '../types';

export const py12: Lesson = {
  id: 'py-12',
  region: 'warehouse',
  order: 12,
  title: '第一个列表',
  type: 'guided',
  xp: 10,
  summary: '一个盒子装一排东西，用编号或切片取出来',
  content: [
    { t: 'p', text: '前面你用的盒子，一次只装得下一样东西。但仓库的货架不是这样 —— 它是格子式的，一排能放好多东西。' },
    { t: 'p', text: 'Python 里的货架叫列表（list），用方括号 [ ] 装起来，每样东西之间用逗号隔开。' },
    { t: 'code', lang: 'python', code: 'bag = ["苹果", "面包", "牛奶"]' },
    { t: 'p', text: '怎么取其中一格？用它的编号，编号写在方括号里：' },
    { t: 'code', lang: 'python', code: 'print(bag[0])    # 苹果\nprint(bag[1])    # 面包\nprint(bag[-1])   # 牛奶', demo: true, demoNote: '这段用了上面定义的 bag，单独跑会报错' },
    { t: 'p', text: '注意：编号从 0 开始数。第一格是 0，第二格是 1 —— 这是 Python 里最容易绊倒新手的一根线，先背下来。' },
    { t: 'p', text: '编号写成负数，就是从后面往回数：-1 是最后一格，-2 是倒数第二格。想拿最后一个又懒得数一共几个时，-1 特别好用。' },
    { t: 'p', text: '想一次拿好几格？方括号里写"起点:终点"，这叫切片：' },
    { t: 'code', lang: 'python', code: 'print(bag[0:2])   # [\'苹果\', \'面包\']   从 0 号取到 2 号之前\nprint(bag[1:])    # [\'面包\', \'牛奶\']   从 1 号一直取到最后', demo: true, demoNote: '这段用了上面定义的 bag，单独跑会报错' },
    { t: 'p', text: '注意 0:2 拿到的是 0 号和 1 号，不含 2 号 —— 这叫"含头不含尾"，终点那一格永远不拿。终点不写，就一直取到最后。' },
    { t: 'tip', text: '为什么从 0 开始？历史原因，改不了了。全世界所有 Python 程序都这么数，你只能跟着数。' },
    { t: 'p', text: '取编号最常踩的坑：列表只有 3 格，你却写 bag[3] —— Python 会报 IndexError（编号超出范围）。记住：3 格的合法编号只有 0、1、2。' },
    { t: 'key', text: '列表用 [ ] 装一排东西，用编号（下标）取，编号从 0 开始。' },
  ],
  exercise: {
    prompt: '建一个列表 bag，装三样东西：苹果、面包、牛奶。\n\n然后打印三行：\n\n1. 第一格（用编号 0）\n2. 最后一格（用 -1）\n3. 前两格（用切片）\n\n（预期输出：苹果 / 牛奶 / [\'苹果\', \'面包\']）',
    starterCode: '# 建一个列表 bag，装苹果、面包、牛奶\n\n# 打印第一格（编号 0）\n\n# 打印最后一格（编号 -1）\n\n# 打印前两格（切片）\n',
    requires: ['list'],
    tests: [
      {
        name: '列表建对了',
        code: 'assert "bag" in globals(), "还没有创建 bag 这个变量"\nassert bag == ["苹果", "面包", "牛奶"], f"bag 里应该装着 苹果、面包、牛奶 三样东西，现在是 {bag}"',
      },
      {
        name: '三行输出都对',
        code: '_lines = [x.strip() for x in _stdout.strip().split("\\n") if x.strip()]\nassert len(_lines) == 3, f"应该输出三行，你输出了 {len(_lines)} 行"\nassert _lines == ["苹果", "牛奶", "[\'苹果\', \'面包\']"], f"应该依次输出 苹果 / 牛奶 / [\'苹果\', \'面包\']，你输出的是 {_lines}"',
      },
      {
        name: '第三行用了切片',
        code: '_c = _code.replace(" ", "")\nassert "[0:2]" in _c or "[:2]" in _c, "第三行要用切片写，像 bag[0:2] 这样 —— 一次取一段"',
      },
    ],
    hints: [
      '建列表：bag = ["苹果", "面包", "牛奶"]',
      '第一格是 bag[0]，最后一格是 bag[-1]。',
      '前两格用切片：bag[0:2] —— 注意不含 2 号那一格。',
    ],
    solution: 'bag = ["苹果", "面包", "牛奶"]\nprint(bag[0])\nprint(bag[-1])\nprint(bag[0:2])',
  },
};

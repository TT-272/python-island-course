import type { Lesson } from '../types';

export const py18: Lesson = {
  id: 'py-18',
  region: 'warehouse',
  order: 18,
  title: '只留一份',
  type: 'predict',
  xp: 10,
  summary: 'set 去重：重复的东西只留一份',
  content: [
    { t: 'p', text: '盘点的时候发现登记本上写着：3、1、3、2、1、2、3。同一件货记了好几遍。' },
    { t: 'p', text: '想去掉重复，用集合（set）。它跟列表长得很像，但里面每样东西只留一份。' },
    { t: 'code', lang: 'python', code: 'nums = [3, 1, 3, 2, 1, 2, 3]\nprint(len(nums))          # 7    一共记了几次\nprint(len(set(nums)))     # 3    去重之后剩几种\nprint(sorted(set(nums)))  # [1, 2, 3]' },
    { t: 'p', text: 'set(nums) 把列表变成集合，重复的自动丢掉。' },
    { t: 'p', text: '但集合有个怪脾气：里面的东西没有固定顺序。所以你几乎不会直接打印一个集合 —— 要打印就先 sorted() 排一下。' },
    { t: 'tip', text: '看最后一行的写法：set 外面还套了一层 sorted。函数可以这样套着用，从最里面往外算 —— 先算出 set(nums)，再对它排序。' },
    { t: 'tip', text: '集合不能像列表那样用编号取（它根本没有固定顺序）。想按顺序看，就 sorted() 一下再打印。' },
    { t: 'key', text: 'set 会自动去重，重复的东西只留一份。' },
  ],
  exercise: {
    prompt: 'nums 里记着 [3, 1, 3, 2, 1, 2, 3]。\n\n先自己算一遍，再写三行 print，依次输出：\n\n1. 一共记了几次\n2. 去重之后剩几种\n3. 去重之后，从小到大排好\n\n（预期输出三行：7 / 3 / [1, 2, 3]）',
    starterCode: 'nums = [3, 1, 3, 2, 1, 2, 3]\n\n# 三行 print：一共几个、去重后几个、去重后排序\n\n',
    requires: ['list'],
    tests: [
      {
        name: '一共三行',
        code: 'assert len([l for l in _stdout.strip().split("\\n") if l.strip()]) == 3, f"应该输出三行，你输出了 {len([l for l in _stdout.strip().split(chr(10)) if l.strip()])} 行"',
      },
      {
        name: '结果与顺序正确',
        code: '_n = [x.strip() for x in _stdout.strip().split("\\n") if x.strip()]\nassert len(_n) == 3, "先让程序输出正好三行"\nassert _n == ["7", "3", "[1, 2, 3]"], f"应该依次输出 7 / 3 / [1, 2, 3]，你输出的是 {_n}"',
      },
    ],
    hints: [
      '一共几个用 len(nums)。',
      '去重之后几个用 len(set(nums))。',
      '去重再排序用 sorted(set(nums))，结果是 [1, 2, 3]。',
    ],
    solution: 'nums = [3, 1, 3, 2, 1, 2, 3]\nprint(len(nums))\nprint(len(set(nums)))\nprint(sorted(set(nums)))',
  },
};

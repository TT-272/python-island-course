import type { Lesson } from '../types';

export const py11: Lesson = {
  id: 'py-11',
  region: 'village',
  order: 11,
  title: '体温计',
  type: 'scratch',
  xp: 30,
  boss: true,
  summary: '问体温 → 转小数 → 算华氏度',
  content: [
    { t: 'p', text: '村庄的诊所缺一支体温计。这个活儿交给你 —— 你手上的零件已经够了。' },
    { t: 'p', text: '需求是这样：问用户体温（摄氏度），把回答变成小数，算出华氏度，打印出来。' },
    { t: 'p', text: '换算公式是：' },
    { t: 'code', lang: 'python', code: '华氏度 = 摄氏度 * 1.8 + 32' },
    { t: 'p', text: '三个零件一一对应：input() 负责问话，float() 负责把文字变成小数，* 和 + 负责算数。这就是数据村庄教你的一切，凑在一起就是一个小工具。' },
    { t: 'tip', text: '试着用别的小数跑跑看，你可能会看到 98.96000000000001 这种长尾巴。这不是你写错了 —— 是计算机存小数的方式造成的。以后有专门的工具收拾它，现在先当没看见。' },
  ],
  exercise: {
    prompt: '写一个体温计，四步：\n\n1. 问用户体温（摄氏度）\n2. 把回答变成小数\n3. 按公式算出华氏度，装进变量 f\n4. 打印 f\n\n点「运行」时，系统会自动回答：36.5（和上一关一样，问题和答案会挤在同一行，正常）。\n\n（最后要打印出来的是 97.7）',
    starterCode: '# 体温计\n# 提示：input() 拿回来的是文字，得用 float() 变成小数\n\n',
    // 运行和判分时自动喂给 input() 的答案
    stdin: '36.5',
    requires: ['input'],
    tests: [
      {
        name: '算出来 97.7',
        code: 'assert _stdout.strip().endswith("97.7"), f"最后应该打印出 97.7，你的程序输出的是 {_stdout.strip()!r}"',
      },
      {
        name: '结果装进了变量 f',
        code: 'assert "f" in globals(), "算出来的华氏度要装进变量 f"\nassert abs(f - 97.7) < 0.001, f"f 里应该是 97.7，现在是 {f!r}"',
      },
    ],
    hints: [
      '第 1 步：c = float(input("体温（摄氏度）：")) —— input 拿回来的是文字，所以外面套一层 float()。',
      '第 2 步：f = c * 1.8 + 32',
      '第 3 步：print(f)',
    ],
    solution: 'c = float(input("体温（摄氏度）："))\nf = c * 1.8 + 32\nprint(f)',
  },
};
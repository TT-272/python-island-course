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
    { t: 'p', text: '换算公式是「华氏度 = 摄氏度 x 1.8 + 32」。写成代码，就是把input()拿到的摄氏度存进 c，算完存进 f：' },
    { t: 'code', lang: 'python', code: 'f = c * 1.8 + 32', demo: true, demoNote: '这段用了上面的变量 c，单独跑会报错' },
    { t: 'p', text: '三个零件一一对应：input() 负责问话，float() 负责把文字变成小数，* 和 + 负责算数。这就是数据村庄教你的一切，凑在一起就是一个小工具。' },
    { t: 'tip', text: '试着用别的小数跑跑看，你可能会看到 98.96000000000001 这种长尾巴。这不是你写错了 —— 是计算机存小数的方式造成的。以后有专门的工具收拾它，现在先当没看见。' },
    { t: 'p', text: '为什么必须 float()？因为 input() 给你的 36.5 其实是文字 "36.5"，文字不能拿去做乘法。float() 把它变成真正的小数，才能算。' },
    { t: 'key', text: '三件套：input() 负责问，float() 负责把文字变成小数，公式负责算。36.5 是系统自动输入的，不用你写。' },
  ],
  exercise: {
    prompt: '写一个体温计，四步：\n\n1. 「问」：用 input() 问体温（摄氏度），把回答接住\n2. 「变」：用 float() 把文字变成小数，存进 c\n3. 「算」：按公式算出华氏度，装进变量 f\n4. 「印」：打印 f\n\n点「运行 / 提交」时，系统会自动回答 36.5 —— 你不用自己写 c = 36.5，要做的是把 input() 接住、再转成小数。\n\n（最后要打印出来的是 97.7）',
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

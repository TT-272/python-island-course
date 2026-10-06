import type { Lesson } from '../types';

export const py26: Lesson = {
  id: 'py-26',
  region: 'forest',
  order: 26,
  title: '垃圾分类员',
  type: 'scratch',
  xp: 30,
  boss: true,
  summary: 'if / elif / else 综合：一口气处理三样垃圾',
  content: [
    { t: 'p', text: '森林入口立了几个垃圾桶，路过的人总是扔错。缺一个会说话的垃圾分类员 —— 这个活儿交给你。' },
    { t: 'p', text: '规矩是这样：' },
    { t: 'p', text: '1. 用 input() 问一句：这是什么垃圾？\n2. 回答是 塑料瓶 或 纸箱 → 打印 可回收\n3. 回答是 电池 → 打印 有害\n4. 其他回答 → 打印 不确定' },
    { t: 'p', text: '零件对应：input() 问话，if / elif / else 分岔，in 一次问好几样东西。' },
    { t: 'code', lang: 'python', code: 'if item in ["塑料瓶", "纸箱"]:\n    print("可回收")' },
    { t: 'p', text: '这一关要处理三样垃圾。麻烦的是：你还不会循环，所以只能把同一段判断手写三遍。' },
    { t: 'tip', text: '别嫌烦 —— 记住这种"明明一样却要抄三遍"的感觉。下一关你就会学到让它只写一遍的东西。' },
  ],
  exercise: {
    prompt: '写一个垃圾分类员，要连续处理三样垃圾：\n\n1. 每一轮都先用 input() 问「这是什么垃圾？」，把回答装进一个变量\n2. 塑料瓶 或 纸箱 → 打印 可回收\n3. 电池 → 打印 有害，并且把变量 bad 加 1\n4. 其他 → 打印 不确定\n5. 三轮问完之后，打印 有害垃圾{bad}件（用 f-string）\n\n点「运行」时，系统会依次回答：塑料瓶、香蕉皮、电池\n\n最后应该看到：可回收 → 不确定 → 有害 → 有害垃圾1件',
    starterCode: '# 垃圾分类员：连续处理三样垃圾\n# 提示：现在还没有循环，只能手写三段一样的判断\n\nbad = 0\n\n# 第 1 样\n\n# 第 2 样\n\n# 第 3 样\n\n# 最后打印有害垃圾的数量\n',
    // 运行和判分时连续喂给 input() 的三样垃圾
    stdin: '塑料瓶\n香蕉皮\n电池',
    tests: [
      {
        name: '三样都判对了',
        code: 'assert "可回收" in _stdout, f"塑料瓶应该分到 可回收，你的输出是 {_stdout.strip()!r}"\nassert "不确定" in _stdout, f"香蕉皮应该分到 不确定，你的输出是 {_stdout.strip()!r}"\nassert "有害" in _stdout, f"电池应该分到 有害，你的输出是 {_stdout.strip()!r}"\nassert _stdout.index("可回收") < _stdout.index("不确定") < _stdout.index("有害"), "三样垃圾的判断顺序不对，应该按 塑料瓶 → 香蕉皮 → 电池"',
      },
      {
        name: '有害垃圾数对了',
        code: 'assert "bad" in globals(), "题目要求用变量 bad 记有害垃圾的数量"\nassert bad == 1, f"三样里只有电池是有害垃圾，bad 应该是 1，现在是 {bad!r}"',
      },
      {
        name: '最后打印了统计',
        code: 'assert _stdout.strip().endswith("有害垃圾1件"), f"最后应该打印 有害垃圾1件，你的输出结尾是 {_stdout.strip()[-20:]!r}"',
      },
    ],
    hints: [
      '每一轮都是这三步：item = input("这是什么垃圾？") → if / elif / else 判断 → 打印结果。',
      '判断那部分写成：if item in ["塑料瓶", "纸箱"]: 打印 可回收；elif item == "电池": 打印 有害，并且 bad = bad + 1；else: 打印 不确定。',
      '三段可以复制粘贴，但变量名要改（item1、item2、item3），否则后一次会覆盖前一次。',
      '最后一行用 f-string：print(f"有害垃圾{bad}件")',
    ],
    solution: 'bad = 0\n\nitem1 = input("这是什么垃圾？")\nif item1 in ["塑料瓶", "纸箱"]:\n    print("可回收")\nelif item1 == "电池":\n    print("有害")\n    bad = bad + 1\nelse:\n    print("不确定")\n\nitem2 = input("这是什么垃圾？")\nif item2 in ["塑料瓶", "纸箱"]:\n    print("可回收")\nelif item2 == "电池":\n    print("有害")\n    bad = bad + 1\nelse:\n    print("不确定")\n\nitem3 = input("这是什么垃圾？")\nif item3 in ["塑料瓶", "纸箱"]:\n    print("可回收")\nelif item3 == "电池":\n    print("有害")\n    bad = bad + 1\nelse:\n    print("不确定")\n\nprint(f"有害垃圾{bad}件")',
  },
};
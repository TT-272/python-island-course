import type { Lesson } from '../types';

export const py06: Lesson = {
  id: 'py-06',
  region: 'village',
  order: 6,
  title: '数字家族',
  type: 'predict',
  xp: 10,
  summary: '整数、小数、七个运算符，还有除法的怪脾气',
  content: [
    { t: 'p', text: '盒子里装的不一定是文字，更多时候装的是数字。' },
    { t: 'p', text: 'Python 的数字分两家人：整数和小数。' },
    { t: 'code', lang: 'python', code: '1   42   -8      # 整数（int）\n1.5  3.14  -0.5  # 小数（float）' },
    { t: 'p', text: '怎么分辨？看有没有小数点。2.0 也算小数 —— 带小数点就是小数，哪怕它是个整数。' },
    { t: 'p', text: '还有一件事要记牢："42" 和 42 完全不是一回事。带引号的是文字，不带引号的是数字。' },
    { t: 'p', text: '数字能做数学，文字不能。2 + 3 得 5，但 "2" + "3" 得 "23" —— 加号碰到文字，就变成了"拼起来"。' },
    { t: 'p', text: '数字之间的运算符一共七个，一次认全：' },
    { t: 'code', lang: 'python', code: 'print(7 + 2)    # 9     加\nprint(7 - 2)    # 5     减\nprint(7 * 2)    # 14    乘\nprint(7 / 2)    # 3.5   除\nprint(7 // 2)   # 3     整除（把小数扔掉）\nprint(7 % 2)    # 1     取余数\nprint(2 ** 3)   # 8     幂（2 的 3 次方）' },
    { t: 'p', text: '% 读作"取余"，给你除完之后剩下的零头。以后判断"能不能被整除""是不是偶数"，全靠它。' },
    { t: 'tip', text: '除号 / 有个怪脾气：结果永远是小数。4 / 2 不是 2，是 2.0。想得到整数得用 //。' },
  ],
  exercise: {
    prompt: '先自己算一下这六个算式的结果，再写六行 print 把它们打出来（一行一个）：\n\n2 + 3\n7 / 2\n4 / 2\n"2" + "3"\n7 % 2\n2 ** 3\n\n（写的时候直接把算式交给 print 就行，先猜结果，再点运行对答案）',
    starterCode: '# 六行 print，一行一个结果\n',
    tests: [
      {
        name: '一共六行',
        code: 'assert len([l for l in _stdout.strip().split("\\n") if l.strip()]) == 6, f"应该输出六行，你输出了 {len([l for l in _stdout.strip().split(chr(10)) if l.strip()])} 行"',
      },
      {
        name: '前四行正确',
        code: '_n = [x.strip() for x in _stdout.strip().split("\\n") if x.strip()]\nassert len(_n) == 6, "先让程序输出正好六行"\nassert _n[0] == "5", f"第一行应该是 5，你写的是 {_n[0]!r}"\nassert _n[1] == "3.5", f"第二行应该是 3.5，你写的是 {_n[1]!r}。7 / 2 的结果是小数"\nassert _n[2] == "2.0", f"第三行应该是 2.0，你写的是 {_n[2]!r}。除号 / 的结果永远是小数"\nassert _n[3] == "23", f"第四行应该是 23，你写的是 {_n[3]!r}。两边是文字，加号会把它们拼起来"',
      },
      {
        name: '第五行是余数',
        code: 'assert _n[4] == "1", f"第五行应该是 1（7 除以 2 的余数），你写的是 {_n[4]!r}"',
      },
      {
        name: '第六行是幂',
        code: 'assert _n[5] == "8", f"第六行应该是 8（2 的 3 次方），你写的是 {_n[5]!r}"',
      },
      {
        name: '用上了 % 和 **',
        code: 'assert "%" in _code, "第五行要用取余运算符 % 来算，别直接写答案"\nassert "**" in _code, "第六行要用幂运算符 ** 来算，别直接写答案"',
      },
    ],
    hints: [
      '前三行直接写 print(算式) 就行，让 Python 帮你算。',
      '7 / 2 是 3.5；4 / 2 是 2.0 不是 2 —— 除号的结果永远是小数。',
      '第四行两边是文字，加号把 2 和 3 拼成 23。',
      '第五行写 print(7 % 2) —— % 给你除完之后的余数，7 除以 2 余 1。',
      '第六行写 print(2 ** 3) —— ** 是幂，2 的 3 次方等于 8。',
    ],
    solution: 'print(2 + 3)\nprint(7 / 2)\nprint(4 / 2)\nprint("2" + "3")\nprint(7 % 2)\nprint(2 ** 3)',
  },
};
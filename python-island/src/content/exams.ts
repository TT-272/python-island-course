import type { Block, Exercise } from './types';

/** 综合考题里的选择题 */
export type McqQuestion = {
  q: string;
  options: string[];
  /** 正确选项下标（从 0 开始） */
  answer: number;
  /** 交卷后给的解释 */
  explain: string;
};

/** 一个区域额外带的三样东西：知识总结、选择题、编程大题 */
export type RegionExtra = {
  summary: Block[];
  quiz: McqQuestion[];
  coding: Exercise;
};

/* ------------------------------------------------------------------ *
 * 6 个区域的知识总结 + 综合考题
 * ------------------------------------------------------------------ */
export const REGION_EXTRA: Record<string, RegionExtra> = {

  /* ================= 1. 登陆点 · print 输出 ================= */
  beach: {
    summary: [
      { t: 'p', text: '这一区你学会了让程序开口说话，还学会了看懂报错。' },
      { t: 'p', text: '最核心的一条：想让程序输出一段文字，用 print()，文字要用引号包起来。' },
      { t: 'code', lang: 'python', code: 'print("你好")        # 输出：你好\nprint(123)          # 数字不用引号\nprint("a", "b")    # 一次输出两个，中间自动加空格' },
      { t: 'key', text: '引号必须成对：要么一对双引号 " "，要么一对单引号。缺一半就报错。' },
      { t: 'tip', text: '报错别怕。Python 会告诉你错在第几行，最常见的就是引号没闭合、括号没配对。' },
    ],
    quiz: [
      { q: '想让程序输出「你好」，哪一行是对的？', options: ['print("你好")', 'print(你好)', 'print[你好]', 'print 你好'], answer: 0, explain: '文字必须用引号包起来，再交给 print()。' },
      { q: '下面哪一对引号是配对的？', options: ['print("你好\')', 'print("你好")', 'print(你好")', 'print(你好)'], answer: 1, explain: '开头和结尾必须是同一种引号。' },
      { q: 'print(123) 里的 123 是什么？', options: ['一段文字', '一个数字', '一个变量名', '一句注释'], answer: 1, explain: '没有引号，就是数字，可以直接参与计算。' },
      { q: '报错写 SyntaxError，最常见的两个原因是？', options: ['引号没闭合或括号不配对', '电脑太慢', '变量名太长', '没写注释'], answer: 0, explain: '语法错误几乎都出在成对的符号上：引号、括号、冒号。' },
      { q: '想让三行文字各占一行输出，怎么办？', options: ['写三行 print', '一行 print 里放三个逗号', '用中文句号结尾', '重复运行三次'], answer: 0, explain: '一行 print 输出一行，想换行就多写几行。' },
    ],
    coding: {
      prompt: '# 用 print() 输出这句话：你好，Python 岛',
      starterCode: '# 用 print() 输出：你好，Python 岛\n',
      tests: [
        { name: '输出正确', code: 'assert _stdout.strip() == "你好，Python 岛", f"应该输出 你好，Python 岛，你输出的是 {_stdout.strip()!r}"' },
        { name: '用上了 print', code: 'assert "print" in _code, "要用 print() 输出"' },
      ],
      hints: ['写成：print("你好，Python 岛")'],
      solution: 'print("你好，Python 岛")',
    },
  },

  /* ================= 2. 数据村庄 · 变量 / 数字 / 文字 / 输入 ================= */
  village: {
    summary: [
      { t: 'p', text: '这一区是整门课的地基：把东西装进盒子（变量），再拿出来算、拿出来拼。' },
      { t: 'code', lang: 'python', code: 'name = "小船长"     # 变量：把右边装进左边\nage  = 11            # 整数\npi   = 3.14          # 小数\nprint(name, age)' },
      { t: 'key', text: '= 是"装进去"，== 才是"问相等"。这两个千万不要混。' },
      { t: 'p', text: '数字会算数，文字能称重，两种值还不能直接混着用。' },
      { t: 'code', lang: 'python', code: 'print(7 / 2)     # 3.5   除号的结果永远是小数\nprint(7 // 2)    # 3     整除\nprint(7 % 2)     # 1     取余数\nprint(len("你好"))  # 2   数有几个字' },
      { t: 'p', text: '文字和数字之间要「变形」：int() 变整数、float() 变小数、str() 变文字。f-string 能直接把变量塞进句子里。' },
      { t: 'code', lang: 'python', code: 'n = input("你多大了？")   # input() 拿回来的永远是文字！\nage = int(n)                 # 想要数字就得变形\nprint(f"你今年 {age} 岁")' },
      { t: 'key', text: 'input() 给你的永远是文字，哪怕用户打的是数字。要算数，先 int() 或 float()。' },
      { t: 'tip', text: '常见坑：floating point 的"长尾巴"（98.96000000000001）是计算机存小数的方式造成的，不是你写错了。' },
    ],
    quiz: [
      { q: '= 和 == 的区别是？', options: ['一个是赋值，一个是比较', '完全一样', '= 用来比较，== 用来赋值', '都是注释'], answer: 0, explain: '= 把右边装进左边（赋值）；== 问两边相不相等（比较）。' },
      { q: '下面哪个是文字（字符串）？', options: ['42', '"42"', '42.0', '-42'], answer: 1, explain: '带引号的才是文字，不带引号的是数字。' },
      { q: '7 / 2 的结果是？', options: ['3', '3.5', '4', '报错'], answer: 1, explain: '除号 / 的结果永远是小数，所以是 3.5。' },
      { q: '4 / 2 的结果是？', options: ['2', '2.0', '0', '"2"'], answer: 1, explain: '就算能整除，/ 也给你小数：2.0。想要整数用 //。' },
      { q: 'len("a b") 是多少？', options: ['1', '2', '3', '报错'], answer: 2, explain: 'a、空格、b，一共三个字符 —— 空格也算一个。' },
      { q: 'input() 拿回来的东西是什么类型？', options: ['整数', '小数', '文字（字符串）', '布尔值'], answer: 2, explain: '这题的坑就在于：不管你输入什么，input() 拿回来的永远是文字，想算数要先转换。' },
    ],
    coding: {
      prompt: '问用户年龄，把回答变成整数，算出明年几岁，打印出来。',
      starterCode: '# 1) 用 input() 问年龄，把结果接住\n# 2) 用 int() 变成整数\n# 3) 加 1，打印出来   （系统会自动回答：11）\n',
      stdin: '11',
      requires: ['input'],
      tests: [
        { name: '问到了年龄', code: 'assert "input" in _code, "要用 input() 问用户"' },
        { name: '打印出明年的岁数', code: 'assert _stdout.strip().endswith("12"), f"明年应该是 12 岁，你的程序输出的是 {_stdout.strip()!r}"' },
      ],
      hints: [
        '第 1 步：age = int(input("你几岁？")) —— input() 拿回来的是文字，所以外面套一层 int()。',
        '第 2 步：print(age + 1)',
      ],
      solution: 'age = int(input("你几岁？"))\nprint(age + 1)',
    },
  },

  /* ================= 3. 仓库镇 · 列表 / 元组 / 字典 / 集合 ================= */
  warehouse: {
    summary: [
      { t: 'p', text: '这一区教你怎么一次性管理「一堆东西」。' },
      { t: 'code', lang: 'python', code: 'nums = [3, 1, 2]      # 列表：有顺序、能改\nnums.append(9)         # 末尾加\nd = {"name": "小船长"}  # 字典：按名字找\nt = (1, 2, 3)          # 元组：上锁的列表，不能改\ns = {1, 1, 2}          # 集合：自动去重' },
      { t: 'key', text: '列表 [ ] 能改，元组 ( ) 不能改；字典 { } 按「名字」找，不按编号找。' },
      { t: 'p', text: '列表常用的几招：' },
      { t: 'code', lang: 'python', code: 'len(nums)      # 有几个\nsum(nums)      # 加起来\nmax(nums)      # 最大\nsorted(nums)   # 排好序（不改原列表）\n9 in nums      # 在不在里面' },
      { t: 'tip', text: '切片 nums[1:3] 拿的是「第 1 个到第 2 个」，结尾那个 3 取不到 —— 这是 Python 的惯例：含头不含尾。' },
    ],
    quiz: [
      { q: '往列表末尾加一个东西，用哪个方法？', options: ['append()', 'len()', 'sorted()', 'print()'], answer: 0, explain: 'nums.append(9) 把 9 加到列表最后。' },
      { q: '列表和元组最大的区别是？', options: ['元组不能改', '列表不能存数字', '元组不能打印', '没有区别'], answer: 0, explain: '元组一旦建好就不能改，所以叫「上锁的列表」。' },
      { q: '字典是按什么找值的？', options: ['编号（下标）', '键（名字）', '大小', '顺序'], answer: 1, explain: '字典 d["name"] 是按键找，不按位置找。' },
      { q: 'sorted([3, 1, 2]) 得到什么？', options: ['[3, 2, 1]', '[1, 2, 3]', '3', '报错'], answer: 1, explain: 'sorted() 从小到大排好序，给出一个新列表。' },
      { q: '{1, 1, 2} 里面实际有几个东西？', options: ['3 个', '2 个', '1 个', '报错'], answer: 1, explain: '集合会自动去重，重复的 1 只留一份，所以是 {1, 2}。' },
    ],
    coding: {
      prompt: '下面已经给你一个列表 nums。请打印两行：第一行是它有几个数，第二行是它们的和。',
      starterCode: 'nums = [3, 7, 2, 9, 4]\n\n# 打印 nums 有几个数\n\n# 打印 nums 加起来是多少\n',
      tests: [
        { name: '两行都对', code: '_n = [x.strip() for x in _stdout.strip().split("\\n") if x.strip()]\nassert _n[:2] == ["5", "25"], f"应该是 5 和 25，你输出的是 {_n[:2]}"' },
      ],
      hints: ['第一行用 len(nums)，第二行用 sum(nums)。', 'len(nums) 是 5，sum(nums) 是 25。'],
      solution: 'nums = [3, 7, 2, 9, 4]\nprint(len(nums))\nprint(sum(nums))',
    },
  },

  /* ================= 4. 岔路森林 · 条件判断 ================= */
  forest: {
    summary: [
      { t: 'p', text: '这一区让程序学会「做选择」：条件成立就走这条路，不成立就走那条。' },
      { t: 'code', lang: 'python', code: 'score = 75\nif score >= 60:\n    print("及格")\nelse:\n    print("不及格")' },
      { t: 'key', text: 'if / elif / else 后面都要冒号 :，下面那段必须缩进 —— 缩进就代表「属于这个条件」。' },
      { t: 'p', text: '比较和连接条件用这些符号：' },
      { t: 'code', lang: 'python', code: '>  <  >=  <=  ==  !=       # 比较\nand  or  not                 # 把条件连起来\n(5 > 3) and (2 < 1)          # False' },
      { t: 'key', text: '0、""、[]、None 本身就算「假」，在 if 里会被当成不成立。' },
      { t: 'tip', text: 'elif 是「否则如果」：前面都不成立时，再试下一个条件，从上往下只要有一个成立，后面的就都不看了。' },
    ],
    quiz: [
      { q: 'if 条件成立时，执行哪一段代码？', options: ['下面缩进的那段', '下面没缩进的那段', '上面一行', '整个文件'], answer: 0, explain: '靠缩进判断「这段属于这个 if」。' },
      { q: 'a = 5，b = 10，下面哪个判断为真？', options: ['a > b', 'a < b', 'a == b', 'a != a'], answer: 1, explain: '5 < 10，所以 a < b 为真。' },
      { q: 'elif 的作用是？', options: ['前面的条件不成立时，再试一个新条件', '结束程序', '重复执行', '定义一个函数'], answer: 0, explain: 'elif = else if，一条一条往下试。' },
      { q: 'True and False 结果是？', options: ['True', 'False', '报错', 'None'], answer: 1, explain: 'and 要两边都为真才为真，只要有一个假就是假。' },
      { q: '下面哪个值在 if 里会被当成「假」？', options: ['0', '1', '"a"', '[1]'], answer: 0, explain: '0、空文字、空列表、None 都算假。' },
    ],
    coding: {
      prompt: '问用户一个数字，然后判断：\n\n大于 0 → 打印 正数\n等于 0 → 打印 零\n小于 0 → 打印 负数\n\n（系统会自动回答：-5）',
      starterCode: 'n = float(input("一个数字："))\n\n# 用 if / elif / else 判断并打印\n',
      stdin: '-5',
      requires: ['if'],
      tests: [
        { name: '用上了 if', code: 'assert "if" in _code, "这题要用 if 判断"' },
        { name: '判断正确', code: 'assert _stdout.strip().endswith("负数"), f"-5 是负数，你的程序输出的是 {_stdout.strip()!r}"' },
      ],
      hints: [
        'if n > 0: 下面缩进 print("正数")',
        '再写 elif n == 0: 和 else: 两段。',
      ],
      solution: 'n = float(input("一个数字："))\nif n > 0:\n    print("正数")\nelif n == 0:\n    print("零")\nelse:\n    print("负数")',
    },
  },

  /* ================= 5. 工坊 · 循环 / 随机 ================= */
  workshop: {
    summary: [
      { t: 'p', text: '这一区让程序学会「重复做」，不用把同一句话抄一百遍。' },
      { t: 'code', lang: 'python', code: 'for i in range(3):     # 0, 1, 2（含头不含尾）\n    print(i)\n\nfor x in [10, 20]:     # 直接遍历列表\n    print(x)' },
      { t: 'key', text: 'range(3) 给的是 0、1、2 —— 从 0 开始，结尾那个数取不到。' },
      { t: 'p', text: '想「只要条件成立就一直跑」，用 while：' },
      { t: 'code', lang: 'python', code: 'i = 0\nwhile i < 3:\n    print(i)\n    i = i + 1        # 别忘了让它变，否则永远停不下来' },
      { t: 'key', text: 'break 是整个停下来，continue 是只跳过这一圈、继续下一圈。' },
      { t: 'code', lang: 'python', code: 'import random\nprint(random.randint(1, 6))   # 1~6 的随机整数' },
      { t: 'tip', text: '死循环的经典原因：循环里忘了让条件变化（比如忘了 i = i + 1）。' },
    ],
    quiz: [
      { q: 'range(3) 会产生哪几个数？', options: ['1, 2, 3', '0, 1, 2', '0, 1, 2, 3', '3'], answer: 1, explain: 'range 从 0 开始，含头不含尾，所以是 0、1、2。' },
      { q: 'break 和 continue 的区别？', options: ['break 整个停，continue 只跳过这一圈', '一样', 'break 跳过，continue 整个停', '都是注释'], answer: 0, explain: 'break 跳出循环；continue 只是这一圈不做了，接着下一圈。' },
      { q: 'range(1, 5) 有哪几个数？', options: ['1, 2, 3, 4, 5', '1, 2, 3, 4', '0, 1, 2, 3, 4', '2, 3, 4, 5'], answer: 1, explain: '从 1 开始，到 5 之前停，所以是 1~4。' },
      { q: 'while 循环什么时候停？', options: ['条件不成立时', '永远不停', '跑 3 次就停', '看到 print 就停'], answer: 0, explain: 'while 一直跑，直到条件变成假。' },
      { q: 'random.randint(1, 6) 可能给你什么？', options: ['只有 1', '1~6 之间的随机整数', '0~6 之间', '1.5'], answer: 1, explain: 'randint(a, b) 给你 a 到 b 之间（含两端）的随机整数。' },
    ],
    coding: {
      prompt: '用 for 和 range()，把 1 到 5 一行一个打印出来。',
      starterCode: '# 用 for + range() 打印 1 到 5\n',
      requires: ['for'],
      tests: [
        { name: '用了 for', code: 'assert "for" in _code, "这题要用 for 循环"' },
        { name: '输出 1~5', code: '_n = [x.strip() for x in _stdout.strip().split("\\n") if x.strip()]\nassert _n == ["1", "2", "3", "4", "5"], f"应该输出 1 到 5，你输出的是 {_n}"' },
      ],
      hints: ['range(1, 6) 给的是 1、2、3、4、5。', '写成：for i in range(1, 6): 下面缩进 print(i)'],
      solution: 'for i in range(1, 6):\n    print(i)',
    },
  },

  /* ================= 6. 熔炉 · 函数 ================= */
  forge: {
    summary: [
      { t: 'p', text: '这一区把零散的代码「打包」成函数：写一次，到处用。' },
      { t: 'code', lang: 'python', code: 'def greet(name):        # def 定义函数，name 是参数\n    print("你好，" + name)\n\ngreet("小船长")          # 调用它' },
      { t: 'key', text: 'def 用来定义函数；参数是外面传进来的东西；return 把结果送出去。' },
      { t: 'code', lang: 'python', code: 'def add(a, b):\n    return a + b        # 把结果交出去\n\nr = add(2, 3)           # r 变成 5\nprint(r)' },
      { t: 'p', text: 'print 是「显示出来」，return 是「把结果交给外面继续用」—— 两个不一样。' },
      { t: 'key', text: '数字参数改了不影响外面，列表参数改了会影响外面（因为列表是同一个盒子）。' },
      { t: 'code', lang: 'python', code: 'square = lambda n: n * n    # 只写一行的迷你函数\nprint(square(4))            # 16' },
    ],
    quiz: [
      { q: '定义函数用哪个关键字？', options: ['def', 'func', 'function', 'lambda'], answer: 0, explain: 'Python 用 def 定义函数。' },
      { q: 'return 的作用是？', options: ['把结果交给外面用', '把结果打印到屏幕', '结束程序', '定义变量'], answer: 0, explain: 'return 把值送回调用它的地方；打印要用 print。' },
      { q: '函数里的「参数」是什么？', options: ['外面传进来的东西', '函数的名字', '一个循环', '一句注释'], answer: 0, explain: '参数就是函数每次被调用时收进来的输入。' },
      { q: '函数里改了「数字参数」，外面的数字会变吗？', options: ['不会', '会', '有时会', '会变成文字'], answer: 0, explain: '数字是「复制一份」进去的，改的是副本。' },
      { q: '函数里改了「列表参数」，外面的列表会变吗？', options: ['不会', '会', '只会变一半', '报错'], answer: 1, explain: '列表是同一个盒子，函数里改了，外面也看得见。' },
    ],
    coding: {
      prompt: '写一个函数 square(n)，返回 n * n。然后打印 square(6) 的结果。',
      starterCode: '# 定义 square(n)，返回 n * n\n\n# 打印 square(6)\n',
      requires: ['def'],
      tests: [
        { name: '定义了函数', code: 'assert "def" in _code, "这题要用 def 定义函数"' },
        { name: '输出 36', code: 'assert _stdout.strip().endswith("36"), f"square(6) 应该是 36，你的程序输出的是 {_stdout.strip()!r}"' },
        { name: '函数返回的是平方', code: 'assert abs(square(5) - 25) < 0.0001 and abs(square(3) - 9) < 0.0001, "square(n) 应该返回 n * n"' },
      ],
      hints: ['def square(n): 下面缩进 return n * n', '然后 print(square(6))'],
      solution: 'def square(n):\n    return n * n\nprint(square(6))',
    },
  },

};

export function extraOf(regionId: string): RegionExtra | undefined {
  return REGION_EXTRA[regionId];
}

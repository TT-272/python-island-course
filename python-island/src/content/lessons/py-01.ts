import type { Lesson } from '../types';

export const py01: Lesson = {
  id: 'py-01',
  region: 'beach',
  order: 1,
  title: '出发',
  type: 'guided',
  xp: 10,
  summary: '让计算机说出第一句话',
  content: [
    { t: 'p', text: '你想让计算机干活，就得用它能听懂的话下命令。' },
    { t: 'p', text: 'Python 是这一堆语言里最接近人话的，所以我们从它开始。' },
    { t: 'p', text: '让计算机开口说话，用的是 print()。名字来自"打印"，但现在没人用打印纸了 —— 它就是"说出来"。' },
    { t: 'p', text: '括号里放你想让它说的话，文字要用引号包起来。' },
    { t: 'code', lang: 'python', code: 'print("你好")' },
    { t: 'p', text: '运行之后，屏幕上就会出现引号里的那句话。想换内容，就改引号里的字。' },
    { t: 'p', text: '先记住这个感觉：引号是「这是文字」的记号。下一关专门讲它。' },
    { t: 'key', text: 'print() 让程序开口说话；引号里的内容会原样输出。' },
  ],
  exercise: {
    prompt: '让程序打印出：你好，冒险者',
    // 末尾必须有换行：否则光标落在注释行尾，学员打的字会被注释掉
    starterCode: '# 在这里写下你的第一行代码\n',
    tests: [
      {
        name: '输出内容正确',
        code: 'assert _stdout.strip() == "你好，冒险者", f"应该输出 你好，冒险者，你的程序输出的是 {_stdout.strip()!r}"',
      },
      {
        name: '没有多余的输出',
        code: 'assert len([l for l in _stdout.strip().split("\\n") if l.strip()]) == 1, f"只应该输出一行，你输出了 {len(_stdout.strip().split(chr(10)))} 行"',
      },
    ],
    hints: [
      'print() 的括号里放文字，文字要用引号包起来。',
      '完整写法长这样：print("你好，冒险者")',
    ],
    solution: 'print("你好，冒险者")',
  },
};

import type { Lesson } from '../types';

export const py19: Lesson = {
  id: 'py-19',
  region: 'warehouse',
  order: 19,
  title: '歌单管理器',
  type: 'scratch',
  xp: 30,
  boss: true,
  summary: 'input + 列表增删 + 计数，凑成一个点歌台',
  content: [
    { t: 'p', text: '村庄今晚办篝火晚会，缺一个点歌台。这个活儿还是你的 —— 数据村庄和仓库镇教的东西，凑起来就够用了。' },
    { t: 'p', text: '需求是这样：' },
    { t: 'p', text: '1. 歌单从 稻香、晴天 两首开始\n2. 问用户想加哪首歌，把回答加进歌单末尾\n3. 把 晴天 从歌单里拿掉\n4. 打印歌单现在一共几首\n5. 打印整个歌单' },
    { t: 'p', text: '零件一一对应：input() 负责问，append() 负责加，remove() 负责拿掉，len() 负责数数量 —— 全是你已经会的。' },
    { t: 'tip', text: 'input() 拿回来的是文字，而歌名本来就该是文字，所以这一关不需要做类型转换。（体温计那一关需要 float()，是因为体温是数字。）' },
    { t: 'key', text: '把 input、列表增删、计数凑在一起，就能做一个小工具。' },
  ],
  exercise: {
    prompt: '写一个点歌台，五步：\n\n1. 歌单 playlist 从 ["稻香", "晴天"] 开始\n2. 用 input() 问一句，把用户回答的歌加进歌单末尾\n3. 把 "晴天" 从歌单里拿掉\n4. 打印歌单现在一共几首\n5. 打印整个歌单\n\n点「运行」时，系统会自动回答：夜曲（和之前一样，问题和答案会挤在同一行，正常）。\n\n最后两行应该是：\n2\n[\'稻香\', \'夜曲\']',
    starterCode: '# 点歌台\n# 1. 歌单从 ["稻香", "晴天"] 开始\n\n# 2. 问用户想加哪首歌，加到末尾\n\n# 3. 把 "晴天" 拿掉\n\n# 4. 打印一共几首\n\n# 5. 打印整个歌单\n',
    // 运行和判分时自动喂给 input() 的答案
    stdin: '夜曲',
    requires: ['input', 'list'],
    tests: [
      {
        name: '歌单对了',
        code: 'assert "playlist" in globals(), "还没有创建 playlist 这个变量"\nassert playlist == ["稻香", "夜曲"], f"歌单最后应该剩 稻香 和 夜曲 两首，现在是 {playlist}"',
      },
      {
        name: '数量和大名单都打印了',
        code: 'assert "2" in _stdout, f"还要打印歌单现在一共几首，你的程序输出的是 {_stdout.strip()!r}"\nassert _stdout.strip().endswith("[\'稻香\', \'夜曲\']"), f"最后应该打印整个歌单，你的程序输出的是 {_stdout.strip()!r}"',
      },
    ],
    hints: [
      '第 1 步：playlist = ["稻香", "晴天"]',
      '第 2 步：song = input("想加哪首歌？") ，然后 playlist.append(song)',
      '第 3 步：playlist.remove("晴天")',
      '第 4、5 步：print(len(playlist)) 和 print(playlist)',
    ],
    solution: 'playlist = ["稻香", "晴天"]\nsong = input("想加哪首歌？")\nplaylist.append(song)\nplaylist.remove("晴天")\nprint(len(playlist))\nprint(playlist)',
  },
};

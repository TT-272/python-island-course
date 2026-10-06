// 像素素材：每个 sprite 是一组字符串，字符 = 调色板索引，'.' = 透明
export const PALETTE: Record<string, string> = {
  K: '#0f1218', H: '#5a3418', S: '#ffd9b3', E: '#20232b',
  G: '#4a8f3c', g: '#356a2a', B: '#a8703a', P: '#2f5b9e', O: '#5a3a1a',
  W: '#ffffff', Y: '#f7d51d', R: '#e76e55', r: '#a83c28',
  T: '#7a4f2c', t: '#5c3a1e', C: '#e8d5a8', c: '#c4ad7d',
  M: '#9aa3b5', m: '#6b7486', L: '#c98a4b', l: '#9a6534',
  F: '#ffd75f', f: '#ff9a3c', Q: '#e76e55', U: '#8f6ee8',
  X: '#3f7f3a', x: '#2a5726', Z: '#c9c2b0', z: '#948c79',
  A: '#5cbfa0', // 玻璃/液体
  '1': '#7cc45a', '2': '#5da341', '3': '#3f7a2e', '4': '#4a7c3a', '5': '#3b6630',
};

export type SpriteMap = string[];

/* ---------------- 主角（16×18，泰拉瑞亚风：竖发 + 深色描边） ---------------- */
export const HERO: SpriteMap = [
  '.....K....K.....',
  '....KHK..KHK....',
  '...KHHHKKHHHK...',
  '...KHHHHHHHHK...',
  '..KHHHHHHHHHHK..',
  '..KHSSSSSSSSHK..',
  '..KSSSSSSSSSSK..',
  '..KSESSSSSSESK..',
  '..KSSSSSSSSSSK..',
  '..KsSSSSSSSSsK..',
  '...KSSSSSSSSK...',
  '...KKGGGGGGKK...',
  '..KSGGGGGGGGSK..',
  '..KSGGGGGGGGSK..',
  '..KsGgGGGGgGsK..',
  '..KKKKKKKKKKKK..',
  '...KPPPPPPPPK...',
  '...KOOOKKOOOK...',
];

/* ---------------- 区域图标（16×16） ---------------- */
export const REGION_SPRITES: Record<string, SpriteMap> = {
  beach: [
    '................', '....33..33......', '...333333..33...', '..3x3333333x3...',
    '..3333x333333...', '...3333333x3....', '.....333........', '.....TT.........',
    '.....TT.........', '....TTT.........', '....TT..........', '...TTT..........',
    '...TT...........', '..ccccccccccc...', '.cCCCCCCCCCCCc..', 'CCCCCCCCCCCCCCCC',
  ],
  village: [
    '................', '.......QQ.......', '......QQQQ......', '.....QQQQQQ.....',
    '....QQQQQQQQ....', '...QQQQQQQQQQ...', '..QQQQQQQQQQQQ..', '.QQQQQQQQQQQQQQ.',
    '...CCCCCCCCCC...', '...CCKKKCCCCC...', '...CCKKKCCCCC...', '...CCKKKCCCCC...',
    '...CCCCCCCCCC...', '...CCKKKCCCCC...', '...CCCCCCCCCC...', '................',
  ],
  crate: [
    '................', '..KKKKKKKKKKKK..', '..KLLLLLLLLLLK..', '..KLlLLLLLLlLK..',
    '..KLLlLLLLlLLK..', '..KLLLlLLlLLLK..', '..KLLLLllLLLLK..', '..KLLLLllLLLLK..',
    '..KLLLlLLlLLLK..', '..KLLlLLLLlLLK..', '..KLlLLLLLLlLK..', '..KLLLLLLLLLLK..',
    '..KKKKKKKKKKKK..', '................', '................', '................',
  ],
  forest: [
    '......1111......', '....11111111....', '...1111111111...', '..111111111111..',
    '..112111111211..', '.11111111111111.', '.11211111111121.', '.11111111111111.',
    '..111111111111..', '...1111111111...', '....112111211...', '......TTTT......',
    '.....TTTTTT.....', '....tTTTTTTt....', '...tTTTTTTTTt...', '................',
  ],
  workshop: [
    '................', '....MM....MM....', '...MMMM..MMMM...', '...MMMM..MMMM...',
    '..MMMMMMMMMMMM..', '..MMMmmmmmmMMM..', '..MMm......mMM..', 'MMMMm......mMMMM',
    'MMMMm......mMMMM', '..MMm......mMM..', '..MMMmmmmmmMMM..', '..MMMMMMMMMMMM..',
    '...MMMM..MMMM...', '...MMMM..MMMM...', '....MM....MM....', '................',
  ],
  forge: [
    '................', '.......F........', '......FFF.......', '......FFF.......',
    '.....FFFFF......', '....FFFfFFF.....', '....FFfffFF.....', '...FFFfffFFF....',
    '...FFfffffFF....', '..FFFFfffFFFF...', '..FFFfffffFFF...', '..FFFFFFFFFFFF..',
    '.QQQQQQQQQQQQQQ.', '.QQQQQQQQQQQQQQ.', '..QQQQQQQQQQQQ..', '................',
  ],
  /* ---- 第二季占位区域的图标 ---- */
  dock: [
    '................', '.......KK.......', '......K..K......', '......K..K......',
    '.......KK.......', '.......MM.......', '...MMMMMMMMMM...', '.......MM.......',
    '.......MM.......', '.......MM.......', '...MM..MM..MM...', '..MMM..MM..MMM..',
    '..MM...MM...MM..', '..MMM.MMMM.MMM..', '...MMMMMMMMMM...', '................',
  ],
  repair: [
    '................', '......MMMM......', '.....MMMMMM.....', '.....MM..MM.....',
    '.....MM..MM.....', '......MMMM......', '.......MM.......', '.......MM.......',
    '......MM........', '......MM........', '.....MM.........', '.....MM.........',
    '....MM..........', '....MM..........', '...MMM..........', '................',
  ],
  tower: [
    '.......YY.......', '.......YY.......', '......YYYY......', '................',
    '.....MMMMMM.....', '.....M....M.....', '.....MMMMMM.....', '.....M....M.....',
    '.....MMMMMM.....', '....M......M....', '....MMMMMMMM....', '....M..MM..M....',
    '...M...MM...M...', '...MMMMMMMMMM...', '...MMMMMMMMMM...', '................',
  ],
  library: [
    '................', '..MMMM..MMMM....', '.MBBBBMMBBBBM...', '.MBBBBMMBBBBM...',
    '.MBBBBMMBBBBM...', '.MBBBBMMBBBBM...', '.MBBBBMMBBBBM...', '.MBBBBMMBBBBM...',
    '.MBBBBMMBBBBM...', '.MBBBBMMBBBBM...', '.MBBBBMMBBBBM...', '.MBBBBMMBBBBM...',
    '.MBBBBMMBBBBM...', '..MMMM..MMMM....', '................', '................',
  ],
  lab: [
    '................', '......MMMM......', '......M..M......', '......M..M......',
    '......M..M......', '.....M....M.....', '.....M....M.....', '....M......M....',
    '....M.AAAA.M....', '...M.AAAAAA.M...', '...M.AACAAA.M...', '...M.AAAAAA.M...',
    '...M.AAAAAA.M...', '....MMMMMMMM....', '................', '................',
  ],
  launchpad: [
    '................', '.......RR.......', '......RRRR......', '......R..R......',
    '......R..R......', '......RRRR......', '......RRRR......', '......RRRR......',
    '.....RRRRRR.....', '.....R.YY.R.....', '.....R.YY.R.....', '......RRRR......',
    '.....R.RR.R.....', '....RR.RR.RR....', '...RRR....RRR...', '................',
  ],
  graduation: [
    '................', '................', '......MMMM......', '....MMMMMMMM....',
    '..MMMMMMMMMMMM..', '....MMMMMMMM....', '......MMMM......', '......MMMM......',
    '......MMMM......', '......M.YY.M....', '......M.YY.M....', '......M.YY.M....',
    '......M.YY.M....', '......M.YY.M....', '........YY......', '................',
  ],
};

/* ---------------- 装饰物 ---------------- */
export const DECO_SPRITES: Record<string, SpriteMap> = {
  campfire: [
    '................', '................', '.......f........', '......fff.......',
    '.....fffff......', '....ffFFFff.....', '....fFFFFFf.....', '....fFFFFFf.....',
    '....ffFFFff.....', '.....ffFff......', '..TTTTtttTTT....', '..TTTTTTTTTTT...',
    '...TtTTTTTtT....', '....TTTTTTT.....', '................', '................',
  ],
  tent: [
    '.......Q........', '.......QQ.......', '......QQQQ......', '......QQQQ......',
    '.....QQQQQQ.....', '.....QQ..QQ.....', '....QQ....QQ....', '....QQ....QQ....',
    '...QQ......QQ...', '...QQ..KK..QQ...', '..QQ...KK...QQ..', '..QQ...KK...QQ..',
    '.QQQQQQKKQQQQQQ.', '.QQQQQQQQQQQQQQ.', '................', '................',
  ],
  lighthouse: [
    '.......Y........', '......YYY.......', '.....YYYYY......', '....YYWWWYY.....',
    '....WWWWWWW.....', '.....RRRRR......', '.....WWWWW......', '.....WWWWW......',
    '.....RRRRR......', '.....WWWWW......', '.....WWWWW......', '.....RRRRR......',
    '....WWWWWWW.....', '....CCCCCCC.....', '...CCCCCCCCC....', '..CCCCCCCCCCC...',
  ],
};

/* ---------------- 状态图标 ---------------- */
export const UI_SPRITES: Record<string, SpriteMap> = {
  lock: [
    '....MMMM....', '...M....M...', '...M....M...', '..MMMMMMMM..',
    '..MyYYYYyM..', '..YyYYYyYM..', '..YYYYYYYY..', '..YYYyYYYM..',
    '..MMMMMMMM..', '............',
  ],
  star: [
    '.....YY.....', '.....YY.....', '....YYYY....', 'YYYYYYYYYYYY',
    '.YYYYYYYYYY.', '..YYYYYYYY..', '...YYYYYY...', '..YYYYYYYY..',
    '..YYY..YYY..', '.YY......YY.', '............', '............',
  ],
};

/* ---------------- 渲染器 ---------------- */
export type Rect = { x: number; y: number; c: string };

/** 把 sprite 展开成矩形列表。outline = 是否描一圈深色边 */
export function rasterize(map: SpriteMap, dx = 0, dy = 0, outline?: string): Rect[] {
  const cells = new Map<string, string>();
  map.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      const c = PALETTE[ch];
      if (c) cells.set(`${x},${y}`, c);
    }),
  );
  const out: Rect[] = [];
  if (outline) {
    const seen = new Set<string>();
    for (const k of cells.keys()) {
      const [x, y] = k.split(',').map(Number);
      for (const [ox, oy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
        const nk = `${x + ox},${y + oy}`;
        if (!cells.has(nk) && !seen.has(nk)) { seen.add(nk); out.push({ x: dx + x + ox, y: dy + y + oy, c: outline }); }
      }
    }
  }
  for (const [k, c] of cells) {
    const [x, y] = k.split(',').map(Number);
    out.push({ x: dx + x, y: dy + y, c });
  }
  return out;
}

export function spriteSize(map: SpriteMap) {
  return { w: map[0]?.length ?? 0, h: map.length };
}

/** 颜色降饱和 + 压暗（未解锁状态） */
export function dimHex(hex: string, amt: number): string {
  const p = (i: number) => parseInt(hex.slice(i, i + 2), 16);
  const r = p(1), g = p(3), b = p(5);
  const avg = (r + g + b) / 3;
  const k = 0.72 * amt, d = 1 - 0.34 * amt;
  const f = (v: number) => Math.max(0, Math.min(255, Math.round((v + (avg - v) * k) * d)));
  return '#' + [f(r), f(g), f(b)].map((v) => v.toString(16).padStart(2, '0')).join('');
}

// 横版世界地图渲染器：数据驱动（区域列表 → 地形 + 节点）
// 所有绘制集中在这里，用 canvas 出图（一张静态位图，不用 DOM 网格）
import type { Region } from '../content';
import type { RegionState } from '../content';
import {
  PALETTE, REGION_SPRITES, HERO, rasterize, spriteSize, dimHex, type Rect, type SpriteMap,
} from '../gfx/sprites';

export const MAP_W = 460;
export const MAP_H = 240;

/* ---------- 随机（确定性哈希，保证每次渲染一样） ---------- */
function hash(x: number, y: number, s: number): number {
  let h = (Math.round(x) * 374761393 + Math.round(y) * 668265263 + s * 1274126177) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177) | 0;
  return (((h ^ (h >>> 16)) >>> 0) & 0xffff) / 0xffff;
}

/* ---------- 地形：每个区域一块平台，平台之间用长坡连接 ---------- */
export type NodePos = { x: number; y: number; region: Region; state: RegionState };

const BASE_Y = 186;
const ELEV = [0, 6, 3, 13, 21, 33];      // 每个平台的抬升量（越往后越高）

export function layout(regions: Region[]): NodePos[] {
  const n = regions.length;
  const margin = 46;
  const span = (MAP_W - margin * 2) / Math.max(1, n - 1);
  return regions.map((r, i) => ({
    x: Math.round(margin + span * i),
    y: BASE_Y - (ELEV[i] ?? 0),
    region: r,
    state: 'lock',
  }));
}

function makeSurf(nodes: NodePos[]) {
  const halfW = 30;
  return (x: number) => {
    for (const nd of nodes) if (Math.abs(x - nd.x) <= halfW) return nd.y;
    for (let i = 0; i < nodes.length - 1; i++) {
      const a = nodes[i], b = nodes[i + 1];
      const x0 = a.x + halfW, x1 = b.x - halfW;
      if (x > x0 && x < x1) {
        const t = (x - x0) / (x1 - x0);
        const e = t * t * (3 - 2 * t);
        return Math.round(a.y + (b.y - a.y) * e);
      }
    }
    return x < nodes[0].x ? nodes[0].y : nodes[nodes.length - 1].y;
  };
}

/* ---------- 天空 ---------- */
const SKY = ['#1a4a7e', '#20538b', '#275c97', '#2f66a3', '#3871af', '#427dbc',
             '#4e89c7', '#5c96d2', '#6da4dc', '#80b2e5', '#95c1ed', '#abd0f3'];

/* ---------- 主绘制 ---------- */
export function renderWorld(opts: {
  regions: Region[];
  stateOf: (r: Region) => RegionState;
  heroRegionId?: string;
}): { rects: Rect[]; nodes: NodePos[] } {
  const nodes = layout(opts.regions).map((n) => ({ ...n, state: opts.stateOf(n.region) }));
  const surf = makeSurf(nodes);
  const R: Rect[] = [];
  const put = (x: number, y: number, c: string) => {
    x = Math.round(x); y = Math.round(y);
    if (x < 0 || x >= MAP_W || y < 0 || y >= MAP_H) return;
    R.push({ x, y, c });
  };

  /* 天空：色阶 + 抖动过渡 */
  const BAND = 16;
  for (let y = 0; y < MAP_H; y++) {
    const f = y / BAND, i = Math.min(SKY.length - 2, Math.floor(f)), frac = f - i;
    const dith = frac > 0.6;
    for (let x = 0; x < MAP_W; x++) {
      if (y >= surf(x)) continue;
      put(x, y, dith && ((x >> 1) + (y >> 1)) % 2 === 0 ? SKY[i + 1] : SKY[i]);
    }
  }

  /* 太阳 + 光晕 */
  const SX = 74, SY = 42;
  for (let dy = -28; dy <= 28; dy++) for (let dx = -28; dx <= 28; dx++) {
    const d = Math.hypot(dx, dy);
    if (d <= 14 || d > 25) continue;
    const t = (d - 14) / 11, v = hash(SX + dx, SY + dy, 501);
    if (t < 0.34) put(SX + dx, SY + dy, '#a6cde9');
    else if (t < 0.68) { if (v < 0.8) put(SX + dx, SY + dy, '#9ac7e6'); }
    else if (v < 0.45) put(SX + dx, SY + dy, '#8ebde0');
  }
  for (let dy = -15; dy <= 15; dy++) for (let dx = -15; dx <= 15; dx++) {
    const d = Math.hypot(dx, dy);
    if (d <= 13) put(SX + dx, SY + dy, d <= 7 ? '#fffdf0' : (d <= 10 ? '#ffeeb0' : '#ffe082'));
  }

  /* 云 */
  const cloud = (cx: number, cy: number, s: number, far: boolean) => {
    const top = far ? '#f4faff' : '#ffffff', mid = far ? '#e6f1fb' : '#f2f8ff';
    const bot = far ? '#cfe0ee' : '#dbeaf7', rim = far ? '#b9cee0' : '#c2d8ea';
    const blobs: [number, number, number][] = [
      [0, 0, s], [-s * 0.95, s * 0.22, s * 0.72], [s * 0.98, s * 0.26, s * 0.68],
      [-s * 0.34, -s * 0.52, s * 0.62], [s * 0.42, -s * 0.46, s * 0.58], [0, s * 0.36, s * 0.86],
    ];
    for (let y = Math.round(-s * 1.7); y <= Math.round(s * 1.4); y++)
      for (let x = Math.round(-s * 2.2); x <= Math.round(s * 2.2); x++) {
        let inside = false;
        for (const b of blobs) if (Math.hypot(x - b[0], y - b[1]) <= b[2]) { inside = true; break; }
        if (!inside) continue;
        const rel = y / (s * 1.5);
        let c = rel < -0.3 ? top : (rel < 0.35 ? mid : bot);
        if (rel > 0.8) c = rim;
        else if (rel > 0.3 && ((x + y) & 1)) c = bot;
        put(cx + x, cy + y, c);
      }
  };
  cloud(168, 38, 7, false); cloud(292, 24, 5, true); cloud(400, 50, 6, false);
  cloud(108, 62, 5, true); cloud(240, 70, 6, false); cloud(36, 80, 5, true);

  /* 远山：手放折线 + 两面受光 + 雪线 */
  const ridgeAt = (pts: number[][], x: number) => {
    if (x <= pts[0][0]) return pts[0][1];
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1];
      if (x >= a[0] && x <= b[0]) return Math.round(a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]));
    }
    return pts[pts.length - 1][1];
  };
  const FAR = ['#9ab4cb', '#7f9ab4', '#8ea9c1', '#6f89a3', '#b3c9dd'];
  const NEAR = ['#728ea9', '#59758f', '#68849f', '#4b6781', '#8ba3bb'];
  const peaks = (list: number[][], pal: string[], snow: boolean) => {
    list.forEach(([px, py, hw]) => {
      for (let x = Math.round(px - hw); x <= Math.round(px + hw); x++) {
        const t = Math.abs(x - px) / hw, s = surf(x);
        const top = Math.round(py + t * t * (s - py));
        for (let y = top; y < s; y++) {
          const lit = x < px;
          let c = lit ? pal[0] : pal[1];
          if (Math.floor((y - top) / 6) % 3 === 0) c = lit ? pal[2] : pal[3];
          if (snow && y < py + Math.round(11 * (1 - t * t))) c = lit ? '#f0f6fc' : '#c9daea';
          if (t > 0.83) c = pal[3];
          put(x, y, c);
        }
      }
      for (let y = py; y < surf(px); y++) { put(px, y, pal[4]); put(px + 1, y, pal[3]); }
    });
  };
  const BASE_FAR = [[0, 122], [30, 112], [68, 122], [110, 114], [155, 124], [200, 114],
                    [245, 122], [290, 114], [335, 124], [380, 114], [420, 122], [460, 117]];
  const BASE_NEAR = [[0, 138], [40, 128], [88, 140], [136, 130], [184, 142], [232, 130],
                     [280, 140], [328, 130], [376, 142], [420, 132], [460, 136]];
  for (let x = 0; x < MAP_W; x++) {
    const s = surf(x), h = ridgeAt(BASE_FAR, x);
    for (let y = h; y < s; y++) put(x, y, hash(x, y, 601) < 0.5 ? FAR[1] : FAR[3]);
  }
  peaks([[52, 78, 62], [152, 66, 72], [252, 74, 66], [348, 62, 70], [432, 78, 46]], FAR, true);
  for (let x = 0; x < MAP_W; x++) {
    const s = surf(x), h = ridgeAt(BASE_NEAR, x);
    for (let y = h; y < s; y++) put(x, y, hash(x, y, 602) < 0.5 ? NEAR[1] : NEAR[3]);
  }
  peaks([[98, 96, 58], [206, 88, 68], [312, 98, 60], [408, 90, 54]], NEAR, false);

  /* 中景树冠墙 */
  for (let i = 0; i < 200; i++) {
    const cx = Math.round(hash(i, 1, 101) * MAP_W), cy = 146 + Math.round(hash(i, 2, 102) * 26);
    const r = 12 + Math.round(hash(i, 3, 103) * 18);
    for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
      if (Math.hypot(dx, dy) > r) continue;
      const x = cx + dx, y = cy + dy;
      if (y >= surf(x)) continue;
      const t = (y - (cy - r)) / (2 * r);
      put(x, y, t < 0.35 ? '#4a7a4c' : (t < 0.7 ? '#3d6740' : '#325536'));
    }
  }

  /* 地面：草 / 土分层 / 岩层（层间加逐列噪声） */
  for (let x = 0; x < MAP_W; x++) {
    const s = surf(x);
    put(x, s - 1, '#8ad869'); put(x, s, '#6db84e'); put(x, s + 1, '#5aa03f'); put(x, s + 2, '#4c8c34');
    const j = (v: number) => Math.round(hash(x, 0, v) * 5 - 2);
    const b1 = s + 10 + j(711), b2 = s + 26 + j(712), b3 = s + 40 + j(713), b4 = s + 48 + j(714);
    for (let y = s + 3; y < b1; y++) put(x, y, hash(x, y, 701) < 0.5 ? '#5a3d24' : '#63452a');
    for (let y = b1; y < b2; y++) {
      const v = hash(x, y, 702);
      put(x, y, v < 0.5 ? '#8a5f3a' : (v < 0.82 ? '#956a42' : '#a1744a'));
    }
    for (let y = b2; y < b3; y++) put(x, y, hash(x, y, 703) < 0.5 ? '#4a3120' : '#553a26');
    for (let y = b3; y < b4; y++) {
      const t = (y - b3) / Math.max(1, b4 - b3), v = hash(x, y, 704);
      put(x, y, v < 0.15 + t * 0.8 ? (v < 0.5 ? '#6a6a6a' : '#747474') : (v < 0.5 ? '#402b1b' : '#4a3222'));
    }
    for (let y = b4; y < MAP_H; y++) {
      let c = hash(x, y, 705) < 0.5 ? '#6a6a6a' : '#747474';
      if ((y - b4) % 15 < 2) c = '#575757';
      put(x, y, c);
    }
  }

  /* 路面：已走的亮，未走的暗 */
  const curIdx = nodes.findIndex((n) => n.state === 'now' || n.state === 'done');
  const lastDone = nodes.reduce((acc, n, i) => (n.state === 'done' || n.state === 'now' ? i : acc), 0);
  for (let x = nodes[0].x - 6; x <= nodes[nodes.length - 1].x + 6; x++) {
    const s = surf(x), done = x <= nodes[lastDone].x;
    put(x, s, done ? '#e0ca92' : '#5f5540');
    put(x, s + 1, done ? '#cbb076' : '#514836');
  }

  /* 大树（先画，落在建筑后面） */
  const tree = (cx: number, baseY: number, big: boolean, far: boolean) => {
    const G = far ? ['#7ba76c', '#6a9660', '#5a8352', '#4a6f45'] : ['#9ada6e', '#7cc45a', '#5da341', '#3f7a2e'];
    const trunkH = big ? 34 : 24, tw = big ? 4 : 3, topY = baseY - trunkH;
    for (let y = topY; y < baseY; y++) for (let i = 0; i < tw; i++)
      put(cx - Math.floor(tw / 2) + i, y, i < tw / 2 ? '#8a5a30' : '#5c3a1e');
    for (let k = 0; k < (big ? 4 : 3); k++) {
      const w = (big ? 3 : 2) + k;
      for (let i = -w; i <= w; i++) put(cx + i, baseY - 1 - k, i < 0 ? '#8a5a30' : '#5c3a1e');
    }
    const cl: [number, number, number][] = [
      [cx - (big ? 10 : 7), topY - (big ? 4 : 3), big ? 7 : 5],
      [cx + (big ? 11 : 8), topY - (big ? 7 : 5), big ? 6 : 5],
      [cx + 3, topY - 2, big ? 6 : 5],
      [cx - 3, topY - (big ? 12 : 9), big ? 8 : 6],
    ];
    cl.forEach(([bx, by, r]) => {
      for (let y = Math.floor(by - r); y <= Math.ceil(by + r); y++)
        for (let x = Math.floor(bx - r); x <= Math.ceil(bx + r); x++) {
          if (Math.hypot(x - bx, y - by) > r) continue;
          const u = (x - bx) / r, vv = (y - by) / r, t = u * 0.55 + vv * 0.78;
          let c = t < -0.45 ? G[0] : (t < -0.05 ? G[1] : (t < 0.42 ? G[2] : G[3]));
          if (vv > 0.72) c = far ? '#3a5c39' : '#2c5720';
          put(x, y, c);
        }
    });
  };
  [[64, true, false], [156, true, false], [248, true, false], [352, true, false],
   [430, false, true], [112, false, true], [300, false, true]].forEach(([x, big, far]) =>
    tree(x as number, surf(x as number), big as boolean, far as boolean));

  /* 区域图标 + 冒险者 */
  nodes.forEach((nd) => {
    const sp = REGION_SPRITES[nd.region.icon] ?? REGION_SPRITES.beach;
    const { w, h } = spriteSize(sp);
    const dim = nd.state === 'soon' || nd.state === 'lock';
    const rects = rasterize(sp, nd.x - Math.round(w / 2), nd.y - h, dim ? '#101a12' : '#0f1218');
    rects.forEach((r) => {
      const c = /^#[0-9a-f]{6}$/i.test(r.c) ? r.c : '#000000';
      put(r.x, r.y, dim ? dimHex(c, nd.state === 'soon' ? 0.85 : 0.7) : c);
    });
  });
  const heroNode = nodes.find((n) => n.region.id === opts.heroRegionId);
  if (heroNode) {
    const { h } = spriteSize(HERO);
    rasterize(HERO, heroNode.x + 16, heroNode.y - h, '#0f1218').forEach((r) => put(r.x, r.y, r.c));
  }

  return { rects: R, nodes };
}

/* ---------- 画到 canvas ---------- */
export function paint(canvas: HTMLCanvasElement, rects: Rect[]) {
  canvas.width = MAP_W;
  canvas.height = MAP_H;
  const ctx = canvas.getContext('2d', { alpha: false })!;
  const img = ctx.createImageData(MAP_W, MAP_H);
  const buf = img.data;
  const cache = new Map<string, [number, number, number]>();
  for (const r of rects) {
    let rgb = cache.get(r.c);
    if (!rgb) {
      rgb = [parseInt(r.c.slice(1, 3), 16), parseInt(r.c.slice(3, 5), 16), parseInt(r.c.slice(5, 7), 16)];
      cache.set(r.c, rgb);
    }
    const i = (r.y * MAP_W + r.x) * 4;
    buf[i] = rgb[0]; buf[i + 1] = rgb[1]; buf[i + 2] = rgb[2]; buf[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
}

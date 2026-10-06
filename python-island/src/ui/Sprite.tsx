import { PALETTE, type SpriteMap } from '../gfx/sprites';

/** 把像素 sprite 渲染成 SVG（矢量缩放，永不模糊） */
export function Sprite({ map, scale = 3, dim, title }: { map: SpriteMap; scale?: number; dim?: number; title?: string }) {
  const h = map.length, w = map[0]?.length ?? 0;
  const cells: { x: number; y: number; c: string }[] = [];
  map.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      const c = PALETTE[ch];
      if (c) cells.push({ x, y, c });
    }),
  );
  const col = (hex: string) => {
    if (!dim) return hex;
    const p = (i: number) => parseInt(hex.slice(i, i + 2), 16);
    const r = p(1), g = p(3), b = p(5), avg = (r + g + b) / 3;
    const k = 0.72 * dim, d = 1 - 0.34 * dim;
    const f = (v: number) => Math.max(0, Math.min(255, Math.round((v + (avg - v) * k) * d)));
    return '#' + [f(r), f(g), f(b)].map((v) => v.toString(16).padStart(2, '0')).join('');
  };
  return (
    <svg width={w * scale} height={h * scale} viewBox={`0 0 ${w} ${h}`}
         shapeRendering="crispEdges" style={{ display: 'block' }} role="img" aria-label={title}>
      {cells.map((c, i) => (
        <rect key={i} x={c.x} y={c.y} width={1} height={1} fill={col(c.c)} />
      ))}
    </svg>
  );
}

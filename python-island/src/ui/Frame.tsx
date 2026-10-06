import type { CSSProperties, ReactNode } from 'react';

/** 8px 倒角像素框 */
export function Px8({ children, className = '', style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div className={`px8 ${className}`} style={style}>
      <div className="in">{children}</div>
    </div>
  );
}

/** 12px 倒角 + 双层描边（重点面板用） */
export function Px12({ children, ring, style }: { children: ReactNode; ring?: string; style?: CSSProperties }) {
  return (
    <div className="px12" style={{ ...(ring ? { ['--ring' as any]: ring } : {}), ...style }}>
      <div className="ln">
        <div className="in">{children}</div>
      </div>
    </div>
  );
}

/** 带标题栏的像素卡片 */
export function Card({ title, right, children, ring }: { title?: string; right?: ReactNode; children: ReactNode; ring?: string }) {
  return (
    <div className="card" style={{ boxShadow: `0 0 0 3px ${ring ?? 'var(--line)'}` }}>
      {title && <div className="hd"><span>{title}</span>{right}</div>}
      <div className="bd">{children}</div>
    </div>
  );
}

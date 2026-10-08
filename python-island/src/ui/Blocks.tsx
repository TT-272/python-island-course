import type { Block } from '../content/types';

/** 统一的讲解区块渲染：普通段落 / 代码 / 重点 / 提示 */
export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="blocks">
      {blocks.map((b, i) => {
        if (b.t === 'p') return <p key={i}>{b.text}</p>;
        if (b.t === 'code') return <div key={i} className="code">{b.code}</div>;
        if (b.t === 'key') return <div key={i} className="keyblk"><span className="keytag">重点</span><span>{b.text}</span></div>;
        return <div key={i} className="tip">{b.text}</div>;
      })}
    </div>
  );
}

import { regionById, lessonsOfRegion } from '../content';
import { extraOf } from '../content/exams';
import { Card } from '../ui/Frame';
import { Blocks } from '../ui/Blocks';
import { useProgress, isDone } from '../state/progress';

/** 区域知识总结页：通关整区后解锁 */
export function RegionSummaryPage({ id, go }: { id: string; go: (to: string) => void }) {
  const region = regionById(id);
  const progress = useProgress();
  const extra = extraOf(id);

  if (!region) {
    return <div className="wrap"><div className="col"><Card title="找不到这个区域"><div className="empty">区域 id：{id}</div></Card></div></div>;
  }

  const lessons = lessonsOfRegion(region.id);
  const allDone = lessons.length > 0 && lessons.every((l) => isDone(progress, l.id));

  if (!allDone || !extra) {
    return (
      <div className="wrap"><div className="col">
        <h1 className="title">{region.name} · 知识总结</h1>
        <Card title="还没解锁">
          <div className="empty">
            先把「{region.name}」的 {lessons.length} 关全部通关，这一区的知识总结就解锁了。<br />
            你已经完成 {lessons.filter((l) => isDone(progress, l.id)).length} / {lessons.length} 关。
          </div>
          <div style={{ marginTop: 12 }}>
            <button className="btn ghost sm" onClick={() => go(`/region/${region.id}`)}>← 回到 {region.name}</button>
          </div>
        </Card>
      </div></div>
    );
  }

  return (
    <div className="wrap"><div className="col">
      <div className="kicker">
        <span className="tag">{region.name}</span>
        <span className="tag">知识总结</span>
      </div>
      <h1 className="title">{region.name} · 知识总结</h1>
      <div className="sub">这一区学到的东西，一屏看完。</div>

      <Blocks blocks={extra.summary} />

      <div className="helper">
        <button className="btn primary sm" onClick={() => go(`/region/${region.id}/exam`)}>去考试 →</button>
        <button className="btn ghost sm" onClick={() => go(`/region/${region.id}`)}>← 回到 {region.name}</button>
        <button className="btn ghost sm" onClick={() => go('/')}>回到地图</button>
      </div>
    </div></div>
  );
}

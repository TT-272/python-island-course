import { REGIONS, lessonsOfRegion, regionState } from '../content';
import { Card } from '../ui/Frame';
import { Sprite } from '../ui/Sprite';
import { REGION_SPRITES } from '../gfx/sprites';
import { useProgress, isDone, tierOf } from '../state/progress';

export function BadgesPage() {
  const progress = useProgress();
  const isD = (id: string) => isDone(progress, id);

  return (
    <div className="wrap">
      <div className="col">
        <h1 className="title">徽章墙</h1>
        <div className="sub">通关一整个区域，点亮一枚徽章</div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(190px,1fr))', gap: 14 }}>
          {REGIONS.map((r) => {
            const st = regionState(r, isD);
            const lessons = lessonsOfRegion(r.id);
            const doneN = lessons.filter((l) => isD(l.id)).length;
            const gold = lessons.length > 0 && lessons.every((l) => tierOf(progress.lessons[l.id]) === 'gold' && isD(l.id));
            return (
              <div key={r.id} className="card" style={{ margin: 0, boxShadow: `0 0 0 3px ${st === 'done' ? 'var(--yellow)' : 'var(--line)'}` }}>
                <div className="bd" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ opacity: st === 'done' ? 1 : 0.32, filter: st === 'done' ? 'none' : 'grayscale(1)' }}>
                    <Sprite map={REGION_SPRITES[r.icon] ?? REGION_SPRITES.beach} scale={3} title={r.name} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div className="pz" style={{ fontSize: 13, color: st === 'done' ? '#fff' : 'var(--dim)', marginBottom: 5 }}>
                      {r.name}
                    </div>
                    <div className="tip">
                      {st === 'soon' ? `计划 ${r.planned} 关`
                        : st === 'done' ? `已通关${gold ? ' · 全区金卡' : ''}${progress.exams[r.id]?.passed ? ' · 考试通过' : ''}`
                        : `${doneN} / ${lessons.length} 关`}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

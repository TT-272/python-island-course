import { LESSONS, TYPE_LABEL, regionById, lessonsOfRegion, isUnlocked } from '../content';
import { Card, Px12 } from '../ui/Frame';
import { useProgress, isDone, tierOf, xpOf } from '../state/progress';

export function RegionPage({ id, go }: { id: string; go: (to: string) => void }) {
  const region = regionById(id);
  const progress = useProgress();
  if (!region) return <div className="wrap"><Card title="找不到这个区域"><div className="empty">区域 id：{id}</div></Card></div>;

  const lessons = lessonsOfRegion(region.id);
  const doneN = lessons.filter((l) => isDone(progress, l.id)).length;
  const isSoon = region.comingSoon || lessons.length === 0;
  const exam = progress.exams[region.id];

  return (
    <div className="wrap">
      <div className="col">
        <h1 className="title">{region.name}</h1>
        <div className="sub">
          {isSoon ? '内容还没做 —— 敬请期待' : `${doneN} / ${lessons.length} 关 · 通关整区可得「${region.badge.name}」`}
        </div>

        {isSoon ? (
          <Card title="这一区还在施工">
            <div className="empty">
              这一区计划 <b style={{ color: '#fff' }}>{region.planned}</b> 关，目前内容还没写。<br />
              先把第一季前面的区域做完，这里会陆续开放。
            </div>
          </Card>
        ) : (
          <div className="lessonlist">
            {lessons.map((l, i) => {
              const unlocked = isUnlocked(l.id, (x) => isDone(progress, x));
              const rec = progress.lessons[l.id];
              const card = rec?.done ? tierOf(rec) : null;
              return (
                <button key={l.id} className="lrow" disabled={!unlocked} onClick={() => go(`/lesson/${l.id}`)}>
                  <span className="no">{String(i + 1).padStart(2, '0')}</span>
                  <span className="mid">
                    <span className="ttl">{l.boss ? '🏆 ' : ''}{l.title}</span>
                    <span className="smy">{unlocked ? l.summary : '先做完上一关'}</span>
                  </span>
                  <span className="right">
                    <span className="pill">{TYPE_LABEL[l.type]}</span>
                    <span className="pill">{l.xp} XP</span>
                    {card
                      ? <span className={`cardchip ${card}`}>{card === 'gold' ? '★ 金' : card === 'silver' ? '★ 银' : '☆ 灰'}</span>
                      : <span className="cardchip none">{unlocked ? '未通关' : '🔒'}</span>}
                  </span>
                </button>
              );
            })}
          </div>
        )}
        {!isSoon && doneN === lessons.length && lessons.length > 0 && (
          <div className="card" style={{ boxShadow: '0 0 0 3px var(--yellow)' }}>
            <div className="hd"><span>🎓 这一区通关了</span></div>
            <div className="bd">
              <div className="tip">整区通关！做一套综合考题，把这一区彻底拿下。</div>
              <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
                <button className="btn ghost sm" onClick={() => go(`/region/${region.id}/summary`)}>📖 知识总结</button>
                <button className="btn primary sm" onClick={() => go(`/region/${region.id}/exam`)}>📝 综合考题</button>
              </div>
              {exam && (
                <div className="tip" style={{ marginTop: 10 }}>
                  考试状态：{exam.passed ? '已通过 🎉' : '还没通过'}{exam.best > 0 ? ` · 最好成绩 ${Math.round(exam.best * 100)}%` : ''}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="side">
        <Card title="这一区">
          <div className="kv"><span>关卡</span><b>{doneN} / {lessons.length || region.planned}</b></div>
          <div className="kv"><span>题型</span><b>{lessons.length ? [...new Set(lessons.map((l) => TYPE_LABEL[l.type]))].length + ' 种' : '—'}</b></div>
          <div className="kv"><span>徽章</span><b>{doneN === lessons.length && lessons.length > 0 ? '已获得' : '未获得'}</b></div>
        </Card>
        <Card title="你在这里"> 
          <div className="tip">
            当前进度：已完成 {LESSONS.filter((l) => isDone(progress, l.id)).length} / {LESSONS.length} 关，
            共 {xpOf(progress)} XP。
          </div>
          <div style={{ marginTop: 12 }}>
            <button className="btn ghost sm" onClick={() => go('/')}>回到地图</button>
          </div>
        </Card>
      </div>
    </div>
  );
}

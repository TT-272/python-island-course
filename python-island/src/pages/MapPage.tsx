import { useEffect, useMemo, useRef, useState } from 'react';
import {
  REGIONS, LESSONS, TOTAL_BADGES, TOTAL_XP, levelProgress, nextLesson,
  regionState, type Region,
} from '../content';
import { renderWorld, paint, MAP_W, MAP_H, type NodePos } from '../map/world';
import { Px12, Card } from '../ui/Frame';
import { useProgress, isDone, xpOf } from '../state/progress';

export function MapPage({ go }: { go: (to: string) => void }) {
  const progress = useProgress();
  const cv = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<NodePos[]>([]);

  // 地图只画第一季（6 个区域）—— 第二季 7 个区域列在侧栏里
  const season1 = useMemo(() => REGIONS.filter((r) => r.season === 1), []);

  // 当前进行中的区域 = 第一个没做完的关卡所在的区；全部做完就是 null
  const heroRegion = useMemo(() => {
    const nl = nextLesson((id) => isDone(progress, id));
    return nl && !isDone(progress, nl.id) ? nl.region : null;
  }, [progress]);

  useEffect(() => {
    if (!cv.current) return;
    const { rects, nodes: ns } = renderWorld({
      regions: season1,
      stateOf: (r: Region) => regionState(r, (id) => isDone(progress, id)),
      heroRegionId: heroRegion ?? undefined,
    });
    paint(cv.current, rects);
    setNodes(ns);
  }, [progress, season1, heroRegion]);

  const doneN = LESSONS.filter((l) => isDone(progress, l.id)).length;
  const xp = xpOf(progress);
  const lp = levelProgress(xp);
  const earnedBadges = season1.filter((r) => regionState(r, (id) => isDone(progress, id)) === 'done').length;
  const nl = nextLesson((id) => isDone(progress, id));
  const season2 = REGIONS.filter((r) => r.season === 2);
  // 全做完了就把标签挪到最后一个区域，改说"全部完成"
  const tagNode = nodes.find((x) => x.region.id === (heroRegion ?? LESSONS[LESSONS.length - 1]?.region));

  return (
    <div className="wrap">
      <div className="col">
        <h1 className="title">冒险者，欢迎来到 Python 岛</h1>
        <div className="sub">已点亮 {doneN} / {LESSONS.length} 关 · 进度自动保存</div>
        <Px12 ring="#3c4665">
          <div style={{ padding: 8 }}>
            <div className="mapwrap">
              <canvas id="map" ref={cv} width={MAP_W} height={MAP_H} />
              {nodes.map((n) => (
                <div key={n.region.id} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                  <div
                    className={`marker ${n.state}`}
                    style={{ left: `${(n.x / MAP_W) * 100}%`, top: `${((n.y - 22) / MAP_H) * 100}%` }}
                  >
                    <div className="plate">
                      <div className="nm">{n.region.name}</div>
                      <div className="st">
                        {n.state === 'soon' ? (n.region.season === 2 ? '第二季' : '还没做')
                          : n.state === 'done' ? '已通关'
                          : n.state === 'now' ? '进行中'
                          : '未解锁'}
                      </div>
                    </div>
                  </div>
                  {n.state !== 'soon' && (
                    <button
                      className="nodehit"
                      style={{ left: `${(n.x / MAP_W) * 100}%`, top: `${(n.y / MAP_H) * 100}%`, width: 34, height: 34 }}
                      title={n.region.name}
                      onClick={() => go(`/region/${n.region.id}`)}
                    />
                  )}
                </div>
              ))}
              {tagNode && (
                <div
                  className="nowtag"
                  style={{
                    left: `${Math.min(tagNode.x + 44, MAP_W - 38) / MAP_W * 100}%`,
                    top: `${(tagNode.y - 40) / MAP_H * 100}%`,
                  }}
                >
                  {heroRegion ? '你在这里' : '全部完成'}
                </div>
              )}
            </div>
          </div>
        </Px12>
      </div>

      <div className="side">
        <Card title="进度" ring="#92cc41">
          <div className="kv"><span>关卡</span><b>{doneN} / {LESSONS.length}</b></div>
          <div className="kv"><span>经验</span><b>{xp} / {TOTAL_XP}</b></div>
          <div className="kv"><span>等级</span><b>Lv.{lp.lv}{lp.next !== null ? ` · 距下一级 ${lp.next - xp}` : ' · 满级'}</b></div>
          <div className="kv ok"><span>徽章</span><b>{earnedBadges} / {TOTAL_BADGES}</b></div>
        </Card>

        <Card title="继续学习">
          {nl && !isDone(progress, nl.id) ? (
            <>
              <div className="pz" style={{ fontSize: 13, color: '#fff', marginBottom: 8 }}>{nl.title}</div>
              <div className="tip" style={{ marginBottom: 12 }}>{nl.summary}</div>
              <button className="btn warn sm" onClick={() => go(`/lesson/${nl.id}`)}>进入这一关 →</button>
            </>
          ) : (
            <>
              <div className="tip" style={{ marginBottom: 12 }}>第一季全部通关 —— 去做你的毕业设计吧。</div>
              <button className="btn warn sm" onClick={() => go('/studio')}>🔧 进入毕业设计 →</button>
            </>
          )}
        </Card>

        <Card title="第二季 · 敬请期待">
          <div className="soon">
            {season2.map((r) => (
              <div className="soonitem" key={r.id}>
                <span>{r.name}</span>
                <span>{r.planned} 关</span>
              </div>
            ))}
          </div>
          <div className="tip" style={{ marginTop: 10 }}>
            第二季的目标是做出一个能发给别人、打开就用的网页小工具。
          </div>
        </Card>
      </div>
    </div>
  );
}

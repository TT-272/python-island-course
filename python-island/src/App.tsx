import { useRoute } from './router';
import { LESSONS, TOTAL_XP, levelProgress } from './content';
import { useProgress, xpOf, doneCount } from './state/progress';
import { MapPage } from './pages/MapPage';
import { RegionPage } from './pages/RegionPage';
import { LessonPage } from './pages/LessonPage';
import { BadgesPage } from './pages/BadgesPage';
import { AboutPage } from './pages/AboutPage';
import { EnginePage } from './pages/EnginePage';

export default function App() {
  const [route, go] = useRoute();
  const progress = useProgress();
  const xp = xpOf(progress);
  const lp = levelProgress(xp);
  const done = doneCount(progress);
  const total = LESSONS.length;

  const tab = route.name === 'badges' ? 'badges' : route.name === 'about' || route.name === 'engine' ? 'about' : 'map';

  return (
    <>
      <div className="topbar">
        <button className="logo" onClick={() => go('/')}>
          <span className="coin" />Python 岛
        </button>
        <div className="nav">
          <button className={tab === 'map' ? 'on' : ''} onClick={() => go('/')}>地图</button>
          <button className={tab === 'badges' ? 'on' : ''} onClick={() => go('/badges')}>徽章</button>
          <button className={tab === 'about' ? 'on' : ''} onClick={() => go('/about')}>关于</button>
        </div>
        <div className="sp" />
        <div className="hud">
          <div className="xpwrap">
            <div className="xpbar"><i style={{ width: `${Math.round(lp.ratio * 100)}%` }} /></div>
            <div className="xptxt">
              <span>{xp} / {TOTAL_XP}</span>
              <span>{done} / {total} 关</span>
            </div>
          </div>
          <div className="lvl">LV.{lp.lv}</div>
        </div>
      </div>

      {route.name === 'map' && <MapPage go={go} />}
      {route.name === 'region' && <RegionPage id={route.id} go={go} />}
      {route.name === 'lesson' && <LessonPage id={route.id} go={go} />}
      {route.name === 'badges' && <BadgesPage />}
      {route.name === 'about' && <AboutPage go={go} />}
      {route.name === 'engine' && <EnginePage />}
    </>
  );
}

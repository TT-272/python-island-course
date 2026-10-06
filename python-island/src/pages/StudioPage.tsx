import { useEffect, useMemo, useRef, useState } from 'react';
import { Judge, type JudgeResult } from '../runtime/judge';
import { CodeEditor } from '../ui/CodeEditor';
import { Card } from '../ui/Frame';
import { useProgress, doneCount } from '../state/progress';
import { TOTAL_LESSONS } from '../content';
import { playClick } from '../ui/sound';

const STORE_KEY = 'py-island-studio-v1';

type StudioSave = { title: string; code: string; savedAt: number; author?: string };

function loadSave(): StudioSave | null {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as StudioSave) : null;
  } catch {
    return null;
  }
}

const IDEAS = [
  { name: '点歌台', desc: '把歌名存进列表，input 选序号，打印「正在播放：xxx」' },
  { name: '简易问答机', desc: '一个字典存「问题→答案」，while 循环一直问，输 q 退出' },
  { name: 'BMI 计算器', desc: 'input 身高体重 → float 换算 → if 分档给出提示' },
  { name: '倒计时发射', desc: 'for 从 10 数到 1，每个数字用 time 相关技巧或直接打印，0 时打印「点火！」' },
  { name: '密码强度检查', desc: 'input 一个密码，用 len / in / isdigit 组合判断强弱' },
  { name: '你自己的', desc: '任何你想做的小东西 —— 需求你定，代码你写' },
];

/** 像素风分享卡：全部用 canvas 画，不依赖任何图片素材（和站内美术同一思路） */
function drawShareCard(cv: HTMLCanvasElement, opts: { title: string; author: string; date: string }) {
  const W = 720, H = 460;
  cv.width = W; cv.height = H;
  const g = cv.getContext('2d');
  if (!g) return;

  const PX = (fam: number | string) => `${fam}px "PixelZH","Microsoft YaHei",sans-serif`;
  const bg = '#14171a', panel = '#1c2129', line = '#3c4665';
  const green = '#92cc41', yellow = '#f7d51d', blue = '#209cee', text = '#e0e0f1', dim = '#7c8398';

  // 背景 + 双层像素边框
  g.fillStyle = bg; g.fillRect(0, 0, W, H);
  g.strokeStyle = line; g.lineWidth = 4; g.strokeRect(12, 12, W - 24, H - 24);
  g.strokeStyle = green; g.lineWidth = 2; g.strokeRect(20, 20, W - 40, H - 40);

  // 顶部横幅
  g.fillStyle = panel; g.fillRect(32, 32, W - 64, 64);
  g.fillStyle = yellow; g.fillRect(32, 32, 8, 64);
  g.fillStyle = text; g.font = PX(26); g.textBaseline = 'middle';
  g.fillText('🏝 Python 岛 · 毕业证书', 56, 64);

  // 金币
  g.fillStyle = yellow; g.beginPath(); g.arc(W - 72, 64, 22, 0, Math.PI * 2); g.fill();
  g.fillStyle = bg; g.font = PX(20); g.textAlign = 'center';
  g.fillText('P', W - 72, 66); g.textAlign = 'left';

  // 「通关者」标签
  g.fillStyle = dim; g.font = PX(15);
  g.fillText('以下冒险者已完成第一季全部 40 关', 56, 140);

  // 作者名（大字）
  g.fillStyle = green; g.font = PX(38);
  g.fillText(opts.author || '无名冒险者', 56, 190);

  // 作品名
  g.fillStyle = dim; g.font = PX(15);
  g.fillText('毕业设计作品', 56, 240);
  g.fillStyle = text; g.font = PX(24);
  const t = opts.title.length > 16 ? opts.title.slice(0, 15) + '…' : opts.title;
  g.fillText(`《${t}》`, 56, 276);

  // 数据行
  g.fillStyle = panel; g.fillRect(56, 310, W - 112, 56);
  g.strokeStyle = line; g.lineWidth = 2; g.strokeRect(56, 310, W - 112, 56);
  g.font = PX(16);
  g.fillStyle = yellow; g.fillText('520 XP', 80, 338);
  g.fillStyle = blue; g.fillText('LV.5', 190, 338);
  g.fillStyle = green; g.fillText('6/6 徽章', 270, 338);
  g.fillStyle = dim; g.font = PX(13);
  g.fillText(opts.date, W - 220, 338);

  // 底部小字
  g.fillStyle = dim; g.font = PX(11);
  g.fillText('从 print 一行，到亲手做一个东西。', 56, H - 56);
}

function pxDate(ts: number | null): string {
  const d = ts ? new Date(ts) : new Date();
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export function StudioPage({ go }: { go: (to: string) => void }) {
  const progress = useProgress();
  const judge = useMemo(() => new Judge(), []);
  const allDone = doneCount(progress) >= TOTAL_LESSONS;

  const saved = useRef<StudioSave | null>(loadSave());
  const [title, setTitle] = useState(() => saved.current?.title ?? '我的毕业设计');
  const [author, setAuthor] = useState(() => saved.current?.author ?? '');
  const [code, setCode] = useState(() => saved.current?.code ?? '# 毕业设计：做一个你自己想要的小东西\n# 没有判分，没有对错 —— 运行、玩、改到满意为止。\n\n');
  const [result, setResult] = useState<JudgeResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(() => saved.current?.savedAt ?? null);
  const [cardOpen, setCardOpen] = useState(false);
  const cardCv = useRef<HTMLCanvasElement | null>(null);

  // 生成/刷新分享卡：等像素字体加载完再画，否则 canvas 会退回系统字体
  useEffect(() => {
    if (!cardOpen || !cardCv.current) return;
    document.fonts.ready.then(() => {
      if (cardCv.current) {
        drawShareCard(cardCv.current, { title, author, date: pxDate(savedAt) });
      }
    });
  }, [cardOpen, title, author, savedAt]);

  function savePng() {
    const cv = cardCv.current;
    if (!cv) return;
    const a = document.createElement('a');
    a.href = cv.toDataURL('image/png');
    a.download = `python-island-${(author || 'adventurer').trim()}.png`;
    a.click();
  }

  // 作品存本地：离开页面不丢。存档和关卡进度一样都在浏览器 localStorage 里。
  useEffect(() => {
    const t = setTimeout(() => {
      const data: StudioSave = { title, code, savedAt: Date.now(), author };
      try {
        localStorage.setItem(STORE_KEY, JSON.stringify(data));
        setSavedAt(data.savedAt);
      } catch { /* 存储满了等异常：不打断创作 */ }
    }, 600);
    return () => clearTimeout(t);
  }, [title, code, author]);

  async function run() {
    if (busy) return;
    setBusy(true);
    setResult(null);
    playClick(progress.settings.sound);
    const r = await judge.run(code, {});
    setResult(r);
    setBusy(false);
  }

  function download() {
    const blob = new Blob([code], { type: 'text/x-python' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${title.trim() || 'my-work'}.py`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  if (!allDone) {
    return (
      <div className="wrap">
        <Card title="🔒 还没解锁">
          <div className="tip" style={{ lineHeight: 2 }}>
            毕业设计在打完第一季全部 {TOTAL_LESSONS} 关之后解锁 —— 先去把熔炉的火点着。
          </div>
          <div style={{ marginTop: 12 }}>
            <button className="btn primary sm" onClick={() => go('/')}>回到地图 →</button>
          </div>
        </Card>
      </div>
    );
  }

  const fmt = savedAt ? new Date(savedAt).toLocaleString('zh-CN', { hour12: false }) : null;

  return (
    <div className="wrap">
      <div className="col">
        <h1 className="title">🔧 毕业设计</h1>
        <div className="sub">没有题目，没有判分，没有对错。做一个你自己想要的东西。</div>

        <Card title="这一步和前面的关卡有什么不同">
          <div className="tip" style={{ lineHeight: 2 }}>
            前面 40 关是<b style={{ color: '#fff' }}>题目</b>决定你写什么；从这里开始是
            <b style={{ color: '#fff' }}>你</b>决定写什么。真实编程的样子就是：有个想法 →
            不会的部分去翻前面的关 → 改到能跑 → 改到喜欢。
            <br /><br />
            这里<b style={{ color: '#fff' }}>没有提交按钮</b> —— 没人给你打分，运行到你满意为止。
            代码会自动存在这个浏览器里，随时回来接着改。
          </div>
        </Card>

        <Card title="没想法？先从一个开始">
          <div className="tip" style={{ lineHeight: 2 }}>
            {IDEAS.map((d, i) => (
              <div key={i} style={{ marginBottom: 4 }}>· <b style={{ color: '#fff' }}>{d.name}</b> —— {d.desc}</div>
            ))}
          </div>
        </Card>
      </div>

      <div className="side">
        <Card title="作品">
          <div style={{ marginBottom: 10 }}>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="给作品起个名字"
              className="pxinput"
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="你的名字（用在毕业卡上）"
              className="pxinput"
              style={{ width: '100%' }}
            />
          </div>
          <div className="kv"><span>状态</span><b>{fmt ? `已自动保存 · ${fmt}` : '尚未保存'}</b></div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            <button className="btn ghost sm" onClick={() => { setCardOpen(!cardOpen); playClick(progress.settings.sound); }}>
              📸 {cardOpen ? '收起' : '生成'}毕业卡
            </button>
            <button className="btn ghost sm" onClick={download}>⬇ 导出 .py</button>
            <button className="btn ghost sm" onClick={() => go('/')}>← 回地图</button>
          </div>
        </Card>

        {cardOpen && (
          <Card title="毕业卡 · 保存下来发给朋友" ring="#f7d51d">
            <canvas ref={cardCv} style={{ width: '100%', imageRendering: 'pixelated', display: 'block' }} />
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button className="btn warn sm" onClick={savePng}>⬇ 保存 PNG</button>
            </div>
            <div className="tip" style={{ marginTop: 8 }}>改名字或作品名后卡片会自动重画。</div>
          </Card>
        )}

        <div className="editorwrap" style={{ marginTop: 12 }}>
          <CodeEditor value={code} onChange={setCode} height={420} />
        </div>
        <div className="toolbar" style={{ marginTop: 8 }}>
          <button className="btn ghost sm" style={{ marginRight: 'auto' }} onClick={() => setCode('')} disabled={busy}>清空</button>
          <button className="btn primary" onClick={run} disabled={busy}>
            {busy ? '运行中…' : '▶ 运行'}
          </button>
        </div>

        <div className="term" style={{ marginTop: 12 }}>
          {!result && <span className="hint">写点什么，然后点「运行」。</span>}
          {result && result.timedOut && <div className="warn">⏱ {result.error?.friendly}</div>}
          {result && !result.timedOut && result.error && (
            <>
              <div className="err">✗ {result.error.friendly}</div>
              <div className="hint">原始报错：{result.error.type}: {result.error.message}</div>
            </>
          )}
          {result && !result.timedOut && !result.error && (
            <div className="ok">✓ 运行完成 · {result.ms} ms</div>
          )}
          {result && !result.timedOut && !result.error && (
            <div style={{ marginTop: 8 }}>{result.stdout || <span className="hint">（没有输出 —— 需要交互的程序记得用 input()）</span>}</div>
          )}
          {result?.fatal && <div className="err">{result.fatal}</div>}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useRef, useState } from 'react';
import { Judge, type JudgeResult } from '../runtime/judge';
import { CodeEditor } from '../ui/CodeEditor';
import { Card } from '../ui/Frame';
import { useProgress, doneCount } from '../state/progress';
import { TOTAL_LESSONS } from '../content';
import { playClick } from '../ui/sound';

const STORE_KEY = 'py-island-studio-v1';

type StudioSave = { title: string; code: string; savedAt: number };

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

export function StudioPage({ go }: { go: (to: string) => void }) {
  const progress = useProgress();
  const judge = useMemo(() => new Judge(), []);
  const allDone = doneCount(progress) >= TOTAL_LESSONS;

  const saved = useRef<StudioSave | null>(loadSave());
  const [title, setTitle] = useState(() => saved.current?.title ?? '我的毕业设计');
  const [code, setCode] = useState(() => saved.current?.code ?? '# 毕业设计：做一个你自己想要的小东西\n# 没有判分，没有对错 —— 运行、玩、改到满意为止。\n\n');
  const [result, setResult] = useState<JudgeResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(() => saved.current?.savedAt ?? null);

  // 作品存本地：离开页面不丢。存档和关卡进度一样都在浏览器 localStorage 里。
  useEffect(() => {
    const t = setTimeout(() => {
      const data: StudioSave = { title, code, savedAt: Date.now() };
      try {
        localStorage.setItem(STORE_KEY, JSON.stringify(data));
        setSavedAt(data.savedAt);
      } catch { /* 存储满了等异常：不打断创作 */ }
    }, 600);
    return () => clearTimeout(t);
  }, [title, code]);

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
          <div className="kv"><span>状态</span><b>{fmt ? `已自动保存 · ${fmt}` : '尚未保存'}</b></div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            <button className="btn ghost sm" onClick={download}>⬇ 导出 .py</button>
            <button className="btn ghost sm" onClick={() => go('/')}>← 回地图</button>
          </div>
        </Card>

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

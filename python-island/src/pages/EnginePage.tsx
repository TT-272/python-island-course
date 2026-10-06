import { useEffect, useMemo, useState } from 'react';
import { Judge, type JudgeResult, type JudgeStatus, type TestSpec } from '../runtime/judge';
import { CodeEditor } from '../ui/CodeEditor';
import { Card } from '../ui/Frame';
import { LESSONS } from '../content';

type Case = { name: string; code: string; stdin?: string; tests?: TestSpec[] };

const CASES: Case[] = [
  { name: '正常输出', code: 'print("Hi")\n' },
  { name: '语法错误', code: 'print("Hi"\n' },
  { name: '变量拼错', code: 'nmae = "小明"\nprint(name)\n' },
  { name: '缩进错误', code: 'if True:\nprint("少了缩进")\n' },
  { name: '类型混用', code: 'age = 18\nprint("我" + age)\n' },
  { name: '死循环', code: 'n = 0\nwhile True:\n    n += 1\n' },
  { name: 'input 输入', code: 'name = input()\nprint(f"你好，{name}")\n', stdin: '小明\n' },
  {
    name: '判分用例',
    code: 'score = 75\nif score >= 60:\n    print("及格")\n',
    tests: [
      { name: '输出内容正确', code: 'assert _stdout.strip() == "及格", f"这题应该输出 及格，你的程序输出的是 {_stdout.strip()!r}"' },
      { name: '只有一行', code: 'assert len([l for l in _stdout.strip().split("\\n") if l.strip()]) == 1, "只应该输出一行"' },
    ],
  },
];

export function EnginePage() {
  const judge = useMemo(() => new Judge(), []);
  const [status, setStatus] = useState<JudgeStatus>('loading');
  const [statusMsg, setStatusMsg] = useState<string | undefined>();
  const [cur, setCur] = useState(0);
  const [code, setCode] = useState(CASES[0].code);
  const [res, setRes] = useState<JudgeResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [contentBusy, setContentBusy] = useState(false);
  const [contentRows, setContentRows] = useState<{ id: string; title: string; ok: boolean; detail: string }[]>([]);

  useEffect(() => {
    const off = judge.onStatus((s, m) => { setStatus(s); setStatusMsg(m); });
    setStatus(judge.status);
    return off;
  }, [judge]);

  function pick(i: number) { setCur(i); setCode(CASES[i].code); setRes(null); }

  async function go(withTests: boolean) {
    setBusy(true); setRes(null);
    const c = CASES[cur];
    setRes(await judge.run(code, { stdin: c.stdin, tests: withTests ? c.tests : undefined }));
    setBusy(false);
  }

  async function checkContent() {
    setContentBusy(true);
    setContentRows([]);
    const rows: { id: string; title: string; ok: boolean; detail: string }[] = [];
    for (const l of LESSONS) {
      const r = await judge.run(l.exercise.solution, { stdin: l.exercise.stdin, tests: l.exercise.tests });
      const failed = r.error || r.timedOut || !r.ok || r.tests.some((t) => !t.passed);
      rows.push({
        id: l.id,
        title: l.title,
        ok: !failed,
        detail: r.error?.friendly
          ?? (r.tests.find((t) => !t.passed)?.name + '：' + r.tests.find((t) => !t.passed)?.detail)
          ?? '通过',
      });
      setContentRows([...rows]);
    }
    setContentBusy(false);
  }

  const statusText = status === 'ready' ? '引擎就绪' : status === 'failed' ? `引擎启动失败：${statusMsg ?? ''}` : '引擎加载中…';
  const dotColor = status === 'ready' ? 'var(--green)' : status === 'failed' ? 'var(--red)' : 'var(--yellow)';

  return (
    <div className="wrap">
      <div className="col">
        <h1 className="title">判题引擎 · 自检台</h1>
        <div className="sub">
          <span style={{ display: 'inline-block', width: 8, height: 8, background: dotColor, marginRight: 7 }} />
          {statusText}
        </div>

        <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap', marginBottom: 14 }}>
          {CASES.map((c, i) => (
            <button key={i} className={`btn sm ${i === cur ? 'warn' : 'ghost'}`} onClick={() => pick(i)}>{c.name}</button>
          ))}
        </div>

        <CodeEditor value={code} onChange={setCode} height={260} />
        <div className="toolbar">
          <button className="btn ghost" disabled={busy} onClick={() => go(false)}>▶ 只有运行</button>
          <button className="btn primary" disabled={busy} onClick={() => go(true)}>✓ 运行并判分</button>
        </div>
      </div>

      <div className="side" style={{ width: 420 }}>
        <Card title="结果">
          <div className="term" style={{ minHeight: 320 }}>
            {!res && <span className="hint">选一个用例，点上面两个按钮之一。</span>}
            {res?.timedOut && <div className="warn">⏱ {res.error?.friendly}</div>}
            {res && !res.timedOut && res.error && (
              <>
                <div className="err">✗ {res.error.friendly}</div>
                <div className="hint">原始报错：{res.error.type}: {res.error.message}</div>
              </>
            )}
            {res && !res.error && (
              <>
                <div>{res.stdout || <span className="hint">（没有输出）</span>}</div>
                {!res.tests.length && <div className="ok">✓ 运行完成 · {res.ms} ms</div>}
              </>
            )}
            {res?.tests.length ? (
              <div className="tests">
                {res.tests.map((t, i) => (
                  <div className="test" key={i}>
                    <span className="flag" style={{ color: t.passed ? 'var(--green)' : 'var(--red)' }}>{t.passed ? '✓' : '✗'}</span>
                    <span>{t.name}{!t.passed && t.detail && <><br /><span className="err">{t.detail}</span></>}</span>
                  </div>
                ))}
                {res.ok && res.tests.every((t) => t.passed) && <div className="ok" style={{ marginTop: 8 }}>🎉 全部通过 · {res.ms} ms</div>}
              </div>
            ) : null}
            {res?.fatal && <div className="err">{res.fatal}</div>}
          </div>
        </Card>

        <Card title="内容自检">
          <div className="tip" style={{ marginBottom: 12 }}>
            把每一关的<b style={{ color: '#fff' }}>参考答案</b>跑一遍，对着它自己的判分用例。
            有一条不绿就说明那道题坏了 —— 学员做题时会卡住。
          </div>
          <button className="btn warn sm" disabled={contentBusy || status !== 'ready'} onClick={checkContent}>
            {contentBusy ? '检查中…' : `检查全部 ${LESSONS.length} 关`}
          </button>
          {contentRows.length > 0 && (
            <div style={{ marginTop: 12 }}>
              {contentRows.map((r) => (
                <div className="test" key={r.id}>
                  <span className="flag" style={{ color: r.ok ? 'var(--green)' : 'var(--red)' }}>{r.ok ? '✓' : '✗'}</span>
                  <span>
                    <span className="mono" style={{ color: 'var(--dim)', marginRight: 8 }}>{r.id}</span>
                    {r.title}
                    {!r.ok && <><br /><span className="err">{r.detail}</span></>}
                  </span>
                </div>
              ))}
              <div style={{ marginTop: 10, color: contentRows.every((r) => r.ok) ? 'var(--green)' : 'var(--red)' }}>
                {contentRows.filter((r) => r.ok).length} / {contentRows.length} 通过
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

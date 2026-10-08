import { useEffect, useMemo, useRef, useState, type JSX } from 'react';
import {
  LESSONS, TYPE_LABEL, lessonById, lessonsOfRegion, regionByLesson,
  isUnlocked, TOTAL_LESSONS,
} from '../content';
import { Judge, type JudgeResult } from '../runtime/judge';
import { CodeEditor } from '../ui/CodeEditor';
import { Px12, Card } from '../ui/Frame';
import { Blocks } from '../ui/Blocks';
import { AiTeacher } from '../ui/AiTeacher';
import { actions, useProgress, isDone, tierOf } from '../state/progress';
import { playWin, playFail, playClick } from '../ui/sound';

type Toast = { id: number; kind: 'xp' | 'good'; title: string; text: string };
let toastSeq = 0;

export function LessonPage({ id, go }: { id: string; go: (to: string) => void }) {
  const lesson = lessonById(id);
  const progress = useProgress();
  const judge = useMemo(() => new Judge(), []);
  const shouldUnlock = useMemo(() => ({ v: 0 }), []);

  const [hintCount, setHintCount] = useState(() => progress.lessons[id]?.hintsUsed ?? 0);
  const [answerOpen, setAnswerOpen] = useState(false);
  const [code, setCode] = useState(() => lesson?.exercise.starterCode ?? '');
  const [result, setResult] = useState<JudgeResult | null>(null);
  const [busy, setBusy] = useState<'' | 'run' | 'submit'>('');
  const [passed, setPassed] = useState(() => isDone(progress, id));
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [bonusOpen, setBonusOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  // 切关卡时把这一关的界面状态重置干净：上一关的代码、运行结果、提示、答案都不该跟过来。
  // 例外：lesson.continuesFrom 声明了「这一关接着上一关写」时，保留编辑器里的代码。
  const prevLessonId = useRef<string | null>(null);
  useEffect(() => {
    const cur = lesson?.id ?? id;
    if (prevLessonId.current === cur) return;
    const prev = prevLessonId.current;
    prevLessonId.current = cur;
    if (!lesson) return;
    const keepCode = lesson.continuesFrom != null && lesson.continuesFrom === prev;
    if (!keepCode) setCode(lesson.exercise.starterCode);
    setResult(null);
    setBusy('');
    setHintCount(progress.lessons[lesson.id]?.hintsUsed ?? 0);
    setAnswerOpen(false);
    setBonusOpen(false);
    setTaskOpen(false);
    setPassed(isDone(progress, lesson.id));
    setToasts([]);
  }, [lesson, id, progress]);

  if (!lesson) {
    return <div className="wrap"><Card title="找不到这一关"><div className="empty">关卡 id：{id}</div></Card></div>;
  }

  const region = regionByLesson(lesson);
  const siblings = region ? lessonsOfRegion(region.id) : [];
  const idx = siblings.findIndex((l) => l.id === lesson.id);
  const prev = idx > 0 ? siblings[idx - 1] : undefined;
  const next = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : undefined;
  const unlocked = isUnlocked(lesson.id, (x) => isDone(progress, x));
  const rec = progress.lessons[id];
  const card = rec?.done ? tierOf(rec) : null;
  // 已通关的关卡，底部下拉里可自由选择，方便回头复习
  const clearedLessons = LESSONS.filter((l) => isDone(progress, l.id));
  const onClearedLesson = clearedLessons.some((l) => l.id === lesson.id);

  // 找 bug 关：把起手代码里的坏地方圈出来，让学员一眼看到该修哪儿
  const bugSpot = lesson.type === 'debug' ? lesson.exercise.bugSpot : undefined;
  const bugAt = bugSpot ? lesson.exercise.starterCode.indexOf(bugSpot.at) : -1;
  const pushToast = (t: Omit<Toast, 'id'>) => {
    const item = { ...t, id: ++toastSeq };
    setToasts((cur) => [...cur, item]);
    setTimeout(() => setToasts((cur) => cur.filter((x) => x.id !== item.id)), 2600);
  };

  async function run(bonus = false) {
    if (busy) return;
    setBusy('run');
    setResult(null);
    const ex = bonus && lesson!.exercise.bonus ? lesson!.exercise.bonus : lesson!.exercise;
    const r = await judge.run(code, { stdin: lesson!.exercise.stdin });
    setResult(r);
    setBusy('');
    if (r.error || r.timedOut) playFail(progress.settings.sound);
  }

  async function submit(bonus = false) {
    if (busy) return;
    setBusy('submit');
    setResult(null);
    const ex = bonus && lesson!.exercise.bonus ? lesson!.exercise.bonus : lesson!.exercise;
    actions.recordTry(lesson!.id);
    const r = await judge.run(code, {
      stdin: lesson!.exercise.stdin,
      tests: ex.tests,
      // 进阶题暂不设结构要求（BonusExercise 没有 requires 字段）
      requires: !bonus ? lesson!.exercise.requires : undefined,
      softChecks: !bonus ? lesson!.exercise.softChecks : undefined,
    });
    setResult(r);
    setBusy('');
    const allPass = r.ok && r.tests.length > 0 && r.tests.every((t) => t.passed);
    if (allPass) {
      const first = !isDone(progress, lesson!.id);
      actions.markDone(lesson!.id);
      setPassed(true);
      playWin(progress.settings.sound);
      const got = isDone(progress, lesson!.id) || first;
      pushToast({ kind: 'xp', title: `+${lesson!.xp} XP`, text: first ? '你通过了这一关，继续加油！' : '重玩也通关了 —— 不过 XP 只算一次。' });
      pushToast({ kind: 'good', title: '太棒了！', text: next ? '点「下一关」继续。' : '这一区你做完了。' });
    } else {
      playFail(progress.settings.sound);
    }
  }

  function revealHint() {
    const total = lesson!.exercise.hints.length;
    if (hintCount >= total) return;
    setHintCount(hintCount + 1);
    actions.useHint(lesson!.id);
    playClick(progress.settings.sound);
  }

  function revealAnswer() {
    if (!confirm('看过答案之后，这一关的卡片会变成灰卡。确定要看吗？')) return;
    setAnswerOpen(true);
    actions.seeAnswer(lesson!.id);
  }

  const stages = (() => {
    if (!result) return null;
    const rows: JSX.Element[] = [];
    if (result.timedOut) {
      rows.push(<div key="to" className="warn">⏱ {result.error?.friendly}</div>);
      return rows;
    }
    if (result.error) {
      rows.push(<div key="err" className="err">✗ {result.error.friendly}</div>);
      rows.push(<div key="raw" className="hint">原始报错：{result.error.type}: {result.error.message}</div>);
      return rows;
    }
    rows.push(<div key="out">{result.stdout || <span className="hint">（没有输出）</span>}</div>);
    if (!result.tests.length) {
      rows.push(<div key="ok" className="ok">✓ 运行完成 · {result.ms} ms</div>);
      return rows;
    }
    return rows;
  })();

  // 给 AI 老师看的纯文字版结果
  const resultText = (() => {
    if (!result) return '';
    if (result.timedOut) return '运行超时：' + (result.error?.friendly ?? '');
    if (result.error) return '运行报错：' + result.error.friendly + '\n原始报错：' + result.error.type + ': ' + result.error.message;
    const parts: string[] = [];
    parts.push('输出：\n' + (result.stdout?.trim() || '（没有输出）'));
    if (result.tests.length) {
      for (const t of result.tests) parts.push((t.passed ? '✓ ' : '✗ ') + t.name + (t.passed ? '' : (t.detail ? ' —— ' + t.detail : '')));
    }
    if (result.notes && result.notes.length) for (const n of result.notes) parts.push("💡 " + n);
    return parts.join('\n');
  })();

  return (
    <>
      <div className="wrap">
        <div className="lesson">
          {/* 左：讲解 */}
          <div className="left">
            <div className="kicker">
              <span className="tag">{region?.name ?? ''}</span>
              <span className={`tag${lesson.boss ? ' boss' : ''}`}>{lesson.boss ? '🏆 BOSS' : TYPE_LABEL[lesson.type]}</span>
              <span className="tag">{lesson.xp} XP</span>
              {card && <span className={`cardchip ${card}`}>{card === 'gold' ? '金卡' : card === 'silver' ? '银卡' : '灰卡'}</span>}
            </div>
            <h2 className="ltitle">{lesson.title}</h2>

            <Blocks blocks={lesson.content} />

            {/* 开工前先看：系统已经替你准备了什么 —— 免得把"给你的"当成"要自己写的" */}
            <div className="prep">
              <div className="prep-h">📦 已经给你准备好</div>
              <div className="prep-item">
                <b>编辑器里的起手代码</b>（已经写好了，不用重敲）：
                <pre className="prep-code">{lesson.exercise.starterCode.trim() || '（空白，从零写起）'}</pre>
              </div>
              {lesson.exercise.stdin != null && (
                <div className="prep-item">
                  <b>运行时的自动输入</b>：点「运行 / 提交」时，<code>input()</code> 会自动收到
                  <code className="prep-val">{lesson.exercise.stdin}</code>
                  —— 这个值<b>不用你自己写</b>，你只要把它接住、接着往下处理。
                </div>
              )}
              <div className="prep-item">
                <b>你要补的</b>：
                {lesson.type === 'debug'
                  ? '把起手代码里出错的地方改掉。'
                  : '在起手代码的基础上，把「你的任务」要求的东西补出来。'}
              </div>
            </div>
          </div>

          {/* 右：编辑器 + 终端 */}
          <div className="right">
            <div className="editorwrap">
              <CodeEditor value={code} onChange={setCode} height={340} />
            </div>
            <div className="toolbar">
              <button className="btn ghost sm" style={{ marginRight: 'auto' }}
                      onClick={() => setCode('')} disabled={!!busy}>
                清空
              </button>
              <button className="btn ghost sm" style={{ marginRight: 'auto' }}
                      onClick={() => setCode(lesson.exercise.starterCode)} disabled={!!busy}>
                重置
              </button>
              <button className="btn ghost" onClick={() => run()} disabled={!!busy}>
                {busy === 'run' ? '运行中…' : '▶ 运行'}
              </button>
              <button className="btn primary" onClick={() => submit()} disabled={!!busy}>
                {busy === 'submit' ? '判分中…' : '✓ 提交'}
              </button>
            </div>

            <div className="term" style={{ marginTop: 12 }}>
              {!result && <span className="hint">点「运行」看看结果 —— 运行是免费的，随便试。</span>}
              {lesson.exercise.stdin != null && (
                <div className="hint" style={{ marginTop: result ? 8 : 0 }}>
                  ▸ 这一关用了 input()：真实程序跑到这里会停下来等你打字；这里系统会自动替你输入「{lesson.exercise.stdin}」，所以你不用手动敲。
                </div>
              )}
              {stages}
              {result && result.tests.length > 0 && (
                <div className="tests">
                  {result.tests.map((t, i) => (
                    <div className="test" key={i}>
                      <span className="flag" style={{ color: t.passed ? 'var(--green)' : 'var(--red)' }}>
                        {t.passed ? '✓' : '✗'}
                      </span>
                      <span>
                        {t.name}
                        {!t.passed && t.detail && <><br /><span className="err">{t.detail}</span></>}
                      </span>
                    </div>
                  ))}
                  {result.ok && result.tests.every((t) => t.passed) && (
                    <div className="ok" style={{ marginTop: 8 }}>🎉 全部通过 · {result.ms} ms</div>
                  )}
                </div>
              )}
              {result && result.notes && result.notes.length > 0 && (
                <div className="notes">
                  {result.notes.map((n, i) => <div key={i} className="note">💡 {n}</div>)}
                </div>
              )}
              {result?.fatal && <div className="err">{result.fatal}</div>}
            </div>
            <div className={'taskbubble' + (taskOpen ? ' open' : '')}>
              <button className="taskbubble-btn" onClick={() => setTaskOpen((v) => !v)}>
                <span className="taskbubble-title">📋 你的任务</span>
                <span className="taskbubble-arrow">{taskOpen ? '收起 ▴' : '点开看要求 ▾'}</span>
              </button>
              {taskOpen && (
                <div className="exercise taskbubble-body">
                  <div className="prompt">{lesson.exercise.prompt}</div>
                  {bugSpot && bugAt >= 0 && (
                    <div className="bugwrap">
                      <div className="bugcode">{lesson.exercise.starterCode.slice(0, bugAt)}<span className="bugspot">{bugSpot.at}</span>{lesson.exercise.starterCode.slice(bugAt + bugSpot.at.length)}</div>
                      <div className="bugnote">↑ {bugSpot.note}</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="helper">
              <button className="btn ghost sm" onClick={revealHint} disabled={hintCount >= lesson.exercise.hints.length}>
                💡 提示（{hintCount}/{lesson.exercise.hints.length}）
              </button>
              <button className="btn ghost sm" onClick={revealAnswer} disabled={answerOpen}>
                🔓 查看答案
              </button>
              {lesson.exercise.bonus && (
                <button className="btn ghost sm" onClick={() => setBonusOpen(!bonusOpen)}>
                  ⭐ 进阶挑战
                </button>
              )}
            </div>

            {hintCount > 0 && (
              <div className="hintbox">
                <div className="h">提示</div>
                {lesson.exercise.hints.slice(0, hintCount).map((h, i) => (
                  <div key={i} style={{ marginBottom: 6 }}>{i + 1}. {h}</div>
                ))}
              </div>
            )}

            {answerOpen && (
              <div className="hintbox answerbox">
                <div className="h">参考解</div>
                <div className="mono" style={{ whiteSpace: 'pre-wrap' }}>{lesson.exercise.solution}</div>
                {lesson.exercise.altSolution && (
                  <div className="altsol">
                    <div className="h">{lesson.exercise.altSolution.label}</div>
                    <div className="mono" style={{ whiteSpace: 'pre-wrap' }}>{lesson.exercise.altSolution.code}</div>
                  </div>
                )}
                <div style={{ marginTop: 10 }}>
                  <button className="btn ghost sm" onClick={() => setCode(lesson.exercise.solution)}>把答案放进编辑器</button>
                </div>
              </div>
            )}

            {bonusOpen && lesson.exercise.bonus && (
              <div className="exercise" style={{ borderColor: 'var(--yellow)' }}>
                <h3 style={{ color: 'var(--yellow)' }}>⭐ 进阶挑战</h3>
                <div className="prompt">{lesson.exercise.bonus.prompt}</div>
                <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                  <button className="btn ghost sm" onClick={() => setCode(lesson.exercise.bonus!.starterCode)}>用它替换编辑器内容</button>
                  <button className="btn warn sm" onClick={() => submit(true)} disabled={!!busy}>提交进阶题</button>
                </div>
              </div>
            )}
          </div>

          {/* AI 老师：右侧聊天栏 */}
          <div className="ai">
            <AiTeacher
              lessonId={lesson.id}
              lessonTitle={lesson.title}
              lessonOrder={lesson.order}
              prompt={lesson.exercise.prompt}
              starterCode={lesson.exercise.starterCode}
              code={code}
              resultText={resultText}
            />
          </div>
        </div>
      </div>

      <div className="bottom">
        <div className="name">
          <span className="pz">{lesson.title}</span>
          <span className="xp">{lesson.xp} XP</span>
          <span className="tip">第 {lesson.order} / {TOTAL_LESSONS} 关</span>
        </div>
        <div className="navbtns">
          {clearedLessons.length > 0 && (
            <label className="lselect">
              <span>已通关</span>
              <select value={onClearedLesson ? lesson.id : ''}
                      onChange={(e) => e.target.value && go(`/lesson/${e.target.value}`)}>
                {!onClearedLesson && <option value="" disabled>选一关复习…</option>}
                {clearedLessons.map((l) => (
                  <option key={l.id} value={l.id}>{`第 ${l.order} 关 · ${l.title}`}</option>
                ))}
              </select>
            </label>
          )}
          <button className="btn ghost" disabled={!prev} onClick={() => prev && go(`/lesson/${prev.id}`)}>← 上一关</button>
          <button className="btn ghost" onClick={() => go(region ? `/region/${region.id}` : '/')}>返回</button>
          {lesson.order === TOTAL_LESSONS && passed && (
            <button className="btn warn" onClick={() => go('/studio')}>🔧 毕业设计</button>
          )}
          <button className="btn warn" disabled={!next || !passed} onClick={() => next && go(`/lesson/${next.id}`)}>
            下一关 →
          </button>
        </div>
      </div>

      {!unlocked && (
        <div className="wrap" style={{ paddingTop: 0 }}>
          <div className="empty">这一关还没解锁 —— 先做完前面的关卡。</div>
        </div>
      )}

      <div className="toasts">
        {toasts.map((t) => (
          <div className={`toast ${t.kind}`} key={t.id}>
            <div style={{ fontSize: 20 }}>{t.kind === 'xp' ? '⭐' : '🎉'}</div>
            <div><b>{t.title}</b><span>{t.text}</span></div>
          </div>
        ))}
      </div>
    </>
  );
}

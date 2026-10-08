import { useMemo, useState } from 'react';
import { regionById, lessonsOfRegion } from '../content';
import { extraOf } from '../content/exams';
import { Judge, type JudgeResult } from '../runtime/judge';
import { CodeEditor } from '../ui/CodeEditor';
import { Card } from '../ui/Frame';
import { useProgress, isDone, actions } from '../state/progress';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

/** 区域综合考题页：选择题 + 一道编程大题，全对才算过 */
export function RegionExamPage({ id, go }: { id: string; go: (to: string) => void }) {
  const region = regionById(id);
  const progress = useProgress();
  const judge = useMemo(() => new Judge(), []);
  const extra = extraOf(id);

  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [code, setCode] = useState(() => extra?.coding.starterCode ?? '');
  const [result, setResult] = useState<JudgeResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [graded, setGraded] = useState(false);

  if (!region) {
    return <div className="wrap"><div className="col"><Card title="找不到这个区域"><div className="empty">区域 id：{id}</div></Card></div></div>;
  }

  const lessons = lessonsOfRegion(region.id);
  const allDone = lessons.length > 0 && lessons.every((l) => isDone(progress, l.id));

  if (!allDone || !extra) {
    return (
      <div className="wrap"><div className="col">
        <h1 className="title">{region.name} · 综合考题</h1>
        <Card title="还没解锁">
          <div className="empty">
            先把「{region.name}」的 {lessons.length} 关全部通关，才能来考试。<br />
            你已经完成 {lessons.filter((l) => isDone(progress, l.id)).length} / {lessons.length} 关。
          </div>
          <div style={{ marginTop: 12 }}>
            <button className="btn ghost sm" onClick={() => go(`/region/${region.id}`)}>← 回到 {region.name}</button>
          </div>
        </Card>
      </div></div>
    );
  }

  const quiz = extra.quiz;
  const correctCount = quiz.filter((q, i) => answers[i] === q.answer).length;
  const codingPassed = !!(result && result.ok && result.tests.length > 0 && result.tests.every((t) => t.passed));
  const passed = graded && correctCount === quiz.length && codingPassed;

  async function submitExam() {
    if (busy || graded) return;
    setBusy(true);
    const r = await judge.run(code, {
      stdin: extra!.coding.stdin,
      tests: extra!.coding.tests,
      requires: extra!.coding.requires,
    });
    setResult(r);
    const codingOk = r.ok && r.tests.length > 0 && r.tests.every((t) => t.passed);
    const rightN = quiz.filter((q, i) => answers[i] === q.answer).length;
    const isPass = codingOk && rightN === quiz.length;
    setBusy(false);
    setGraded(true);
    actions.markExam(region!.id, rightN / quiz.length, isPass);
  }

  function retry() {
    setAnswers({});
    setResult(null);
    setGraded(false);
  }

  return (
    <div className="wrap">
      <div className="col">
        <div className="kicker">
          <span className="tag">{region.name}</span>
          <span className="tag boss">综合考题</span>
        </div>
        <h1 className="title">{region.name} · 综合考题</h1>
        <div className="sub">选择题 {quiz.length} 道 + 编程大题 1 道。全对才算通过。</div>

        {graded && (
          <div className={'exam-result ' + (passed ? 'pass' : 'fail')}>
            <div style={{ fontSize: 22 }}>{passed ? '🎉' : '💪'}</div>
            <div>
              <b>{passed ? '通过了！这一区你拿下了。' : '还差一点，看看下面的讲解再来一遍。'}</b>
              <div style={{ marginTop: 4, fontSize: 13 }}>
                选择题 {correctCount} / {quiz.length} · 编程大题 {codingPassed ? '通过' : '未通过'}
              </div>
            </div>
          </div>
        )}

        <Card title={`一、选择题（${quiz.length} 题）`}>
          {quiz.map((q, i) => (
            <div className="q" key={i}>
              <div className="q-q">{i + 1}. {q.q}</div>
              <div className="q-opts">
                {q.options.map((o, j) => {
                  const chosen = answers[i] === j;
                  const cls = ['q-opt'];
                  if (chosen) cls.push('chosen');
                  if (graded) {
                    if (j === q.answer) cls.push('right');
                    else if (chosen) cls.push('wrong');
                  }
                  return (
                    <button key={j} className={cls.join(' ')} disabled={graded}
                            onClick={() => setAnswers((cur) => ({ ...cur, [i]: j }))}>
                      <span className="q-mark">{LETTERS[j]}</span>{o}
                    </button>
                  );
                })}
              </div>
              {graded && (
                <div className={'q-explain ' + (answers[i] === q.answer ? 'ok' : 'bad')}>
                  {answers[i] === q.answer ? '✓ 答对了。' : `✗ 正确答案是 ${LETTERS[q.answer]}。`}{q.explain}
                </div>
              )}
            </div>
          ))}
        </Card>

        <Card title="二、编程大题">
          <div className="prompt">{extra.coding.prompt}</div>
          {extra.coding.stdin != null && (
            <div className="prep-item" style={{ marginTop: 10, fontSize: 13.5, lineHeight: 1.85 }}>
              运行时 <code>input()</code> 会自动收到
              <code className="prep-val">{extra.coding.stdin}</code>，不用你自己写。
            </div>
          )}
          <div style={{ marginTop: 12 }}>
            <CodeEditor value={code} onChange={setCode} height={300} />
          </div>

          <div className="toolbar">
            <button className="btn ghost sm" style={{ marginRight: 'auto' }} disabled={busy || graded}
                    onClick={() => setCode(extra!.coding.starterCode)}>重置</button>
            <button className="btn success" disabled={busy || graded} onClick={submitExam}>
              {busy ? '判分中…' : '📝 交卷'}
            </button>
          </div>

          {result && (
            <div className="term" style={{ marginTop: 12 }}>
              {result.error && <div className="err">✗ {result.error.friendly}</div>}
              {result.timedOut && <div className="warn">⏱ 运行太久了，可能有死循环。</div>}
              {!result.error && !result.timedOut && (
                <div>{result.stdout || <span className="hint">（没有输出）</span>}</div>
              )}
              {result.tests.length > 0 && (
                <div className="tests">
                  {result.tests.map((t, i) => (
                    <div className="test" key={i}>
                      <span className="flag" style={{ color: t.passed ? 'var(--green)' : 'var(--red)' }}>{t.passed ? '✓' : '✗'}</span>
                      <span>{t.name}{!t.passed && t.detail && <><br /><span className="err">{t.detail}</span></>}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>

        <div className="helper">
          {graded && !passed && <button className="btn warn sm" onClick={retry}>重做一遍</button>}
          <button className="btn ghost sm" onClick={() => go(`/region/${region.id}/summary`)}>看知识总结</button>
          <button className="btn ghost sm" onClick={() => go(`/region/${region.id}`)}>← 回到 {region.name}</button>
        </div>

        {passed && (
          <div className="helper">
            <button className="btn primary sm" onClick={() => go('/badges')}>去看看徽章 →</button>
            <button className="btn ghost sm" onClick={() => go('/')}>回到地图</button>
          </div>
        )}
      </div>
    </div>
  );
}

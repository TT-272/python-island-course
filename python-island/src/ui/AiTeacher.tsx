import { useEffect, useMemo, useRef, useState } from 'react';
import { Card } from './Frame';
import { PROVIDERS, streamChat, type ChatMsg } from '../ai/deepseek';
import { useAiSettings } from '../ai/settings';

type Props = {
  lessonId: string;
  lessonTitle: string;
  lessonOrder: number;
  prompt: string;
  starterCode: string;
  code: string;
  /** 最近一次运行/判分的结果文字；没跑过就传空串 */
  resultText: string;
};

const SYSTEM = [
  '你是「Python 岛」这款 Python 闯关学习游戏里的 AI 老师，服务对象是中文的编程初学者。',
  '风格要求：',
  '- 用亲切、口语化的中文，像朋友一样，别端着。',
  '- 一次只讲一个重点，尽量短（一般不超过 6 行），不要长篇大论。',
  '- 多用比喻、分步骤讲。',
  '- 学生没明确要答案时，先给提示、引导他自己想；如果他已经卡了很久或直接要答案，再给代码并逐行解释。',
  '- 学生程序报错时，先说清「错在哪一行、为什么」，再给修改方向。',
].join('\n');

/** 「只给提示」模式追加的规则 */
const HINT_ONLY_RULE = '\n【当前是「只给提示」模式】不要直接给出完整代码或最终答案，只给方向、思路和引导性的问题，让学生自己写出来。只有当学生明确说「直接给我答案」时才例外。';

let msgSeq = 0;
type Msg = ChatMsg & { id: number };

export function AiTeacher(props: Props) {
  const [settings, setSettings] = useAiSettings();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [showSettings, setShowSettings] = useState(() => !settings.apiKey);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // 换关卡就清空对话，避免上一关的聊天串进来
  useEffect(() => {
    setMsgs([]);
    setError('');
  }, [props.lessonId]);

  // 有新消息就自动滚到底
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs]);

  // 这一关的上下文，每次提问都带给老师
  const context = useMemo(() => [
    '【当前关卡】' + props.lessonTitle + '（第 ' + props.lessonOrder + ' 关）',
    '【这一关的任务】\n' + props.prompt,
    '【起手代码】\n' + (props.starterCode || '(空)'),
    '【学生现在编辑器里的代码】\n' + (props.code.trim() || '(还没写)'),
    '【最近一次运行/判分结果】\n' + (props.resultText || '(还没运行过)'),
  ].join('\n\n'), [props.lessonTitle, props.lessonOrder, props.prompt, props.starterCode, props.code, props.resultText]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    if (!settings.apiKey) {
      setShowSettings(true);
      setError('先在设置里填一个 API Key，AI 老师才能说话。');
      return;
    }
    const userMsg: Msg = { id: ++msgSeq, role: 'user', content: q };
    const aiMsg: Msg = { id: ++msgSeq, role: 'assistant', content: '' };
    const history = [...msgs, userMsg];
    setMsgs([...history, aiMsg]);
    setInput('');
    setError('');
    setBusy(true);

    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const payload: ChatMsg[] = [
        { role: 'system', content: SYSTEM + (settings.hintOnly ? HINT_ONLY_RULE : '') },
        { role: 'system', content: context },
        ...history.map(({ role, content }) => ({ role, content })),
      ];
      await streamChat(settings, payload, (t) => {
        setMsgs((cur) => {
          const next = cur.slice();
          const last = next[next.length - 1];
          next[next.length - 1] = { ...last, content: last.content + t };
          return next;
        });
      }, ctrl.signal);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      // 一个字都没冒出来的空气泡，去掉
      setMsgs((cur) => {
        const last = cur[cur.length - 1];
        return last && last.role === 'assistant' && !last.content ? cur.slice(0, -1) : cur;
      });
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  }

  const headerRight = (
    <span className="ai-hdbtns">
      <button className="ai-icon" title="设置" onClick={() => setShowSettings((v) => !v)}>⚙️</button>
      <button className="ai-icon" title="清空对话" onClick={() => { setMsgs([]); setError(''); }}>🧹</button>
    </span>
  );

  return (
    <Card title="🤖 AI 老师" right={headerRight}>
      {showSettings ? (
        <div className="ai-settings">
          <div className="ai-presets">
            {PROVIDERS.map((p) => (
              <button key={p.id} className="btn ghost sm"
                      onClick={() => setSettings({ ...settings, baseUrl: p.baseUrl, model: p.model })}>
                {p.label}
              </button>
            ))}
          </div>
          <label className="ai-field">
            <span>接口地址</span>
            <input value={settings.baseUrl} onChange={(e) => setSettings({ ...settings, baseUrl: e.target.value })} />
          </label>
          <label className="ai-field">
            <span>模型</span>
            <input value={settings.model} onChange={(e) => setSettings({ ...settings, model: e.target.value })} />
          </label>
          <label className="ai-field">
            <span>API Key</span>
            <input type="password" placeholder="sk-..." value={settings.apiKey}
                   onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })} />
          </label>
          <div className="ai-save">
            <button className="btn success sm" disabled={!settings.apiKey}
                    onClick={() => { setError(''); setShowSettings(false); }}>
              保存，开始提问
            </button>
          </div>
          <div className="ai-note">
            记录只存在你这台电脑的浏览器里。DeepSeek 最便宜的模型是 deepseek-chat，充几块钱能用很久。
          </div>
          {error && <div className="ai-err">{error}</div>}
        </div>
      ) : (
        <div className="ai">
          <div className="ai-msgs" ref={scrollRef}>
            {msgs.length === 0 && (
              <div className="ai-empty">卡住了就问我 —— 我看得到这一关的题目和你写的代码。</div>
            )}
            {msgs.map((m) => (
              <div key={m.id} className={'ai-msg ' + m.role}>
                {m.role === 'assistant' && <div className="ai-who">老师</div>}
                <div className="ai-bubble">{m.content || (busy ? '…' : '')}</div>
              </div>
            ))}
            {error && <div className="ai-err">{error}</div>}
          </div>

          <div className="ai-quick">
            <button className="btn ghost sm" disabled={busy}
                    onClick={() => send('用初学者能懂的话，讲讲这一关到底在教我什么。')}>这一关讲什么？</button>
            <button className="btn ghost sm" disabled={busy}
                    onClick={() => send('看看我现在写的代码，有没有问题？先别直接给答案，提示我一下。')}>帮我看看代码</button>
            <button className={'btn sm ' + (settings.hintOnly ? 'warn' : 'ghost')}
                    title="开启后，老师只给提示，不直接给答案"
                    onClick={() => setSettings({ ...settings, hintOnly: !settings.hintOnly })}>
              {settings.hintOnly ? '🫣 只给提示：开' : '🫣 只给提示：关'}
            </button>
          </div>

          <div className="ai-input">
            <textarea value={input} placeholder="有什么不懂的，问我…（回车发送，Shift+回车换行）"
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); }
                      }} />
            {busy
              ? <button className="btn danger sm" onClick={() => abortRef.current?.abort()}>停</button>
              : <button className="btn primary sm" onClick={() => send(input)} disabled={!input.trim()}>发送</button>}
          </div>
        </div>
      )}
    </Card>
  );
}

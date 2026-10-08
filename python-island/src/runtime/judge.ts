// 判题引擎（主线程侧）：超时、worker 重启、把 Python 报错翻译成人话
export type TestSpec = { name: string; code: string };
export type TestResult = { name: string; passed: boolean; detail: string };
export type PyError = { type: string; message: string; line?: number | null };

export type JudgeResult = {
  ok: boolean;                 // 代码跑通了（不代表测试全过）
  stdout: string;
  ms: number;
  tests: TestResult[];
  error?: { type: string; message: string; line?: number | null; friendly: string };
  timedOut?: boolean;
  fatal?: string;
  /** 软提示：不判失败，只给「建议用某写法」之类的提醒 */
  notes?: string[];
};

export type RunOptions = {
  stdin?: string;
  tests?: TestSpec[];
  /** AST 结构要求：学员代码必须真的用到这些构造（if/for/while/def/input/dict/list/random） */
  requires?: string[];
  /** 软检查：不通过只出提示、不判失败 */
  softChecks?: TestSpec[];
  timeoutMs?: number;          // 单次运行上限，默认 6000ms
};

export type JudgeStatus = 'loading' | 'ready' | 'failed';

/* ---------- Python 报错 → 中文人话 ---------- */
export function translateError(e: PyError): string {
  const pre = e.line ? `第 ${e.line} 行：` : '';
  const msg = e.message || '';
  switch (e.type) {
    case 'SyntaxError':
      if (/was never closed|unmatched/i.test(msg))
        return `${pre}括号没有闭合。检查一下 ( ) [ ] { } 是不是成对的。`;
      if (/EOL while scanning|unterminated string/i.test(msg))
        return `${pre}字符串的引号没闭合。检查单引号和双引号是不是成对的。`;
      if (/expected ':'/i.test(msg))
        return `${pre}这一行末尾少了冒号 :`;
      if (/unexpected indent/i.test(msg))
        return `${pre}缩进多了。同一层的代码缩进要一致。`;
      if (/invalid syntax/i.test(msg))
        return `${pre}语法写错了。常见原因：漏冒号、括号不配对、关键字拼错。`;
      return `${pre}语法错误：${msg}`;
    case 'IndentationError':
      if (/expected an indented block/i.test(msg))
        return `${pre}这一行后面应该跟一段缩进的代码。`;
      if (/unexpected indent/i.test(msg))
        return `${pre}缩进多了。`;
      return `${pre}缩进不对。Python 靠缩进判断代码块，同一块要用一样的空格数。`;
    case 'TabError':
      return `${pre}空格和 Tab 混用了。统一用一种。`;
    case 'NameError': {
      const m = msg.match(/name '([^']+)' is not defined/);
      if (m) return `${pre}Python 找不到叫 ${m[1]} 的东西。可能是变量名拼错了，或者还没赋值就用了。`;
      return `${pre}用了一个还不存在的变量。`;
    }
    case 'TypeError':
      if (/can only concatenate str/i.test(msg))
        return `${pre}字符串不能直接和数字相加。用 str(数字) 转换，或者改用 f-string。`;
      if (/unsupported operand type/i.test(msg))
        return `${pre}这两种类型不能这样运算。检查是不是把文字和数字混在一起了。`;
      if (/missing .* required positional argument/i.test(msg))
        return `${pre}调用函数时少传了参数。`;
      if (/not callable/i.test(msg))
        return `${pre}你调用了一个不是函数的东西。`;
      return `${pre}类型不对：${msg}`;
    case 'ZeroDivisionError': return `${pre}不能除以 0。`;
    case 'IndexError':        return `${pre}下标超出范围了。列表或字符串没有那么多项。`;
    case 'KeyError':          return `${pre}字典里没有这个键。`;
    case 'ValueError':
      if (/invalid literal for int/i.test(msg))
        return `${pre}int() 转不了这段文字。确认输入的是不是纯数字。`;
      return `${pre}值不对：${msg}`;
    case 'AttributeError':    return `${pre}这个对象没有你写的这个方法或属性。检查拼写。`;
    case 'UnboundLocalError': return `${pre}函数里先用后赋值了同名变量。`;
    case 'RecursionError':    return `${pre}递归太深了。检查函数有没有能停下来的条件。`;
    case 'ModuleNotFoundError': return `${pre}找不到这个模块。`;
    default:                  return `${pre}${e.type}: ${msg}`;
  }
}

/* ---------- 引擎 ---------- */
export class Judge {
  private worker: Worker | null = null;
  private seq = 0;
  private pending = new Map<number, { resolve: (r: any) => void; timer: number }>();
  private readyResolve: (() => void) | null = null;
  private readyReject: ((e: Error) => void) | null = null;
  private readyPromise: Promise<void>;
  private _status: JudgeStatus = 'loading';
  private _statusListeners = new Set<(s: JudgeStatus, msg?: string) => void>();

  constructor() {
    this.readyPromise = new Promise<void>((res, rej) => {
      this.readyResolve = res;
      this.readyReject = rej;
    });
    this.readyPromise.catch(() => { /* 由 status 监听器负责呈现，避免 unhandled */ });
    this.spawn();
  }

  get status(): JudgeStatus { return this._status; }

  onStatus(fn: (s: JudgeStatus, msg?: string) => void): () => void {
    this._statusListeners.add(fn);
    return () => this._statusListeners.delete(fn);
  }

  private setStatus(s: JudgeStatus, msg?: string) {
    this._status = s;
    this._statusListeners.forEach((f) => f(s, msg));
  }

  private spawn() {
    const w = new Worker(new URL('./pyodide.worker.ts', import.meta.url), { type: 'module' });

    w.onmessage = (ev: MessageEvent<any>) => {
      const d = ev.data;

      // 预热结果 —— 失败必须暴露出来，否则页面永远卡在"加载中"
      if (d.id === -1) {
        if (d.ready) {
          this.setStatus('ready');
          this.readyResolve?.();
        } else {
          const msg = String(d.fatal ?? '未知错误');
          this.setStatus('failed', msg);
          this.readyReject?.(new Error(msg));
        }
        return;
      }

      const p = this.pending.get(d.id);
      if (!p) return;
      clearTimeout(p.timer);
      this.pending.delete(d.id);
      p.resolve(d);
    };

    w.onerror = (e) => {
      this.setStatus('failed', `worker 启动失败：${e.message ?? ''}`);
    };

    this.worker = w;
  }

  /** 等 Pyodide 就绪（首次约 2-5 秒，之后瞬时） */
  ready(): Promise<void> { return this.readyPromise; }

  async run(code: string, opts: RunOptions = {}): Promise<JudgeResult> {
    const timeoutMs = opts.timeoutMs ?? 6000;

    // 引擎没起来就别往下走，直接报清楚
    try {
      await this.ready();
    } catch {
      return {
        ok: false, stdout: '', ms: 0, tests: [],
        fatal: 'Python 引擎没能启动。刷新页面重试；如果一直失败，说明 /pyodide 下的运行时文件没加载成功。',
      };
    }

    const id = ++this.seq;
    return new Promise<JudgeResult>((resolve) => {
      const timer = window.setTimeout(() => {
        // 死循环只能终止 worker，再起一个新的
        this.pending.delete(id);
        this.worker?.terminate();
        this.readyPromise = new Promise<void>((res, rej) => {
          this.readyResolve = res;
          this.readyReject = rej;
        });
        this.readyPromise.catch(() => {});
        this.setStatus('loading');
        this.spawn();
        resolve({
          ok: false, timedOut: true, stdout: '', ms: timeoutMs, tests: [],
          error: {
            type: 'Timeout', message: '', line: null,
            friendly: `程序运行超过 ${(timeoutMs / 1000).toFixed(0)} 秒被中断了。检查一下 while 循环的条件有没有机会变成 False。`,
          },
        });
      }, timeoutMs);

      this.pending.set(id, { resolve, timer });
      this.worker!.postMessage({ id, code, stdin: opts.stdin ?? '', tests: opts.tests ?? [], requires: opts.requires ?? [], softChecks: opts.softChecks ?? [] });
    }).then((raw: any) => {
      if (!raw || raw.fatal) {
        return { ok: false, stdout: '', ms: 0, tests: [], fatal: raw?.fatal ?? '引擎异常' } as JudgeResult;
      }
      const res: JudgeResult = {
        ok: !raw.error,
        stdout: raw.stdout ?? '',
        ms: raw.ms ?? 0,
        tests: raw.tests ?? [],
        notes: raw.notes ?? [],
      };
      if (raw.error) {
        // Timeout 的文案在超时分支里已经写好了，别被 translateError 覆盖
        const friendly = raw.error.type === 'Timeout'
          ? raw.error.friendly
          : translateError(raw.error);
        res.error = { ...raw.error, friendly };
      }
      return res;
    });
  }
}

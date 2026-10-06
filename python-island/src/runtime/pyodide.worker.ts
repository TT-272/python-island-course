/// <reference lib="webworker" />
// 判题 worker：Pyodide 在这里跑，主线程负责超时和重启
import { loadPyodide } from 'pyodide';
import runnerSource from './runner.py?raw';

type Req = {
  id: number;
  code: string;
  stdin?: string;
  tests?: { name: string; code: string }[];
  requires?: string[];
};

let pyodide: any = null;
let loading: Promise<any> | null = null;

async function boot() {
  if (pyodide) return pyodide;
  if (!loading) {
    loading = (async () => {
      // 从 node_modules 正常导入，让 Vite 打包 loader；
      // wasm / stdlib 是运行时 fetch。用 BASE_URL 拼，部署到子路径下才不会 404
      const py = await loadPyodide({ indexURL: `${import.meta.env.BASE_URL}pyodide/` });
      py.runPython(runnerSource);
      return py;
    })();
  }
  return loading;
}

self.onmessage = async (ev: MessageEvent<Req>) => {
  const { id, code, stdin, tests, requires } = ev.data;
  const t0 = performance.now();
  try {
    const py = await boot();
    const run = py.globals.get('_run');
    const json = run(code, stdin ?? '', py.toPy(tests ?? []), py.toPy(requires ?? []));
    run.destroy?.();
    const result = JSON.parse(json);
    (self as any).postMessage({
      id,
      ok: true,
      ...result,
      bootMs: Math.round(performance.now() - t0) - result.ms,
    });
  } catch (e: any) {
    (self as any).postMessage({
      id,
      ok: false,
      fatal: String(e?.message ?? e),
    });
  }
};

// 预热：页面一打开就开始加载 Pyodide，学员读完讲解时它已经就绪
boot().then(() => (self as any).postMessage({ id: -1, ready: true }))
      .catch((e) => (self as any).postMessage({ id: -1, ready: false, fatal: String(e) }));

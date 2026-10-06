// 把 Pyodide 运行时从 node_modules 复制到 public/pyodide/
// 目的：仓库里不用存 13MB 的 wasm + 标准库，npm install 之后自动生成。
import { cpSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const src = join(root, 'node_modules', 'pyodide');
const dst = join(root, 'public', 'pyodide');

if (!existsSync(src)) {
  console.warn('[pyodide] 没找到 node_modules/pyodide，跳过复制');
  process.exit(0);
}

cpSync(src, dst, { recursive: true });
console.log('[pyodide] 运行时已复制到 public/pyodide/');
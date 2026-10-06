import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // 部署到 GitHub Pages 时站点在 /python-island-course/ 子路径下；
  // 本地开发保持根路径，否则 http://127.0.0.1:5173/ 会 404。
  base: mode === 'production' ? '/python-island-course/' : '/',
  server: { host: '127.0.0.1', port: 5173 },
  worker: { format: 'es' },
  // Pyodide 的 wasm 很大，不参与依赖预构建
  optimizeDeps: { exclude: ['pyodide'] },
  build: { chunkSizeWarningLimit: 4000 },
}));

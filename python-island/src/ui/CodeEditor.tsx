import { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';
import EditorWorker from 'monaco-editor/editor/editor.worker.js?worker';

// Monaco 需要一个 worker；我们只用语法高亮，基础 worker 足够
(self as any).MonacoEnvironment = {
  getWorker: () => new EditorWorker(),
};

let themeReady = false;
function ensureTheme() {
  if (themeReady) return;
  themeReady = true;
  monaco.editor.defineTheme('python-island', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '5d6b7d', fontStyle: 'italic' },
      { token: 'string', foreground: 'a5d6ff' },
      { token: 'keyword', foreground: 'ff7b72' },
      { token: 'number', foreground: 'ffd75f' },
      { token: 'identifier', foreground: 'd6e2f0' },
      { token: 'type', foreground: 'd2a8ff' },
    ],
    colors: {
      'editor.background': '#0a0f16',
      'editor.foreground': '#d6e2f0',
      'editorLineNumber.foreground': '#465269',
      'editorLineNumber.activeForeground': '#8fd0ff',
      'editor.selectionBackground': '#1d3a5c',
      'editor.lineHighlightBackground': '#111823',
      'editorCursor.foreground': '#8fd0ff',
      'editorIndentGuide.background1': '#1d2530',
    },
  });
}

export function CodeEditor({
  value, onChange, height = 340, readOnly,
}: { value: string; onChange: (v: string) => void; height?: number; readOnly?: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const ed = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!host.current) return;
    ensureTheme();
    const editor = monaco.editor.create(host.current, {
      value,
      language: 'python',
      theme: 'python-island',
      fontFamily: '"Hack", Consolas, "Courier New", monospace',
      fontSize: 14,
      lineHeight: 24,
      tabSize: 4,
      insertSpaces: true,
      detectIndentation: false,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      renderLineHighlight: 'line',
      smoothScrolling: false,
      automaticLayout: true,
      padding: { top: 12, bottom: 12 },
      readOnly,
      wordWrap: 'on',
    });
    ed.current = editor;
    // 光标落在文档末尾 —— 学员点进去就能直接往下写，不用先挪光标
    const model = editor.getModel();
    if (model) {
      const last = model.getLineCount();
      editor.setPosition({ lineNumber: last, column: model.getLineMaxColumn(last) });
    }
    const sub = editor.onDidChangeModelContent(() => onChangeRef.current(editor.getValue()));
    return () => { sub.dispose(); editor.dispose(); ed.current = null; };
    // 只在挂载时创建
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 外部改值（切关卡、重置、看答案）时同步进去
  useEffect(() => {
    const editor = ed.current;
    if (!editor) return;
    if (editor.getValue() === value) return;
    editor.setValue(value);
    // 换了内容就把光标送回末尾，别让学员先删掉注释才能写
    const model = editor.getModel();
    if (model) {
      const last = model.getLineCount();
      editor.setPosition({ lineNumber: last, column: model.getLineMaxColumn(last) });
    }
  }, [value]);

  useEffect(() => {
    ed.current?.updateOptions({ readOnly });
  }, [readOnly]);

  return <div className="editor" ref={host} style={{ height }} />;
}

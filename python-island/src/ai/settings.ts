// AI 老师的设置（API Key、模型等）存在浏览器本地，填一次以后不用再填。
import { useEffect, useState } from 'react';
import { DEFAULT_SETTINGS, type AiSettings } from './deepseek';

const STORAGE_KEY = 'python-island.ai.settings.v1';

export function loadAiSettings(): AiSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw) as Partial<AiSettings>;
    return {
      baseUrl: parsed.baseUrl || DEFAULT_SETTINGS.baseUrl,
      apiKey: parsed.apiKey || '',
      model: parsed.model || DEFAULT_SETTINGS.model,
      hintOnly: parsed.hintOnly === true,
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveAiSettings(s: AiSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    // 隐私模式下可能写不进去，忽略即可
  }
}

/** 读设置 + 改设置，改动自动落盘。 */
export function useAiSettings(): [AiSettings, (s: AiSettings) => void] {
  const [settings, setSettings] = useState<AiSettings>(loadAiSettings);
  useEffect(() => {
    saveAiSettings(settings);
  }, [settings]);
  return [settings, setSettings];
}

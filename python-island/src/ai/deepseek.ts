// DeepSeek / 通用 OpenAI 兼容接口的最小客户端。
// DeepSeek 的接口地址和 OpenAI 一致（/chat/completions），所以同一个实现能兼容多家。

export type AiSettings = {
  /** 接口根地址，例如 https://api.deepseek.com */
  baseUrl: string;
  /** API Key，形如 sk-xxxx */
  apiKey: string;
  /** 模型名，例如 deepseek-chat */
  model: string;
  /** 开启后，老师只给提示、不直接给答案 */
  hintOnly: boolean;
};

export type ChatMsg = { role: 'system' | 'user' | 'assistant'; content: string };

/** 预置服务商。选一个就能自动填好地址和默认模型。 */
export const PROVIDERS = [
  { id: 'deepseek', label: 'DeepSeek', baseUrl: 'https://api.deepseek.com', model: 'deepseek-chat' },
  { id: 'kimi', label: 'Kimi（月之暗面）', baseUrl: 'https://api.moonshot.cn/v1', model: 'moonshot-v1-8k' },
  { id: 'openai', label: 'OpenAI', baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o-mini' },
] as const;

export const DEFAULT_SETTINGS: AiSettings = {
  baseUrl: PROVIDERS[0].baseUrl,
  apiKey: '',
  model: PROVIDERS[0].model,
  hintOnly: false,
};

/**
 * 流式对话：每收到一小段就调用 onDelta，让回答像打字一样一个个字冒出来。
 * 出错时抛出 Error，消息里带上服务端返回的内容，方便排错。
 */
export async function streamChat(
  settings: AiSettings,
  messages: ChatMsg[],
  onDelta: (text: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  const url = settings.baseUrl.replace(/\/+$/, '') + '/chat/completions';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${settings.apiKey}`,
    },
    body: JSON.stringify({
      model: settings.model,
      messages,
      stream: true,
      temperature: 0.3,
    }),
    signal,
  });

  if (!res.ok || !res.body) {
    const detail = await res.text().catch(() => '');
    throw new Error(`请求失败（HTTP ${res.status}）：${detail.slice(0, 400) || res.statusText}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // SSE 按行传，最后一段可能不完整，留在 buffer 里等下一块
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const raw of lines) {
      const line = raw.trim();
      if (!line.startsWith('data:')) continue;
      const data = line.slice(5).trim();
      if (data === '[DONE]') return;
      try {
        const json = JSON.parse(data) as { choices?: { delta?: { content?: string } }[] };
        const delta = json.choices?.[0]?.delta?.content;
        if (delta) onDelta(delta);
      } catch {
        // 心跳行之类，忽略
      }
    }
  }
}

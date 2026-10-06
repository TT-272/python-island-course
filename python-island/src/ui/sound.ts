// 音效用 WebAudio 合成，不引入音频文件
let ctx: AudioContext | null = null;

function ac(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const C = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!C) return null;
    ctx = new C();
  }
  const c = ctx as AudioContext;
  if (c.state === 'suspended') c.resume().catch(() => {});
  return c;
}

function tone(freq: number, dur: number, type: OscillatorType, gain: number, delay = 0) {
  const c = ac();
  if (!c) return;
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

/** 通关：哆-咪-嗖 三连音 */
export function playWin(enabled: boolean) {
  if (!enabled) return;
  tone(784, 0.12, 'square', 0.05, 0);
  tone(988, 0.12, 'square', 0.05, 0.1);
  tone(1319, 0.22, 'square', 0.05, 0.2);
}

/** 出错：短促下滑 */
export function playFail(enabled: boolean) {
  if (!enabled) return;
  tone(220, 0.16, 'sawtooth', 0.04, 0);
  tone(165, 0.2, 'sawtooth', 0.04, 0.12);
}

/** 解锁 / 翻卡 */
export function playClick(enabled: boolean) {
  if (!enabled) return;
  tone(1047, 0.07, 'square', 0.035, 0);
}

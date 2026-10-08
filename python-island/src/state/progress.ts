import { useSyncExternalStore } from 'react';
import { LESSONS, lessonById } from '../content';

export type ExamProgress = {
  passed: boolean;
  /** 选择题答对的比例，0~1 */
  best: number;
};

export type CardTier = 'gold' | 'silver' | 'grey';

export type LessonProgress = {
  done: boolean;
  card: CardTier;
  hintsUsed: number;
  answerSeen: boolean;
  tries: number;
  passedAt?: string;
};

export type Progress = {
  /** 区域综合考题：通过与否 + 历史最好分 */
  exams: Record<string, ExamProgress>;
  v: 1;
  lessons: Record<string, LessonProgress>;
  settings: { sound: boolean };
};

const KEY = 'python-island:progress:v1';

const EMPTY: Progress = { v: 1, lessons: {}, exams: {}, settings: { sound: true } };

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(EMPTY);
    const p = JSON.parse(raw) as Progress;
    if (p?.v !== 1 || typeof p.lessons !== 'object') return structuredClone(EMPTY);
    return { v: 1, lessons: p.lessons ?? {}, exams: p.exams ?? {}, settings: { sound: p.settings?.sound ?? true } };
  } catch {
    return structuredClone(EMPTY);
  }
}

let state: Progress = load();
const listeners = new Set<() => void>();

function commit(next: Progress) {
  state = next;
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* 隐私模式等，忽略 */ }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => { listeners.delete(l); };
}

export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, () => state, () => state);
}

/* ---------- 派生量 ---------- */
export function isDone(p: Progress, id: string): boolean {
  return !!p.lessons[id]?.done;
}

export function xpOf(p: Progress): number {
  return LESSONS.reduce((s, l) => s + (p.lessons[l.id]?.done ? l.xp : 0), 0);
}

/** 看过的提示 / 答案 → 卡片成色。都没碰过 = 金 */
export function tierOf(rec: LessonProgress | undefined): CardTier {
  if (!rec) return 'grey';
  if (rec.answerSeen) return 'grey';
  if (rec.hintsUsed > 0) return 'silver';
  return 'gold';
}

export function blankRec(): LessonProgress {
  return { done: false, card: 'grey', hintsUsed: 0, answerSeen: false, tries: 0 };
}

/* ---------- 操作 ---------- */
export const actions = {
  /** 记录一次提交（通过与否都算一次尝试） */
  recordTry(lessonId: string) {
    const cur = state.lessons[lessonId] ?? blankRec();
    const next = { ...cur, tries: cur.tries + 1 };
    commit({ ...state, lessons: { ...state.lessons, [lessonId]: next } });
  },

  useHint(lessonId: string) {
    const cur = state.lessons[lessonId] ?? blankRec();
    const next = { ...cur, hintsUsed: cur.hintsUsed + 1 };
    commit({ ...state, lessons: { ...state.lessons, [lessonId]: { ...next, card: tierOf(next) } } });
  },

  seeAnswer(lessonId: string) {
    const cur = state.lessons[lessonId] ?? blankRec();
    const next = { ...cur, answerSeen: true };
    commit({ ...state, lessons: { ...state.lessons, [lessonId]: { ...next, card: tierOf(next) } } });
  },

  /** 通关。已通关的关卡重玩不再改 XP，但成色可以变好 */
  markDone(lessonId: string) {
    const cur = state.lessons[lessonId] ?? blankRec();
    if (cur.done) return;
    const next: LessonProgress = {
      ...cur,
      done: true,
      card: tierOf(cur),
      passedAt: new Date().toISOString(),
    };
    commit({ ...state, lessons: { ...state.lessons, [lessonId]: next } });
  },

  /** 记录一次区域考试结果（分数只取更高的一次） */
  markExam(regionId: string, ratio: number, passed: boolean) {
    const cur = state.exams[regionId] ?? { passed: false, best: 0 };
    const next: ExamProgress = { passed: cur.passed || passed, best: Math.max(cur.best, ratio) };
    commit({ ...state, exams: { ...state.exams, [regionId]: next } });
  },

  toggleSound() {
    commit({ ...state, settings: { ...state.settings, sound: !state.settings.sound } });
  },

  resetAll() {
    commit(structuredClone(EMPTY));
  },
};

/* ---------- 便捷读取（非 hook 场景用） ---------- */
export function snapshot(): Progress { return state; }
export function doneCount(p: Progress): number { return LESSONS.filter((l) => isDone(p, l.id)).length; }
export function xpOfLesson(id: string): number { return lessonById(id)?.xp ?? 0; }

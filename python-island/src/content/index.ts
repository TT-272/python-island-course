import type { Lesson, Region } from './types';
import { REGIONS } from './regions';
import { py01 } from './lessons/py-01';
import { py02 } from './lessons/py-02';
import { py03 } from './lessons/py-03';
import { py04 } from './lessons/py-04';import { py05 } from './lessons/py-05';
import { py06 } from './lessons/py-06';
import { py07 } from './lessons/py-07';
import { py08 } from './lessons/py-08';
import { py09 } from './lessons/py-09';
import { py10 } from './lessons/py-10';
import { py11 } from './lessons/py-11';
import { py12 } from './lessons/py-12';
import { py13 } from './lessons/py-13';
import { py14 } from './lessons/py-14';
import { py15 } from './lessons/py-15';
import { py16 } from './lessons/py-16';
import { py17 } from './lessons/py-17';
import { py18 } from './lessons/py-18';
import { py19 } from './lessons/py-19';
import { py20 } from './lessons/py-20';
import { py21 } from './lessons/py-21';
import { py22 } from './lessons/py-22';
import { py23 } from './lessons/py-23';
import { py24 } from './lessons/py-24';
import { py25 } from './lessons/py-25';
import { py26 } from './lessons/py-26';
import { py27 } from './lessons/py-27';
import { py28 } from './lessons/py-28';
import { py29 } from './lessons/py-29';
import { py30 } from './lessons/py-30';
import { py31 } from './lessons/py-31';
import { py32 } from './lessons/py-32';
import { py33 } from './lessons/py-33';
import { py34 } from './lessons/py-34';
import { py35 } from './lessons/py-35';
import { py36 } from './lessons/py-36';
import { py37 } from './lessons/py-37';
import { py38 } from './lessons/py-38';
import { py39 } from './lessons/py-39';
import { py40 } from './lessons/py-40';

export * from './types';
export { REGIONS } from './regions';

/* ---------- 关卡注册表 ---------- */
const ALL: Lesson[] = [
  py01, py02, py03, py04, py05, py06, py07, py08, py09, py10, py11,
  py12, py13, py14, py15, py16, py17, py18, py19,
  py20, py21, py22, py23, py24, py25, py26,
  py27, py28, py29, py30, py31, py32, py33, py34,
  py35, py36, py37, py38, py39, py40,
];

/** 全部已实现的关卡，按 order 排序 */
export const LESSONS: Lesson[] = [...ALL].sort((a, b) => a.order - b.order);

const LESSON_MAP = new Map(LESSONS.map((l) => [l.id, l]));
const REGION_MAP = new Map(REGIONS.map((r) => [r.id, r]));

export function lessonById(id: string): Lesson | undefined { return LESSON_MAP.get(id); }
export function regionById(id: string): Region | undefined { return REGION_MAP.get(id); }
export function regionByLesson(lesson: Lesson): Region | undefined { return REGION_MAP.get(lesson.region); }

/** 某区域「已实现」的关卡 */
export function lessonsOfRegion(regionId: string): Lesson[] {
  return LESSONS.filter((l) => l.region === regionId);
}

/* ---------- 总数（一律从已注册内容算出，不写死） ---------- */
export const TOTAL_LESSONS = LESSONS.length;
export const TOTAL_XP = LESSONS.reduce((s, l) => s + l.xp, 0);
export const TOTAL_BADGES = REGIONS.filter((r) => !r.comingSoon).length;

/* ---------- 等级 ---------- */
// 全季 40 关时：34 普通 × 10 + 6 BOSS × 30 = 520
export const LEVELS = [0, 100, 230, 360, 520];

export function levelOf(xp: number): number {
  let lv = 1;
  for (let i = 1; i < LEVELS.length; i++) if (xp >= LEVELS[i]) lv = i + 1;
  return lv;
}
/** 当前等级进度：{ cur, next, ratio } */
export function levelProgress(xp: number) {
  const lv = levelOf(xp);
  const cur = LEVELS[lv - 1] ?? 0;
  const next = LEVELS[lv] ?? null;
  const ratio = next === null ? 1 : Math.min(1, (xp - cur) / (next - cur));
  return { lv, cur, next, ratio };
}

/* ---------- 解锁规则：全局线性，做完上一关解锁下一关 ---------- */
export function isUnlocked(lessonId: string, isDone: (id: string) => boolean): boolean {
  const idx = LESSONS.findIndex((l) => l.id === lessonId);
  if (idx <= 0) return idx === 0;
  return isDone(LESSONS[idx - 1].id);
}

/** 第一个未通关的关卡（"继续学习"按钮的目标） */
export function nextLesson(isDone: (id: string) => boolean): Lesson | undefined {
  return LESSONS.find((l) => !isDone(l.id)) ?? LESSONS[LESSONS.length - 1];
}

/* ---------- 区域状态 ---------- */
export type RegionState = 'done' | 'now' | 'lock' | 'soon';

export function regionState(region: Region, isDone: (id: string) => boolean): RegionState {
  if (region.comingSoon || region.lessons.length === 0) return 'soon';
  if (region.lessons.every((id) => isDone(id))) return 'done';
  if (region.lessons.some((id) => isDone(id)) || isUnlocked(region.lessons[0], isDone)) return 'now';
  return 'lock';
}

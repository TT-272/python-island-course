export type Block =
  | { t: 'p'; text: string }
  | { t: 'code'; lang: 'python'; code: string; demo?: boolean; demoNote?: string }
  | { t: 'tip'; text: string }
  /** 重点：本关必须记住的知识点 */
  | { t: 'key'; text: string };

export type LessonType = 'guided' | 'fill' | 'predict' | 'debug' | 'scratch' | 'free';

export type TestSpec = { name: string; code: string };

export type BonusExercise = {
  prompt: string;
  starterCode: string;
  tests: TestSpec[];
};

/** 找 bug 关：把起手代码里的坏地方圈出来 */
export type BugSpot = {
  /** 要圈出来的那一段，必须能在 starterCode 里原样找到 */
  at: string;
  /** 圈出来旁边写什么 */
  note: string;
};

export type Exercise = {
  prompt: string;
  starterCode: string;
  stdin?: string;
  /** AST 结构要求：学员代码必须真的用到这些构造才判过（见 runner.py 的白名单） */
  requires?: string[];
  /** 软检查：不通过只给提示、不判失败（适合「建议用某写法」这类引导） */
  softChecks?: TestSpec[];
  tests: TestSpec[];
  hints: string[];
  solution: string;
  /** 同题双版本：另一种写法，展示在参考解下面 */
  altSolution?: { label: string; code: string };
  /** 找 bug 关专用：把坏代码摆到题目旁边并圈出来 */
  bugSpot?: BugSpot;
  bonus?: BonusExercise;
};

export type Lesson = {
  id: string;
  region: string;
  order: number;
  title: string;
  type: LessonType;
  xp: number;
  boss?: boolean;
  /** 声明这一关从哪一关接着写：切到这一关时不重置编辑器里的代码 */
  continuesFrom?: string;
  /** 一句话说明这一关学什么，用在区域页的列表里 */
  summary: string;
  content: Block[];
  exercise: Exercise;
};

export type Region = {
  id: string;
  name: string;
  icon: string;
  season: 1 | 2;
  order: number;
  /** 已实现的关卡 id（按顺序） */
  lessons: string[];
  /** 计划总关数（用于显示 x / y，未实现的区域也用这个） */
  planned: number;
  badge: { name: string; sprite: string };
  /** 内容还没写，地图上立占位节点 */
  comingSoon?: boolean;
};

export const TYPE_LABEL: Record<LessonType, string> = {
  guided: '照着写',
  fill: '补全填空',
  predict: '预测输出',
  debug: '找 bug',
  scratch: '从零写',
  free: '自由创作',
};

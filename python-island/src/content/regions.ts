import type { Region } from './types';

// 第一季 6 个区域（只有「登陆点」在本轮实现）
// 第二季 7 个区域先立占位节点，内容后续补
export const REGIONS: Region[] = [
  {
    id: 'beach', name: '登陆点', icon: 'beach', season: 1, order: 1,
    lessons: ['py-01', 'py-02', 'py-03', 'py-04'], planned: 4,
    badge: { name: '登陆点勋章', sprite: 'beach' },
  },
  {
    id: 'village', name: '数据村庄', icon: 'village', season: 1, order: 2,
    lessons: ['py-05', 'py-06', 'py-07', 'py-08', 'py-09', 'py-10', 'py-11'], planned: 7,
    badge: { name: '数据村庄勋章', sprite: 'village' },
  },
  {
    id: 'warehouse', name: '仓库镇', icon: 'crate', season: 1, order: 3,
    lessons: ['py-12', 'py-13', 'py-14', 'py-15', 'py-16', 'py-17', 'py-18', 'py-19'], planned: 8,
    badge: { name: '仓库镇勋章', sprite: 'crate' },
  },
  {
    id: 'forest', name: '岔路森林', icon: 'forest', season: 1, order: 4,
    lessons: ['py-20', 'py-21', 'py-22', 'py-23', 'py-24', 'py-25', 'py-26'], planned: 7,
    badge: { name: '岔路森林勋章', sprite: 'forest' },
  },
  {
    id: 'workshop', name: '工坊', icon: 'workshop', season: 1, order: 5,
    lessons: ['py-27', 'py-28', 'py-29', 'py-30', 'py-31', 'py-32', 'py-33', 'py-34'], planned: 8,
    badge: { name: '工坊勋章', sprite: 'workshop' },
  },
  {
    id: 'forge', name: '熔炉', icon: 'forge', season: 1, order: 6,
    lessons: ['py-35', 'py-36', 'py-37', 'py-38', 'py-39', 'py-40'], planned: 6,
    badge: { name: '熔炉勋章', sprite: 'forge' },
  },
  {
    id: 'dock', name: '码头', icon: 'dock', season: 2, order: 7,
    lessons: [], planned: 8, comingSoon: true,
    badge: { name: '码头勋章', sprite: 'dock' },
  },
  {
    id: 'repair', name: '修理铺', icon: 'repair', season: 2, order: 8,
    lessons: [], planned: 5, comingSoon: true,
    badge: { name: '修理铺勋章', sprite: 'repair' },
  },
  {
    id: 'tower', name: '高塔', icon: 'tower', season: 2, order: 9,
    lessons: [], planned: 7, comingSoon: true,
    badge: { name: '高塔勋章', sprite: 'tower' },
  },
  {
    id: 'library', name: '图书馆', icon: 'library', season: 2, order: 10,
    lessons: [], planned: 6, comingSoon: true,
    badge: { name: '图书馆勋章', sprite: 'library' },
  },
  {
    id: 'lab', name: '实验室', icon: 'lab', season: 2, order: 11,
    lessons: [], planned: 8, comingSoon: true,
    badge: { name: '实验室勋章', sprite: 'lab' },
  },
  {
    id: 'launchpad', name: '发射台', icon: 'launchpad', season: 2, order: 12,
    lessons: [], planned: 6, comingSoon: true,
    badge: { name: '发射台勋章', sprite: 'launchpad' },
  },
  {
    id: 'graduation', name: '出师', icon: 'graduation', season: 2, order: 13,
    lessons: [], planned: 4, comingSoon: true,
    badge: { name: '出师勋章', sprite: 'graduation' },
  },
];

import { TimeBlock } from '../types';

export type { TimeBlock };

export interface CompletionRecord {
  planDate: string;
  timeblockIndex: number;
  completed: boolean;
  completedAt?: string | null;
}

export const themeColors: Record<string, { bg: string; text: string; border: string; gradient: string; light: string; dark: string }> = {
  blue: { bg: 'bg-gradient-to-br from-blue-500 to-indigo-600', text: 'text-blue-600', border: 'border-blue-200', gradient: 'from-blue-500 to-indigo-600', light: 'bg-blue-50', dark: 'bg-blue-600' },
  red: { bg: 'bg-gradient-to-br from-rose-500 to-red-600', text: 'text-rose-600', border: 'border-rose-200', gradient: 'from-rose-500 to-red-600', light: 'bg-rose-50', dark: 'bg-rose-600' },
  green: { bg: 'bg-gradient-to-br from-emerald-500 to-green-600', text: 'text-emerald-600', border: 'border-emerald-200', gradient: 'from-emerald-500 to-green-600', light: 'bg-emerald-50', dark: 'bg-emerald-600' },
  orange: { bg: 'bg-gradient-to-br from-amber-500 to-orange-600', text: 'text-amber-600', border: 'border-amber-200', gradient: 'from-amber-500 to-orange-600', light: 'bg-amber-50', dark: 'bg-amber-600' },
  purple: { bg: 'bg-gradient-to-br from-violet-500 to-purple-600', text: 'text-violet-600', border: 'border-violet-200', gradient: 'from-violet-500 to-purple-600', light: 'bg-violet-50', dark: 'bg-violet-600' },
  teal: { bg: 'bg-gradient-to-br from-teal-500 to-cyan-600', text: 'text-teal-600', border: 'border-teal-200', gradient: 'from-teal-500 to-cyan-600', light: 'bg-teal-50', dark: 'bg-teal-600' },
  pink: { bg: 'bg-gradient-to-br from-pink-500 to-fuchsia-600', text: 'text-pink-600', border: 'border-pink-200', gradient: 'from-pink-500 to-fuchsia-600', light: 'bg-pink-50', dark: 'bg-pink-600' },
};

export const typeLabels = {
  class: '课程',
  study: '学习',
  exam: '考试',
  break: '休息',
  task: '任务',
};

// 将日期格式转换为Date对象，支持中文格式和ISO格式
export function parseChineseDate(dateStr: string): Date {
  // 首先尝试ISO格式 (2026-06-05)
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  // 然后尝试中文格式 (6月5日)
  const match = dateStr.match(/(\d+)月(\d+)日/);
  if (match) {
    const month = parseInt(match[1], 10);
    const day = parseInt(match[2], 10);
    const now = new Date();
    return new Date(now.getFullYear(), month - 1, day);
  }

  // 如果都不是，返回今天
  return new Date();
}

// 获取当前日期信息
export function getTodayInfo() {
  const today = new Date();
  const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const todayName = dayNames[today.getDay()];
  const formattedDate = `${today.getMonth() + 1}月${today.getDate()}日`;
  return { today, todayName, formattedDate };
}

// 判断时间块是否已过去（考虑完整日期）
export function isTimeBlockPast(timeRange: string, blockDate: string, today: Date): boolean {
  const [, endTime] = timeRange.split('-');
  const [endHours, endMinutes] = endTime.split(':').map(Number);

  const blockDateObj = parseChineseDate(blockDate);
  blockDateObj.setHours(endHours, endMinutes, 0, 0);

  return today > blockDateObj;
}

// 判断时间块日期是否早于今天
export function isBlockDateBeforeToday(blockDate: string, today: Date): boolean {
  const blockDateObj = parseChineseDate(blockDate);
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const blockDayStart = new Date(blockDateObj.getFullYear(), blockDateObj.getMonth(), blockDateObj.getDate());
  return blockDayStart < todayStart;
}

// 判断时间块日期是否是今天
export function isBlockDateToday(blockDate: string, today: Date): boolean {
  const blockDateObj = parseChineseDate(blockDate);
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const blockDayStart = new Date(blockDateObj.getFullYear(), blockDateObj.getMonth(), blockDateObj.getDate());
  return blockDayStart.getTime() === todayStart.getTime();
}

// 判断时间块是否实质上已完成（用户手动完成 或 非学习类型已过期自动完成）
export function effectivelyCompleted(
  block: TimeBlock,
  index: number,
  dayDate: string,
  today: Date,
  isBlockCompletedFn: (index: number, planDate: string) => boolean
): boolean {
  if (isBlockCompletedFn(index, dayDate)) return true;

  const isBefore = isBlockDateBeforeToday(dayDate, today);
  const isToday = isBlockDateToday(dayDate, today);
  const isPast = isTimeBlockPast(block.time, dayDate, today);

  // 非学习类型：如果日期早于今天，或者日期是今天但时间已过，都自动完成
  if (block.type !== 'study') {
    if (isBefore) return true;
    if (isToday && isPast) return true;
  }
  return false;
}

// 根据 startDate 和 dayName 推算正确的 ISO 日期
export function calcCorrectDate(startDate: string | undefined, dayName: string): string {
  const dayOrder = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  const dayIndex = dayOrder.indexOf(dayName);
  const start = startDate ? new Date(startDate) : new Date();
  const correctDate = new Date(start);
  correctDate.setDate(start.getDate() + dayIndex);
  return correctDate.toISOString().split('T')[0];
}

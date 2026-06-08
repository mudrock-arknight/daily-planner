# 周计划翻页功能 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在计划页添加左右箭头翻页，允许用户查看当前周、过去周和未来周的计划。

**Architecture:** 修改 `useWeeklyPlan` hook 改为加载所有周计划（而非仅最新1条），新增 `currentWeekIndex` 状态控制当前查看哪一周。在 `WeeklyPlanPage` 顶部添加左右箭头 + 周次标签的导航栏。

**Tech Stack:** React 18 + TypeScript + Zustand + Supabase

---

### Task 1: 修改 useWeeklyPlan Hook 支持多周计划

**Files:**
- Modify: `e:\szx\大学生活\daily\src\hooks\useWeeklyPlan.ts`

**改动说明**：将 hook 从只加载最新1条改为加载全部计划，按 `startDate` 排序，新增 `currentWeekIndex` 和导航方法。

- [x] **Step 1: 重写 useWeeklyPlan hook**

把 `e:\szx\大学生活\daily\src\hooks\useWeeklyPlan.ts` 改为以下内容：

```typescript
import { useState, useCallback, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { calcCorrectDate, CompletionRecord, TimeBlock } from '../utils/planUtils';

export interface UseWeeklyPlanReturn {
  weeklyPlan: any;
  allPlans: any[];
  currentWeekIndex: number;
  totalWeeks: number;
  loading: boolean;
  completingIndex: number | null;
  handleToggleCompletion: (dayName: string, index: number, block: TimeBlock) => Promise<void>;
  isBlockCompleted: (planDate: string, index: number) => boolean;
  goToPrevWeek: () => void;
  goToNextWeek: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
  loadAllPlans: () => Promise<void>;
  loadCompletions: () => Promise<void>;
}

export function useWeeklyPlan(): UseWeeklyPlanReturn {
  const [allPlans, setAllPlans] = useState<any[]>([]);
  const [currentWeekIndex, setCurrentWeekIndex] = useState<number>(0);
  const [completions, setCompletions] = useState<CompletionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingIndex, setCompletingIndex] = useState<number | null>(null);

  const loadAllPlans = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('weekly_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        setAllPlans(data);
        // 默认显示最新一周（index 0，因为按 created_at 降序排列）
        setCurrentWeekIndex(0);
      }
    } catch (error) {
      console.error('加载周计划失败:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCompletions = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('daily_checkins')
        .select('*')
        .order('date', { ascending: false })
        .limit(90); // 增加limit以覆盖更多周的打卡记录

      if (data && data.length > 0) {
        const completionRecords: CompletionRecord[] = [];
        data.forEach((checkin: any) => {
          if (checkin.data?.completions) {
            checkin.data.completions.forEach((comp: CompletionRecord) => {
              completionRecords.push({
                planDate: checkin.date,
                timeblockIndex: comp.timeblockIndex,
                completed: comp.completed,
                completedAt: comp.completedAt,
              });
            });
          }
        });
        setCompletions(completionRecords);
      }
    } catch (error) {
      console.error('加载打卡记录失败:', error);
    }
  }, []);

  const goToPrevWeek = useCallback(() => {
    setCurrentWeekIndex(prev => Math.min(prev + 1, allPlans.length - 1));
  }, [allPlans.length]);

  const goToNextWeek = useCallback(() => {
    setCurrentWeekIndex(prev => Math.max(prev - 1, 0));
  }, []);

  // 当前查看的周计划
  const weeklyPlan = useMemo(() => {
    return allPlans.length > 0 ? allPlans[currentWeekIndex] : null;
  }, [allPlans, currentWeekIndex]);

  const canGoPrev = currentWeekIndex < allPlans.length - 1;
  const canGoNext = currentWeekIndex > 0;

  const totalWeeks = allPlans.length;

  const handleToggleCompletion = useCallback(async (dayName: string, index: number, block: TimeBlock) => {
    if (completingIndex !== null) return;

    setCompletingIndex(index);

    const planDate = calcCorrectDate(weeklyPlan?.data?.startDate, dayName);

    const existing = completions.find(c => c.planDate === planDate && c.timeblockIndex === index);
    const isCompleted = !existing?.completed;

    try {
      const { data: checkinData } = await supabase
        .from('daily_checkins')
        .select('*')
        .eq('date', planDate)
        .limit(1);

      let completionsArray: any[] = [];
      if (checkinData && checkinData.length > 0) {
        completionsArray = checkinData[0].data?.completions || [];
      }

      const existingIndex = completionsArray.findIndex(
        (c: any) => c.timeblockIndex === index
      );

      const newCompletion = {
        planDate,
        timeblockIndex: index,
        timeblockTime: block.time,
        timeblockContent: block.content,
        timeblockType: block.type,
        completed: isCompleted,
        completedAt: isCompleted ? new Date().toISOString() : null,
      };

      if (existingIndex >= 0) {
        completionsArray[existingIndex] = newCompletion;
      } else {
        completionsArray.push(newCompletion);
      }

      if (checkinData && checkinData.length > 0) {
        await supabase
          .from('daily_checkins')
          .update({ data: { ...checkinData[0].data, completions: completionsArray } })
          .eq('date', planDate);
      } else {
        await supabase
          .from('daily_checkins')
          .insert({
            date: planDate,
            data: { completions: completionsArray }
          });
      }

      if (isCompleted) {
        setCompletions([...completions.filter(c => !(c.planDate === planDate && c.timeblockIndex === index)), newCompletion]);
      } else {
        setCompletions(completions.filter(c => !(c.planDate === planDate && c.timeblockIndex === index)));
      }
    } catch (error) {
      console.error('保存完成状态失败:', error);
    } finally {
      setCompletingIndex(null);
    }
  }, [completingIndex, weeklyPlan, completions]);

  const isBlockCompleted = useCallback((planDate: string, index: number): boolean => {
    const completion = completions.find(c => c.planDate === planDate && c.timeblockIndex === index);
    return completion?.completed || false;
  }, [completions]);

  return {
    weeklyPlan,
    allPlans,
    currentWeekIndex,
    totalWeeks,
    loading,
    completingIndex,
    handleToggleCompletion,
    isBlockCompleted,
    goToPrevWeek,
    goToNextWeek,
    canGoPrev,
    canGoNext,
    loadAllPlans,
    loadCompletions,
  };
}
```

### Task 2: 修改 WeeklyPlanPage 添加翻页导航

**Files:**
- Modify: `e:\szx\大学生活\daily\src\pages\WeeklyPlanPage.tsx`

- [x] **Step 1: 顶部添加翻页箭头**

在 `WeeklyPlanPage.tsx` 的 header card 区域，在"第 {weeklyPlan.week} 周"行上方添加左右箭头导航栏。

把 `e:\szx\大学生活\daily\src\pages\WeeklyPlanPage.tsx` 改为以下内容：

```typescript
import { useState, useEffect } from 'react'
import { Calendar, Target, CheckCircle2, Circle, Loader2, Sparkles, Clock, ChevronLeft, ChevronRight } from 'lucide-react'
import { useWeeklyPlan } from '../hooks/useWeeklyPlan'
import { TimeBlock, themeColors, typeLabels, getTodayInfo, isTimeBlockPast, effectivelyCompleted, calcCorrectDate } from '../utils/planUtils'

export default function WeeklyPlanPage() {
  const {
    weeklyPlan,
    loading,
    completingIndex,
    handleToggleCompletion,
    isBlockCompleted,
    loadAllPlans,
    loadCompletions,
    goToPrevWeek,
    goToNextWeek,
    canGoPrev,
    canGoNext,
    currentWeekIndex,
    totalWeeks,
  } = useWeeklyPlan();
  const [selectedDay, setSelectedDay] = useState<string>('周一')
  const [expandedDay, setExpandedDay] = useState<string | null>('周一')

  const { today, todayName } = getTodayInfo()

  // 当 weeklyPlan 首次加载时，设置默认选中的日期
  useEffect(() => {
    if (weeklyPlan?.data?.dailySchedule) {
      const days = Object.keys(weeklyPlan.data.dailySchedule)
      if (days.length > 0) {
        const initialDay = days.includes(todayName) ? todayName : days[0]
        setSelectedDay(initialDay)
        setExpandedDay(initialDay)
      }
    }
  }, [weeklyPlan, todayName])

  useEffect(() => {
    loadAllPlans()
    loadCompletions()
  }, [loadAllPlans, loadCompletions])

  const totalEnglishHours = weeklyPlan?.data?.weeklyReview?.totalEnglishHours || 0
  const targetHours = weeklyPlan?.data?.weeklyReview?.targetHours || 100
  const progress = Math.min(100, Math.round((totalEnglishHours / targetHours) * 100))

  const selectedDaySchedule = weeklyPlan?.data?.dailySchedule?.[selectedDay]
  const selectedDayTheme = selectedDaySchedule?.themeColor ? themeColors[selectedDaySchedule.themeColor] : themeColors.blue

  if (loading) {
    return (
      <div className="min-h-screen py-6 px-4">
        <div className="max-w-4xl mx-auto pb-32">
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-20 h-20 bg-primary-600/50 rounded-card flex items-center justify-center mb-6">
              <Loader2 size={48} className="text-white animate-spin" />
            </div>
            <p className="text-ink-subtle text-lg font-medium">加载中...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!weeklyPlan) {
    return (
      <div className="min-h-screen py-6 px-4">
        <div className="max-w-4xl mx-auto pb-32">
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-20 h-20 bg-primary-600/50 rounded-card flex items-center justify-center mb-6">
              <Calendar size={48} className="text-white" />
            </div>
            <p className="text-ink-subtle text-lg font-medium mb-2">暂无周计划</p>
            <p className="text-ink-muted">请先在管理后台创建周计划</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-6 px-4">

      <div className="max-w-4xl mx-auto pb-32">
        {/* 周选择器 */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={goToPrevWeek}
            disabled={!canGoPrev}
            className="w-10 h-10 rounded-btn flex items-center justify-center bg-surface-card border border-border shadow-card transition-all duration-200 hover:bg-surface-hover disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={22} className="text-ink" />
          </button>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-surface-card rounded-btn border border-border shadow-card">
            <Calendar className="w-4 h-4 text-primary-600" />
            <span className="font-semibold text-ink">{weeklyPlan.week}</span>
            <span className="text-xs text-ink-muted">
              ({weeklyPlan.data?.startDate} ~ {weeklyPlan.data?.endDate})
            </span>
          </div>
          
          <button
            onClick={goToNextWeek}
            disabled={!canGoNext}
            className="w-10 h-10 rounded-btn flex items-center justify-center bg-surface-card border border-border shadow-card transition-all duration-200 hover:bg-surface-hover disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={22} className="text-ink" />
          </button>
        </div>

        <div className={`${selectedDayTheme.bg} rounded-card p-8 text-white mb-8 shadow-2xl overflow-hidden relative`}>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-white/80 text-sm mb-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  第 {weeklyPlan.week} 周
                </div>
                <div className="text-3xl font-bold">周计划</div>
              </div>
              
              <div className="text-right">
                <div className="text-white/80 text-sm mb-1">英语目标进度</div>
                <div className="text-2xl font-bold">{totalEnglishHours}h / {targetHours}h</div>
              </div>
            </div>

            <div className="bg-surface-card rounded-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-ink-subtle text-sm">总体进度</span>
                <span className="text-ink font-semibold">{progress}%</span>
              </div>
              <div className="w-full bg-primary-600/50 rounded-full h-3">
                <div 
                  className="bg-primary-600 rounded-full h-3 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-ink flex items-center gap-2">
              <Target className="w-6 h-6 text-primary-600" />
              每日计划
            </h2>
            <span className="text-sm text-ink-subtle">{Object.keys(weeklyPlan.data?.dailySchedule || {}).length} 天</span>
          </div>

          <div className="grid gap-4">
            {Object.entries(weeklyPlan.data?.dailySchedule || {}).map(([dayName, dayData]: [string, any]) => {
              const isSelected = selectedDay === dayName
              const isExpanded = expandedDay === dayName
              const dayTheme = dayData.themeColor ? themeColors[dayData.themeColor] : themeColors.blue
              
              const correctDateStr = calcCorrectDate(weeklyPlan?.data?.startDate, dayName);
              
              const dayCompletedCount = dayData.timeBlocks 
                ? dayData.timeBlocks.filter((_: any, i: number) => isBlockCompleted(correctDateStr, i)).length 
                : 0
              const dayTotalCount = dayData.timeBlocks?.length || 0
              
              return (
                <div 
                  key={dayName}
                  className={`bg-surface-card rounded-card shadow-card overflow-hidden transition-all duration-300 ${
                    isSelected ? 'ring-2 ring-primary-600' : ''
                  }`}
                >
                  <button
                    onClick={() => {
                      setSelectedDay(dayName)
                      setExpandedDay(isExpanded ? null : dayName)
                    }}
                    className="w-full p-6 flex items-center justify-between hover:bg-surface-hover transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-btn ${dayTheme.bg} flex items-center justify-center text-white font-bold`}>
                        {dayName.slice(0, 1)}
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-ink">{dayName}</div>
                        <div className="text-sm text-ink-subtle">{correctDateStr}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-ink-subtle">完成进度</div>
                        <div className="font-semibold text-ink">{dayCompletedCount}/{dayTotalCount}</div>
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}>
                        <svg className="w-5 h-5 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-6">
                      <div className="border-t pt-4">
                        <div className="flex items-center gap-2 mb-4">
                          <Sparkles className="w-4 h-4 text-warning" />
                          <span className="text-sm font-medium text-ink">今日重点: {dayData.focusGoal}</span>
                        </div>
                        
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="w-4 h-4 text-primary-600" />
                            <span className="text-sm font-medium text-ink">英语目标: {dayData.englishTarget}h</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {dayData.timeBlocks && dayData.timeBlocks.length > 0 ? (
                            dayData.timeBlocks.map((block: TimeBlock, i: number) => {
                              const blockTheme = block.type === 'class' ? themeColors.blue :
                                                block.type === 'study' ? themeColors.green :
                                                block.type === 'exam' ? themeColors.red :
                                                block.type === 'break' ? themeColors.orange :
                                                themeColors.purple
                              const past = isTimeBlockPast(block.time, correctDateStr, today)
                              const userCompleted = isBlockCompleted(correctDateStr, i)
                              const completed = effectivelyCompleted(block, i, correctDateStr, today, (idx, pDate) => isBlockCompleted(pDate, idx))
                              const isCheckable = block.type === 'study' && block.countable === true

                              return (
                                <div
                                  key={i}
                                  className={`flex items-start gap-4 p-4 rounded-card transition-all duration-300 ${
                                    completed
                                      ? 'bg-green-50 border border-green-200'
                                      : past
                                      ? 'bg-surface opacity-70'
                                      : blockTheme.light
                                  }`}
                                >
                                  {isCheckable ? (
                                    <button
                                      onClick={() => handleToggleCompletion(dayName, i, block)}
                                      disabled={completingIndex !== null}
                                      className={`w-14 h-14 rounded-card flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                                        userCompleted
                                          ? 'bg-green-500 text-white shadow-card scale-110'
                                          : past
                                          ? 'bg-surface-hover text-ink-muted'
                                          : `${blockTheme.dark} text-white cursor-pointer hover:scale-110`
                                      } ${completingIndex === i ? 'animate-pulse' : ''}`}
                                    >
                                      {userCompleted ? (
                                        <CheckCircle2 size={28} />
                                      ) : (
                                        <Circle size={28} />
                                      )}
                                    </button>
                                  ) : (
                                    <div className={`w-14 h-14 rounded-card flex items-center justify-center flex-shrink-0 ${
                                      completed ? 'bg-green-500' : 'bg-surface-hover'
                                    }`}>
                                      {completed ? (
                                        <CheckCircle2 size={28} className="text-white" />
                                      ) : (
                                        <Circle size={28} className="text-ink-muted" />
                                      )}
                                    </div>
                                  )}
                                  
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className={`text-sm font-semibold ${blockTheme.text}`}>{block.time}</span>
                                      <span className={`text-xs px-2 py-0.5 rounded-full ${blockTheme.light} ${blockTheme.text}`}>
                                        {typeLabels[block.type as keyof typeof typeLabels] || '任务'}
                                      </span>
                                    </div>
                                    <div className={`font-medium ${completed ? 'text-green-700 line-through' : 'text-ink'}`}>
                                      {block.content}
                                    </div>
                                    {block.detail && (
                                      <div className="text-sm text-ink-subtle mt-1">{block.detail}</div>
                                    )}
                                    {block.location && (
                                      <div className="text-xs text-ink-muted mt-1 flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {block.location}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )
                            })
                          ) : (
                            <div className="text-center py-8 bg-surface rounded-card">
                              <Clock className="w-8 h-8 text-ink-muted mx-auto mb-2" />
                              <p className="text-ink-subtle">暂无时间安排</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
```

### Task 3: 同步修改 HomePage（确保兼容新 hook 接口）

**Files:**
- Modify: `e:\szx\大学生活\daily\src\pages\HomePage.tsx`

**说明**：HomePage 也使用 `useWeeklyPlan` hook，需要更新调用方式以兼容新接口。

- [ ] **Step 1: 更新 HomePage 中的 hook 调用**

HomePage 需要将 `loadWeeklyPlan` 改为 `loadAllPlans`，因为 `useWeeklyPlan` 不再导出 `loadWeeklyPlan`。

把 `e:\szx\大学生活\daily\src\pages\HomePage.tsx` 中以下位置：

```typescript
// 旧代码（第4行附近）
import { useWeeklyPlan } from '../hooks/useWeeklyPlan';

// 旧代码 - useEffect 中使用 loadWeeklyPlan 的地方
useEffect(() => {
    Promise.all([loadWeeklyPlan(), loadCompletions()]);
}, [loadWeeklyPlan, loadCompletions]);
```

改为：

```typescript
// 新代码
import { useWeeklyPlan } from '../hooks/useWeeklyPlan';

// 以及解构时改为 loadAllPlans
const {
    weeklyPlan,
    loading,
    completingIndex,
    handleToggleCompletion,
    isBlockCompleted,
    loadAllPlans,
    loadCompletions,
} = useWeeklyPlan();

// useEffect 改为
useEffect(() => {
    Promise.all([loadAllPlans(), loadCompletions()]);
}, [loadAllPlans, loadCompletions]);
```

### Task 4: 验证构建

- [ ] **Step 1: 运行构建**

```bash
npm run build
```

Expected: 无错误，构建成功。

- [ ] **Step 2: 提交**

```bash
git add src/hooks/useWeeklyPlan.ts src/pages/WeeklyPlanPage.tsx src/pages/HomePage.tsx
git commit -m "feat: 周计划页面支持左右箭头翻页查看不同周"
```

---

## Self-Review

1. **Spec coverage**: 所有需求已覆盖 - 左右箭头翻页、查看过去周、查看未来周、仅查看不创建
2. **Placeholder scan**: 无 TBD/TODO/占位符
3. **Type consistency**: `loadAllPlans` 替代 `loadWeeklyPlan`，接口一致，HomePage 同步更新
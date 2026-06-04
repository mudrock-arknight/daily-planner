import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { calcCorrectDate, CompletionRecord, TimeBlock } from '../utils/planUtils';

export interface UseWeeklyPlanReturn {
  weeklyPlan: any;
  completions: CompletionRecord[];
  loading: boolean;
  completingIndex: number | null;
  handleToggleCompletion: (dayName: string, index: number, block: TimeBlock) => Promise<void>;
  isBlockCompleted: (planDate: string, index: number) => boolean;
  loadWeeklyPlan: () => Promise<void>;
  loadCompletions: () => Promise<void>;
}

export function useWeeklyPlan(): UseWeeklyPlanReturn {
  const [weeklyPlan, setWeeklyPlan] = useState<any>(null);
  const [completions, setCompletions] = useState<CompletionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingIndex, setCompletingIndex] = useState<number | null>(null);

  const loadWeeklyPlan = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('weekly_plans')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (data && data.length > 0) {
        setWeeklyPlan(data[0]);
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
        .limit(30);

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
    completions,
    loading,
    completingIndex,
    handleToggleCompletion,
    isBlockCompleted,
    loadWeeklyPlan,
    loadCompletions,
  };
}

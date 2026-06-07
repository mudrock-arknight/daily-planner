import { useState, useCallback, useMemo } from 'react';
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
        .limit(90);

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
      console.error('加载
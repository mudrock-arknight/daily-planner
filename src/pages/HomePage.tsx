import { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, Target, CheckCircle2, Circle, AlertCircle, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';

interface TimeBlock {
  time: string;
  content: string;
  detail?: string;
  location?: string;
  type: string;
  countable?: boolean;
  completed?: boolean;
  completedAt?: string;
}

interface CompletionRecord {
  planDate: string
  timeblockIndex: number
  completed: boolean
  completedAt?: string | null
}

const themeColors: Record<string, { bg: string; text: string; border: string; gradient: string; light: string; dark: string }> = {
  blue: { bg: 'bg-gradient-to-br from-blue-500 to-indigo-600', text: 'text-blue-600', border: 'border-blue-200', gradient: 'from-blue-500 to-indigo-600', light: 'bg-blue-50', dark: 'bg-blue-600' },
  red: { bg: 'bg-gradient-to-br from-rose-500 to-red-600', text: 'text-rose-600', border: 'border-rose-200', gradient: 'from-rose-500 to-red-600', light: 'bg-rose-50', dark: 'bg-rose-600' },
  green: { bg: 'bg-gradient-to-br from-emerald-500 to-green-600', text: 'text-emerald-600', border: 'border-emerald-200', gradient: 'from-emerald-500 to-green-600', light: 'bg-emerald-50', dark: 'bg-emerald-600' },
  orange: { bg: 'bg-gradient-to-br from-amber-500 to-orange-600', text: 'text-amber-600', border: 'border-amber-200', gradient: 'from-amber-500 to-orange-600', light: 'bg-amber-50', dark: 'bg-amber-600' },
  purple: { bg: 'bg-gradient-to-br from-violet-500 to-purple-600', text: 'text-violet-600', border: 'border-violet-200', gradient: 'from-violet-500 to-purple-600', light: 'bg-violet-50', dark: 'bg-violet-600' },
  teal: { bg: 'bg-gradient-to-br from-teal-500 to-cyan-600', text: 'text-teal-600', border: 'border-teal-200', gradient: 'from-teal-500 to-cyan-600', light: 'bg-teal-50', dark: 'bg-teal-600' },
  pink: { bg: 'bg-gradient-to-br from-pink-500 to-fuchsia-600', text: 'text-pink-600', border: 'border-pink-200', gradient: 'from-pink-500 to-fuchsia-600', light: 'bg-pink-50', dark: 'bg-pink-600' },
};

const typeLabels = {
  class: '课程',
  study: '学习',
  exam: '考试',
  break: '休息',
  task: '任务',
};

// 将日期格式转换为Date对象，支持中文格式和ISO格式
function parseChineseDate(dateStr: string): Date {
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
function getTodayInfo() {
  const today = new Date();
  const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const todayName = dayNames[today.getDay()];
  const formattedDate = `${today.getMonth() + 1}月${today.getDate()}日`;
  return { today, todayName, formattedDate };
}

export default function HomePage() {
  const [currentTimeBlock, setCurrentTimeBlock] = useState('');
  const [currentTask, setCurrentTask] = useState('');
  const [todaysSchedule, setTodaysSchedule] = useState<any>(null);
  const [weeklyPlan, setWeeklyPlan] = useState<any>(null);
  const { today, todayName, formattedDate } = getTodayInfo();
  const [selectedDay, setSelectedDay] = useState<string>(todayName);
  const [completions, setCompletions] = useState<CompletionRecord[]>([]);
  const [completingIndex, setCompletingIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { todos } = useStore();

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
  
  // 当weeklyPlan首次加载时，设置默认日期
  useEffect(() => {
    if (weeklyPlan?.data?.dailySchedule && !selectedDay) {
      const dailySchedule = weeklyPlan.data.dailySchedule;
      const days = Object.keys(dailySchedule);
      
      console.log('=== 设置默认日期 ===');
      console.log('todayName:', todayName);
      console.log('days:', days);
      
      // 尝试多种方式找到今天的日期
      let targetDay = '周一';
      if (days.includes(todayName)) {
        targetDay = todayName;
      } else {
        const todayDateStr = `${today.getMonth() + 1}月${today.getDate()}日`;
        if (days.includes(todayDateStr)) {
          targetDay = todayDateStr;
        } else {
          targetDay = days[0] || '周一';
        }
      }
      
      console.log('targetDay:', targetDay);
      setSelectedDay(targetDay);
    }
  }, [weeklyPlan, todayName, today]);

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

  useEffect(() => {
    Promise.all([loadWeeklyPlan(), loadCompletions()]);
  }, [loadWeeklyPlan, loadCompletions]);

  useEffect(() => {
    updateCurrentTask();
  }, [todaysSchedule]);

  useEffect(() => {
    if (weeklyPlan?.data?.dailySchedule && selectedDay) {
      setTodaysSchedule(weeklyPlan.data.dailySchedule[selectedDay]);
    }
  }, [selectedDay, weeklyPlan]);

  async function handleToggleCompletion(index: number, _block: TimeBlock) {
    if (completingIndex !== null) return;
    
    setCompletingIndex(index);
    
    const planDate = todaysSchedule?.date;
    
    const existing = completions.find(c => c.planDate === planDate && c.timeblockIndex === index);
    const isCompleted = !existing?.completed;
    
    try {
      const { data: checkinData } = await supabase
        .from('daily_checkins')
        .select('*')
        .eq('date', planDate)
        .limit(1);

      let completionsArray = [];
      if (checkinData && checkinData.length > 0) {
        completionsArray = checkinData[0].data?.completions || [];
      }

      const existingIndex = completionsArray.findIndex(
        (c: any) => c.timeblockIndex === index
      );
      
      const newCompletion = {
        planDate,
        timeblockIndex: index,
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
          .update({ data: { completions: completionsArray } })
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
  }

  function isBlockCompleted(index: number, planDate: string | undefined): boolean {
    if (!planDate) return false;
    const completion = completions.find(c => c.planDate === planDate && c.timeblockIndex === index);
    return completion?.completed || false;
  }

  function updateCurrentTask() {
    if (!todaysSchedule?.timeBlocks) {
      const hours = today.getHours();
      const minutes = today.getMinutes();
      const totalMinutes = hours * 60 + minutes;
      
      let timeBlock = '';
      let task = '';
      
      if (totalMinutes < 510) {
        timeBlock = '清晨';
        task = '美好的一天即将开始';
      } else if (totalMinutes < 720) {
        timeBlock = '上午';
        task = '上午的课程和学习时间';
      } else if (totalMinutes < 840) {
        timeBlock = '中午';
        task = '午餐和休息时间';
      } else if (totalMinutes < 1020) {
        timeBlock = '下午';
        task = '下午的课程和学习时间';
      } else if (totalMinutes < 1140) {
        timeBlock = '傍晚';
        task = '晚餐和放松时间';
      } else if (totalMinutes < 1320) {
        timeBlock = '晚上';
        task = '晚间学习时间';
      } else {
        timeBlock = '深夜';
        task = '该休息了，明天见';
      }
      
      setCurrentTimeBlock(timeBlock);
      setCurrentTask(task);
      return;
    }

    const hours = today.getHours();
    const minutes = today.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    let timeBlock = '';
    let task = '';

    for (const block of todaysSchedule.timeBlocks) {
      const [startTime, endTime] = block.time.split('-');
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      const [endHours, endMinutes] = endTime.split(':').map(Number);
      
      const startTotal = startHours * 60 + startMinutes;
      const endTotal = endHours * 60 + endMinutes;

      if (totalMinutes >= startTotal && totalMinutes < endTotal) {
        timeBlock = block.time;
        task = block.content;
        break;
      }
    }

    if (!timeBlock) {
      if (totalMinutes < 510) {
        timeBlock = '清晨';
        task = '美好的一天即将开始';
      } else if (totalMinutes < 720) {
        timeBlock = '上午';
        task = '上午的课程和学习时间';
      } else if (totalMinutes < 840) {
        timeBlock = '中午';
        task = '午餐和休息时间';
      } else if (totalMinutes < 1020) {
        timeBlock = '下午';
        task = '下午的课程和学习时间';
      } else if (totalMinutes < 1140) {
        timeBlock = '傍晚';
        task = '晚餐和放松时间';
      } else if (totalMinutes < 1320) {
        timeBlock = '晚上';
        task = '晚间学习时间';
      } else {
        timeBlock = '深夜';
        task = '该休息了，明天见';
      }
    }

    setCurrentTimeBlock(timeBlock);
    setCurrentTask(task);
  }

  // 判断时间块是否已过去（考虑完整日期）
  function isTimeBlockPast(timeRange: string, blockDate: string): boolean {
    const [, endTime] = timeRange.split('-');
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    const blockDateObj = parseChineseDate(blockDate);
    blockDateObj.setHours(endHours, endMinutes, 0, 0);

    return today > blockDateObj;
  }

  // 判断时间块日期是否早于今天
  function isBlockDateBeforeToday(blockDate: string): boolean {
    const blockDateObj = parseChineseDate(blockDate);
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const blockDayStart = new Date(blockDateObj.getFullYear(), blockDateObj.getMonth(), blockDateObj.getDate());
    return blockDayStart < todayStart;
  }

  // 判断时间块日期是否是今天
  function isBlockDateToday(blockDate: string): boolean {
    const blockDateObj = parseChineseDate(blockDate);
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const blockDayStart = new Date(blockDateObj.getFullYear(), blockDateObj.getMonth(), blockDateObj.getDate());
    return blockDayStart.getTime() === todayStart.getTime();
  }

  function effectivelyCompleted(block: TimeBlock, index: number, dayDate: string): boolean {
    if (isBlockCompleted(index, dayDate)) return true;
    
    // 调试日志
    const isBefore = isBlockDateBeforeToday(dayDate);
    const isToday = isBlockDateToday(dayDate);
    const isPast = isTimeBlockPast(block.time, dayDate);
    console.log('=== effectivelyCompleted 调试 ===');
    console.log('block.content:', block.content);
    console.log('block.type:', block.type);
    console.log('dayDate:', dayDate);
    console.log('isBlockDateBeforeToday:', isBefore);
    console.log('isBlockDateToday:', isToday);
    console.log('isTimeBlockPast:', isPast);
    
    // 非学习类型：如果日期早于今天，或者日期是今天但时间已过，都自动完成
    if (block.type !== 'study') {
      if (isBefore) {
        console.log('结果: 自动完成（历史日期）');
        return true;
      }
      // 只有当日期是今天时，才检查时间是否已过
      if (isToday && isPast) {
        console.log('结果: 自动完成（今天且时间已过）');
        return true;
      }
    }
    console.log('结果: 不自动完成');
    return false;
  }

  const incompleteTodos = todos.filter(t => !t.completed).slice(0, 3);
  const currentDaySchedule = weeklyPlan?.data?.dailySchedule?.[selectedDay];
  const theme = currentDaySchedule?.themeColor ? themeColors[currentDaySchedule.themeColor] : themeColors.blue;

  const todayCompletionCount = todaysSchedule?.timeBlocks 
    ? todaysSchedule.timeBlocks.filter((_: any, i: number) => isBlockCompleted(i, todaysSchedule.date)).length 
    : 0;
  const todayTotalCount = todaysSchedule?.timeBlocks?.length || 0;

  return (
    <div className="min-h-screen py-6 px-4 relative z-10">
      <div className="bg-decorations">
        <div className="bg-decoration-1"></div>
        <div className="bg-decoration-2"></div>
        <div className="bg-decoration-3"></div>
      </div>

      {loading ? (
        <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">加载中...</p>
        </div>
      ) : (
      <div className="max-w-2xl mx-auto">
        <div className={`${theme.bg} rounded-3xl p-6 text-white mb-6 shadow-2xl animate-fadeIn overflow-hidden relative`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-white/80 text-sm mb-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {selectedDay}
                </div>
                <div className="text-3xl font-bold">{formattedDate}</div>
              </div>
              
              <div className="text-right">
                <div className="text-white/80 text-sm mb-1 flex items-center gap-2 justify-end">
                  <Clock className="w-4 h-4" />
                  当前时段
                </div>
                <div className="text-xl font-semibold">{currentTimeBlock}</div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-white/70 text-sm">当前任务</div>
                  <div className="font-medium">{currentTask}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
                  <div className="text-white/70 text-xs">今日进度</div>
                  <div className="font-semibold">{todayCompletionCount}/{todayTotalCount}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
                  <div className="text-white/70 text-xs">待办事项</div>
                  <div className="font-semibold">{incompleteTodos.length} 待办</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <span className="text-sm">保持专注</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              今日计划
            </h2>
            <span className="text-sm text-gray-500">{selectedDay}</span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map((day) => {
              const isSelected = selectedDay === day;
              const dayTheme = themeColors[currentDaySchedule?.themeColor || 'blue'];
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isSelected 
                      ? `${dayTheme.bg} text-white shadow-lg scale-105` 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
          
          {currentDaySchedule?.timeBlocks ? (
            <div className="space-y-3 mt-4">
              {currentDaySchedule.timeBlocks.map((block: TimeBlock, i: number) => {
                const planDate = currentDaySchedule.date;
                const past = isTimeBlockPast(block.time, planDate);
                const userCompleted = isBlockCompleted(i, planDate);
                const completed = effectivelyCompleted(block, i, planDate);
                const blockTheme = block.type === 'class' ? themeColors.blue :
                                    block.type === 'study' ? themeColors.green :
                                    block.type === 'exam' ? themeColors.red :
                                    block.type === 'break' ? themeColors.orange :
                                    themeColors.purple;
                const isCheckable = block.type === 'study' && block.countable === true;

                return (
                  <div
                    key={i}
                    className={`flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 card-hover ${
                      completed
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200'
                        : past
                        ? 'bg-gray-50 opacity-60'
                        : blockTheme.light
                    } animate-fadeIn`}
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    {isCheckable ? (
                      <button
                        onClick={() => handleToggleCompletion(i, block)}
                        disabled={completingIndex !== null}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                          userCompleted
                            ? 'bg-green-500 text-white shadow-lg scale-110'
                            : past
                            ? 'bg-gray-200 text-gray-400'
                            : `${blockTheme.dark} text-white cursor-pointer hover:scale-110`
                        } ${completingIndex === i ? 'animate-pulse' : ''}`}
                      >
                        {userCompleted ? (
                          <CheckCircle2 size={22} />
                        ) : (
                          <Circle size={22} />
                        )}
                      </button>
                    ) : (
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        completed ? 'bg-green-500' : 'bg-gray-100'
                      }`}>
                        {completed ? (
                          <CheckCircle2 size={22} className="text-white" />
                        ) : (
                          <Circle size={22} className="text-gray-300" />
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
                      <div className={`font-medium ${completed ? 'text-green-700 line-through' : 'text-gray-800'}`}>
                        {block.content}
                      </div>
                      {block.detail && (
                        <div className="text-sm text-gray-500 mt-1">{block.detail}</div>
                      )}
                      {block.location && (
                        <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {block.location}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">暂无今日计划</p>
              <p className="text-gray-400 text-sm mt-1">请先在周计划页面创建计划</p>
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
}

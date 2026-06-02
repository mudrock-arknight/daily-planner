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

export default function HomePage() {
  const [currentTimeBlock, setCurrentTimeBlock] = useState('');
  const [currentTask, setCurrentTask] = useState('');
  const [todaysSchedule, setTodaysSchedule] = useState<any>(null);
  const [weeklyPlan, setWeeklyPlan] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState<string>('周一');
  const [completions, setCompletions] = useState<CompletionRecord[]>([]);
  const [completingIndex, setCompletingIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { todos } = useStore();

  const today = new Date();
  const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const todayName = dayNames[today.getDay()];
  const formattedDate = `${today.getMonth() + 1}月${today.getDate()}日`;

  const loadWeeklyPlan = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('weekly_plans')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (data && data.length > 0) {
        setWeeklyPlan(data[0]);
        
        const dailySchedule = data[0].data?.dailySchedule;
        if (dailySchedule) {
          const days = Object.keys(dailySchedule);
          const targetDay = days.includes(todayName) ? todayName : (days[0] || '周一');
          
          setSelectedDay(targetDay);
          setTodaysSchedule(dailySchedule[targetDay]);
        }
      }
    } catch (error) {
      console.error('加载周计划失败:', error);
    } finally {
      setLoading(false);
    }
  }, [todayName]);

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
    const interval = setInterval(updateCurrentTask, 60000);
    return () => clearInterval(interval);
  }, [todaysSchedule]);

  useEffect(() => {
    if (weeklyPlan?.data?.dailySchedule && selectedDay) {
      setTodaysSchedule(weeklyPlan.data.dailySchedule[selectedDay]);
    }
  }, [selectedDay, weeklyPlan]);

  async function handleToggleCompletion(index: number, block: TimeBlock) {
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
          .update({
            data: { ...checkinData[0].data, completions: completionsArray }
          })
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
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const totalMinutes = hours * 60 + minutes;
      
      let timeBlock = '';
      let task = '';
      
      if (totalMinutes < 510) {
        timeBlock = '清晨';
        task = '美好的一天即将开始';
      } else if (totalMinutes < 720) {
        timeBlock = '上午';
        task = '专注学习时间';
      } else if (totalMinutes < 840) {
        timeBlock = '午间';
        task = '享受午餐，适当休息';
      } else if (totalMinutes < 1080) {
        timeBlock = '下午';
        task = '继续努力';
      } else if (totalMinutes < 1260) {
        timeBlock = '晚间';
        task = '晚间学习';
      } else {
        timeBlock = '深夜';
        task = '该休息了，明天见';
      }
      
      setCurrentTimeBlock(timeBlock);
      setCurrentTask(task);
      return;
    }

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    let timeBlock = '';
    let task = '';

    for (const block of todaysSchedule.timeBlocks) {
      const [startStr, endStr] = block.time.split('-');
      if (startStr && endStr) {
        const [startHour, startMin] = startStr.split(':').map(Number);
        const [endHour, endMin] = endStr.split(':').map(Number);
        const startTotal = startHour * 60 + startMin;
        const endTotal = endHour * 60 + endMin;
        
        if (totalMinutes >= startTotal && totalMinutes < endTotal) {
          task = block.content;
          if (startHour < 12) timeBlock = '上午';
          else if (startHour < 14) timeBlock = '午间';
          else if (startHour < 18) timeBlock = '下午';
          else if (startHour < 21) timeBlock = '晚间';
          else timeBlock = '深夜';
          break;
        }
      }
    }

    if (!task) {
      if (totalMinutes < 510) {
        timeBlock = '清晨';
        task = '美好的一天即将开始';
      } else if (totalMinutes < 720) {
        timeBlock = '上午';
        task = '专注学习时间';
      } else if (totalMinutes < 840) {
        timeBlock = '午间';
        task = '享受午餐，适当休息';
      } else if (totalMinutes < 1080) {
        timeBlock = '下午';
        task = '继续努力';
      } else if (totalMinutes < 1260) {
        timeBlock = '晚间';
        task = '晚间学习';
      } else {
        timeBlock = '深夜';
        task = '该休息了，明天见';
      }
    }

    setCurrentTimeBlock(timeBlock);
    setCurrentTask(task);
  }

  function isTimeBlockPast(timeRange: string, blockDate: string) {
    const now = new Date();
    const [, endTime] = timeRange.split('-');
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    const blockDateObj = new Date(blockDate);
    blockDateObj.setHours(endHours, endMinutes, 0, 0);

    return now > blockDateObj;
  }

  function effectivelyCompleted(block: TimeBlock, index: number, dayDate: string): boolean {
    if (isBlockCompleted(index, dayDate)) return true;
    if (block.type !== 'study' && isTimeBlockPast(block.time, dayDate)) {
      return true;
    }
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
              <div className="animate-float">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur">
                  <Clock size={32} className="text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 animate-fadeIn stagger-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Clock className="text-yellow-900" size={20} />
                </div>
                <div>
                  <div className="text-white/90 text-sm font-medium">{currentTimeBlock}</div>
                  <div className="text-white font-semibold text-lg">{currentTask}</div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4 animate-fadeIn stagger-2">
              <div className="flex items-center gap-2">
                <span className="px-4 py-1.5 bg-white/20 backdrop-blur rounded-full text-sm font-medium">
                  {currentDaySchedule?.theme || '学习日'}
                </span>
              </div>
              {todayTotalCount > 0 && (
                <div className="flex items-center gap-2 text-sm text-white/90">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>今日完成: {todayCompletionCount}/{todayTotalCount}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-xl mb-6 animate-fadeIn stagger-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
              <div className={`w-10 h-10 ${theme.light} rounded-xl flex items-center justify-center`}>
                <Calendar className={theme.text} size={20} />
              </div>
              每日计划
            </h2>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
            {dayNames.slice(1).map((day) => {
              const schedule = weeklyPlan?.data?.dailySchedule?.[day];
              const dayTheme = schedule?.themeColor ? themeColors[schedule.themeColor] : themeColors.blue;
              const isSelected = selectedDay === day;
              
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
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="text-gray-400" size={36} />
              </div>
              <p className="text-gray-500 font-medium">暂无今日计划</p>
              <p className="text-sm text-gray-400 mt-1">快去添加你的计划吧</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-xl mb-6 animate-fadeIn stagger-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="text-blue-600" size={20} />
              </div>
              待办事项
            </h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {incompleteTodos.length} 项
            </span>
          </div>
          
          {incompleteTodos.length > 0 ? (
            <div className="space-y-3">
              {incompleteTodos.map((todo, idx) => (
                <div key={todo.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl card-hover animate-fadeIn" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex-shrink-0"></div>
                  <span className="flex-1 text-gray-700">{todo.title}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="text-green-500" size={32} />
              </div>
              <p className="text-gray-500">没有待办，太完美了！</p>
            </div>
          )}
        </div>

        {weeklyPlan?.data?.goals && (
          <div className="bg-white rounded-3xl p-6 shadow-xl animate-fadeIn stagger-3">
            <h2 className="font-bold text-gray-800 text-lg mb-5 flex items-center gap-2">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <Target className="text-purple-600" size={20} />
              </div>
              本周目标
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {weeklyPlan.data.goals.slice(0, 4).map((goal: any, idx: number) => (
                <div 
                  key={goal.id} 
                  className={`p-5 rounded-2xl border-2 transition-all duration-300 card-hover ${
                    goal.type === 'exam' ? 'bg-red-50 border-red-100' :
                    goal.type === 'study' ? 'bg-green-50 border-green-100' :
                    'bg-blue-50 border-blue-100'
                  } animate-fadeIn`}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="font-semibold text-gray-800 flex-1">{goal.text}</span>
                    {goal.type === 'exam' && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">考试</span>
                    )}
                    {goal.type === 'study' && (
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium">学习</span>
                    )}
                  </div>
                  {goal.progress !== undefined && (
                    <div className="mb-2">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 progress-bar ${
                            goal.type === 'exam' ? 'bg-gradient-to-r from-red-500 to-rose-500' :
                            goal.type === 'study' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                            'bg-gradient-to-r from-blue-500 to-indigo-500'
                          }`}
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1.5">{goal.progress}% 完成</div>
                    </div>
                  )}
                  {goal.deadline && (
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock size={12} />
                      截止: {goal.deadline}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {weeklyPlan?.data?.longTermGoals && (
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 shadow-xl mt-6 animate-fadeIn stagger-4">
            <h2 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Sparkles className="text-indigo-600" size={20} />
              </div>
              大学长期目标
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {weeklyPlan.data.longTermGoals.map((goal: any, idx: number) => {
                const categoryColors: Record<string, string> = {
                  language: 'from-blue-400 to-indigo-500',
                  tech: 'from-green-400 to-emerald-500',
                  finance: 'from-amber-400 to-orange-500',
                  skill: 'from-purple-400 to-pink-500',
                  hobby: 'from-rose-400 to-red-500'
                };
                const categoryBg: Record<string, string> = {
                  language: 'bg-blue-50',
                  tech: 'bg-green-50',
                  finance: 'bg-amber-50',
                  skill: 'bg-purple-50',
                  hobby: 'bg-rose-50'
                };
                const categoryText: Record<string, string> = {
                  language: 'text-blue-600',
                  tech: 'text-green-600',
                  finance: 'text-amber-600',
                  skill: 'text-purple-600',
                  hobby: 'text-rose-600'
                };
                
                return (
                  <div 
                    key={goal.id} 
                    className={`p-4 rounded-xl ${categoryBg[goal.category] || 'bg-gray-50'} border border-transparent transition-all duration-300 card-hover animate-fadeIn`}
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-8 rounded-full bg-gradient-to-b ${categoryColors[goal.category] || 'bg-gray-400'}`}></span>
                        <span className="font-medium text-gray-700">{goal.text}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${categoryBg[goal.category] || 'bg-gray-100'} ${categoryText[goal.category] || 'text-gray-600'}`}>
                          {goal.category === 'language' ? '语言' :
                           goal.category === 'tech' ? '技术' :
                           goal.category === 'finance' ? '金融' :
                           goal.category === 'skill' ? '技能' :
                           goal.category === 'hobby' ? '爱好' : '其他'}
                        </span>
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full bg-gradient-to-r ${categoryColors[goal.category] || 'bg-gray-400'}`}
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-8">{goal.progress}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      )}
    </div>
  );
}

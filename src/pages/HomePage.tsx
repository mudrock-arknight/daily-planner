import { useState, useEffect } from 'react';
import { Calendar, Clock, Target, CheckCircle2, Circle, AlertCircle, Sparkles } from 'lucide-react';
import { useWeeklyPlan } from '../hooks/useWeeklyPlan';
import { useStore } from '../store/useStore';
import { TimeBlock, themeColors, typeLabels, getTodayInfo, isTimeBlockPast, effectivelyCompleted, calcCorrectDate } from '../utils/planUtils';

export default function HomePage() {
  const {
    weeklyPlan,
    loading,
    completingIndex,
    handleToggleCompletion,
    isBlockCompleted,
    loadAllPlans,
    loadCompletions,
  } = useWeeklyPlan();
  const [currentTimeBlock, setCurrentTimeBlock] = useState('');
  const [currentTask, setCurrentTask] = useState('');
  const [todaysSchedule, setTodaysSchedule] = useState<any>(null);
  const { today, todayName, formattedDate } = getTodayInfo();
  const [selectedDay, setSelectedDay] = useState<string>(todayName);
  const { todos } = useStore();


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


  useEffect(() => {
    Promise.all([loadAllPlans(), loadCompletions()]);
  }, [loadAllPlans, loadCompletions]);

  useEffect(() => {
    updateCurrentTask();
  }, [todaysSchedule]);

  useEffect(() => {
    if (weeklyPlan?.data?.dailySchedule && selectedDay) {
      setTodaysSchedule(weeklyPlan.data.dailySchedule[selectedDay]);
    }
  }, [selectedDay, weeklyPlan]);


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

  const incompleteTodos = todos.filter(t => !t.completed).slice(0, 3);
  const currentDaySchedule = weeklyPlan?.data?.dailySchedule?.[selectedDay];
  
  const theme = currentDaySchedule?.themeColor ? themeColors[currentDaySchedule.themeColor] : themeColors.blue;

  // 根据 startDate 和 selectedDay 计算正确的日期，用于进度统计
  const correctDateStr = calcCorrectDate(weeklyPlan?.data?.startDate, selectedDay);

  const todayCompletionCount = todaysSchedule?.timeBlocks 
    ? todaysSchedule.timeBlocks.filter((_: any, i: number) => isBlockCompleted(correctDateStr, i)).length 
    : 0;
  const todayTotalCount = todaysSchedule?.timeBlocks?.length || 0;

  return (
    <div className="min-h-screen py-6 px-4 relative z-10">

      {loading ? (
        <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-ink-subtle font-medium">加载中...</p>
        </div>
      ) : (
      <div className="max-w-2xl mx-auto">
        <div className={`${theme.bg} rounded-card p-6 text-white mb-6 shadow-2xl overflow-hidden relative`}>
          
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

            <div className="bg-primary-700/20 rounded-card p-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-btn bg-primary-600/40 flex items-center justify-center">
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
                <div className="bg-primary-700/20 rounded-btn px-4 py-2">
                  <div className="text-white/70 text-xs">今日进度</div>
                  <div className="font-semibold">{todayCompletionCount}/{todayTotalCount}</div>
                </div>
                <div className="bg-primary-700/20 rounded-btn px-4 py-2">
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
            <h2 className="text-xl font-bold text-ink flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-600" />
              今日计划
            </h2>
            <span className="text-sm text-ink-subtle">{selectedDay}</span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map((day) => {
              const isSelected = selectedDay === day;
              const dayTheme = themeColors[currentDaySchedule?.themeColor || 'blue'];
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`flex-shrink-0 px-4 py-2.5 rounded-btn text-sm font-medium transition-all duration-300 ${
                    isSelected 
                      ? `${dayTheme.bg} text-white shadow-card scale-105` 
                      : 'bg-surface-hover text-ink-subtle hover:bg-surface-hover'
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
                const planDate = calcCorrectDate(weeklyPlan?.data?.startDate, selectedDay);
                const past = isTimeBlockPast(block.time, planDate, today);
                const userCompleted = isBlockCompleted(planDate, i);
                const completed = effectivelyCompleted(block, i, planDate, today, (idx, pDate) => isBlockCompleted(pDate, idx));
                const blockTheme = block.type === 'class' ? themeColors.blue :
                                  block.type === 'study' ? themeColors.green :
                                  block.type === 'exam' ? themeColors.red :
                                  block.type === 'break' ? themeColors.orange :
                                  themeColors.purple;
                const isCheckable = block.type === 'study' && block.countable === true;

                return (
                  <div
                    key={i}
                    className={`flex items-start gap-4 p-4 rounded-card transition-all duration-300 ${
                      completed
                        ? 'bg-green-50 border border-green-200'
                        : past
                        ? 'bg-surface opacity-60'
                        : blockTheme.light
                    }`}
                  >
                    {isCheckable ? (
                      <button
                        onClick={() => handleToggleCompletion(selectedDay, i, block)}
                        disabled={completingIndex !== null}
                        className={`w-10 h-10 rounded-btn flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                          userCompleted
                            ? 'bg-green-500 text-white shadow-card scale-110'
                            : past
                            ? 'bg-surface-hover text-ink-muted'
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
                      <div className={`w-10 h-10 rounded-btn flex items-center justify-center flex-shrink-0 ${
                        completed ? 'bg-green-500' : 'bg-surface-hover'
                      }`}>
                        {completed ? (
                          <CheckCircle2 size={22} className="text-white" />
                        ) : (
                          <Circle size={22} className="text-ink-muted" />
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
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-surface rounded-card">
              <AlertCircle className="w-12 h-12 text-ink-muted mx-auto mb-3" />
              <p className="text-ink-subtle">暂无今日计划</p>
              <p className="text-ink-muted text-sm mt-1">请先在周计划页面创建计划</p>
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
}

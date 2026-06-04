import { useState, useEffect } from 'react'
import { Calendar, Target, CheckCircle2, Circle, Loader2, Sparkles, Clock } from 'lucide-react'
import { useWeeklyPlan } from '../hooks/useWeeklyPlan'
import { TimeBlock, themeColors, typeLabels, getTodayInfo, isTimeBlockPast, effectivelyCompleted, calcCorrectDate } from '../utils/planUtils'

export default function WeeklyPlanPage() {
  const {
    weeklyPlan,
    loading,
    completingIndex,
    handleToggleCompletion,
    isBlockCompleted,
    loadWeeklyPlan,
    loadCompletions,
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
    loadWeeklyPlan()
    loadCompletions()
  }, [loadWeeklyPlan, loadCompletions])

  const totalEnglishHours = weeklyPlan?.data?.weeklyReview?.totalEnglishHours || 0
  const targetHours = weeklyPlan?.data?.weeklyReview?.targetHours || 100
  const progress = Math.min(100, Math.round((totalEnglishHours / targetHours) * 100))

  const selectedDaySchedule = weeklyPlan?.data?.dailySchedule?.[selectedDay]
  const selectedDayTheme = selectedDaySchedule?.themeColor ? themeColors[selectedDaySchedule.themeColor] : themeColors.blue

  if (loading) {
    return (
      <div className="min-h-screen py-6 px-4 relative z-10">
        <div className="bg-decorations">
          <div className="bg-decoration-1"></div>
          <div className="bg-decoration-2"></div>
        </div>
        <div className="max-w-4xl mx-auto pb-32">
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mb-6 backdrop-blur">
              <Loader2 size={48} className="text-white animate-spin" />
            </div>
            <p className="text-white/80 text-lg font-medium">加载中...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!weeklyPlan) {
    return (
      <div className="min-h-screen py-6 px-4 relative z-10">
        <div className="bg-decorations">
          <div className="bg-decoration-1"></div>
          <div className="bg-decoration-2"></div>
        </div>
        <div className="max-w-4xl mx-auto pb-32">
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mb-6 backdrop-blur">
              <Calendar size={48} className="text-white/60" />
            </div>
            <p className="text-white/80 text-lg font-medium mb-2">暂无周计划</p>
            <p className="text-white/60">请先在管理后台创建周计划</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-6 px-4 relative z-10">
      <div className="bg-decorations">
        <div className="bg-decoration-1"></div>
        <div className="bg-decoration-2"></div>
        <div className="bg-decoration-3"></div>
      </div>

      <div className="max-w-4xl mx-auto pb-32">
        <div className={`${selectedDayTheme.bg} rounded-3xl p-8 text-white mb-8 shadow-2xl animate-fadeIn overflow-hidden relative`}>
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
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

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80 text-sm">总体进度</span>
                <span className="text-white font-semibold">{progress}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-white rounded-full h-3 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-600" />
              每日计划
            </h2>
            <span className="text-sm text-gray-500">{Object.keys(weeklyPlan.data?.dailySchedule || {}).length} 天</span>
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
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ${
                    isSelected ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <button
                    onClick={() => {
                      setSelectedDay(dayName)
                      setExpandedDay(isExpanded ? null : dayName)
                    }}
                    className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl ${dayTheme.bg} flex items-center justify-center text-white font-bold`}>
                        {dayName.slice(0, 1)}
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-800">{dayName}</div>
                        <div className="text-sm text-gray-500">{correctDateStr}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-500">完成进度</div>
                        <div className="font-semibold text-gray-800">{dayCompletedCount}/{dayTotalCount}</div>
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-6">
                      <div className="border-t pt-4">
                        <div className="flex items-center gap-2 mb-4">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          <span className="text-sm font-medium text-gray-700">今日重点: {dayData.focusGoal}</span>
                        </div>
                        
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-medium text-gray-700">英语目标: {dayData.englishTarget}h</span>
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
                                  className={`flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 card-hover ${
                                    completed
                                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200'
                                      : past
                                      ? 'bg-gray-50 opacity-70'
                                      : blockTheme.light
                                  } animate-fadeIn`}
                                  style={{ animationDelay: `${i * 0.08}s` }}
                                >
                                  {isCheckable ? (
                                    <button
                                      onClick={() => handleToggleCompletion(dayName, i, block)}
                                      disabled={completingIndex !== null}
                                      className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                                        userCompleted
                                          ? 'bg-green-500 text-white shadow-lg scale-110'
                                          : past
                                          ? 'bg-gray-200 text-gray-400'
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
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                                      completed ? 'bg-green-500' : 'bg-gray-100'
                                    }`}>
                                      {completed ? (
                                        <CheckCircle2 size={28} className="text-white" />
                                      ) : (
                                        <Circle size={28} className="text-gray-300" />
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
                              )
                            })
                          ) : (
                            <div className="text-center py-8 bg-gray-50 rounded-2xl">
                              <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-500">暂无时间安排</p>
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

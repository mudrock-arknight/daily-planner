import { useState, useEffect, useCallback } from 'react'
import { Calendar, Target, CheckCircle2, Circle, AlertCircle, Loader2, Sparkles, Clock } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface TimeBlock {
  time: string
  content: string
  detail?: string
  location?: string
  type: string
}

interface CompletionRecord {
  planDate: string
  timeblockIndex: number
  completed: boolean
  completedAt?: string | null
}

const themeColors: Record<string, { bg: string; text: string; border: string; gradient: string; light: string; dark: string }> = {
  blue: { bg: 'bg-gradient-to-br from-blue-400 to-indigo-500', text: 'text-blue-600', border: 'border-blue-200', gradient: 'from-blue-500 to-indigo-600', light: 'bg-blue-50', dark: 'bg-blue-600' },
  red: { bg: 'bg-gradient-to-br from-rose-400 to-red-500', text: 'text-rose-600', border: 'border-rose-200', gradient: 'from-rose-500 to-red-600', light: 'bg-rose-50', dark: 'bg-rose-600' },
  green: { bg: 'bg-gradient-to-br from-emerald-400 to-green-500', text: 'text-emerald-600', border: 'border-emerald-200', gradient: 'from-emerald-500 to-green-600', light: 'bg-emerald-50', dark: 'bg-emerald-600' },
  orange: { bg: 'bg-gradient-to-br from-amber-400 to-orange-500', text: 'text-amber-600', border: 'border-amber-200', gradient: 'from-amber-500 to-orange-600', light: 'bg-amber-50', dark: 'bg-amber-600' },
  purple: { bg: 'bg-gradient-to-br from-violet-400 to-purple-500', text: 'text-violet-600', border: 'border-violet-200', gradient: 'from-violet-500 to-purple-600', light: 'bg-violet-50', dark: 'bg-violet-600' },
  teal: { bg: 'bg-gradient-to-br from-teal-400 to-cyan-500', text: 'text-teal-600', border: 'border-teal-200', gradient: 'from-teal-500 to-cyan-600', light: 'bg-teal-50', dark: 'bg-teal-600' },
  pink: { bg: 'bg-gradient-to-br from-pink-400 to-fuchsia-500', text: 'text-pink-600', border: 'border-pink-200', gradient: 'from-pink-500 to-fuchsia-600', light: 'bg-pink-50', dark: 'bg-pink-600' },
}

const typeLabels = {
  class: '课程',
  study: '学习',
  exam: '考试',
  break: '休息',
  task: '任务',
}

export default function WeeklyPlanPage() {
  const [weeklyPlan, setWeeklyPlan] = useState<any>(null)
  const [selectedDay, setSelectedDay] = useState<string>('周一')
  const [expandedDay, setExpandedDay] = useState<string | null>('周一')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [completions, setCompletions] = useState<CompletionRecord[]>([])
  const [completingIndex, setCompletingIndex] = useState<number | null>(null)

  const today = new Date()
  const dayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const todayIndex = (today.getDay() + 6) % 7
  const todayName = dayNames[todayIndex]

  const loadWeeklyPlan = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const { data, error: fetchError } = await supabase
        .from('weekly_plans')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
      
      if (fetchError) {
        throw fetchError
      }
      
      if (data && data.length > 0) {
        setWeeklyPlan(data[0])
        if (data[0].data?.dailySchedule) {
          const days = Object.keys(data[0].data.dailySchedule)
          if (days.length > 0) {
            const initialDay = days.includes(todayName) ? todayName : days[0]
            setSelectedDay(initialDay)
            setExpandedDay(initialDay)
          }
        }
      }
    } catch (err) {
      console.error('Failed to load weekly plan:', err)
      setError('加载周计划失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }, [todayName])

  const loadCompletions = useCallback(async () => {
    const { data } = await supabase
      .from('daily_checkins')
      .select('*')
      .order('date', { ascending: false })
      .limit(30)

    if (data && data.length > 0) {
      const completionRecords: CompletionRecord[] = []
      data.forEach((checkin: any) => {
        if (checkin.data?.completions) {
          checkin.data.completions.forEach((comp: CompletionRecord) => {
            completionRecords.push({
              planDate: checkin.date,
              timeblockIndex: comp.timeblockIndex,
              completed: comp.completed,
              completedAt: comp.completedAt,
            })
          })
        }
      })
      setCompletions(completionRecords)
    }
  }, [])

  useEffect(() => {
    loadWeeklyPlan()
    loadCompletions()
  }, [loadWeeklyPlan, loadCompletions])

  async function handleToggleCompletion(dayName: string, index: number, block: TimeBlock) {
    if (completingIndex !== null) return
    
    setCompletingIndex(index)
    
    const planDate = weeklyPlan?.data?.dailySchedule?.[dayName]?.date
    if (!planDate) {
      setCompletingIndex(null)
      return
    }
    
    const existing = completions.find(c => c.planDate === planDate && c.timeblockIndex === index)
    const isCompleted = !existing?.completed
    
    try {
      const { data: checkinData } = await supabase
        .from('daily_checkins')
        .select('*')
        .eq('date', planDate)
        .limit(1)

      let completionsArray = []
      if (checkinData && checkinData.length > 0) {
        completionsArray = checkinData[0].data?.completions || []
      }

      const existingIndex = completionsArray.findIndex(
        (c: any) => c.timeblockIndex === index
      )
      
      const newCompletion = {
        planDate,
        timeblockIndex: index,
        timeblockTime: block.time,
        timeblockContent: block.content,
        timeblockType: block.type,
        completed: isCompleted,
        completedAt: isCompleted ? new Date().toISOString() : null,
      }

      if (existingIndex >= 0) {
        completionsArray[existingIndex] = newCompletion
      } else {
        completionsArray.push(newCompletion)
      }

      if (checkinData && checkinData.length > 0) {
        await supabase
          .from('daily_checkins')
          .update({
            data: { ...checkinData[0].data, completions: completionsArray }
          })
          .eq('date', planDate)
      } else {
        await supabase
          .from('daily_checkins')
          .insert({
            date: planDate,
            data: { completions: completionsArray }
          })
      }

      if (isCompleted) {
        setCompletions([...completions.filter(c => !(c.planDate === planDate && c.timeblockIndex === index)), newCompletion])
      } else {
        setCompletions(completions.filter(c => !(c.planDate === planDate && c.timeblockIndex === index)))
      }
    } catch (error) {
      console.error('保存完成状态失败:', error)
    } finally {
      setCompletingIndex(null)
    }
  }

  function isBlockCompleted(dayName: string, index: number): boolean {
    const planDate = weeklyPlan?.data?.dailySchedule?.[dayName]?.date
    if (!planDate) return false
    const completion = completions.find(c => c.planDate === planDate && c.timeblockIndex === index)
    return completion?.completed || false
  }

  function isTimeBlockPast(timeRange: string, blockDate: string) {
    const now = new Date()
    const [endTime] = timeRange.split('-')
    const [endHours, endMinutes] = endTime.split(':').map(Number)
    
    const blockDateObj = new Date(blockDate)
    blockDateObj.setHours(endHours, endMinutes, 0, 0)
    
    return now > blockDateObj
  }

  const totalEnglishHours = weeklyPlan?.data?.weeklyReview?.totalEnglishHours || 0
  const targetHours = weeklyPlan?.data?.weeklyReview?.targetHours || 100
  const progress = Math.min(100, Math.round((totalEnglishHours / targetHours) * 100))

  const selectedDaySchedule = weeklyPlan?.data?.dailySchedule?.[selectedDay]
  const selectedDayTheme = selectedDaySchedule?.themeColor ? themeColors[selectedDaySchedule.themeColor] : themeColors.blue
  
  const completedCount = selectedDaySchedule?.timeBlocks 
    ? selectedDaySchedule.timeBlocks.filter((_: any, i: number) => isBlockCompleted(selectedDay, i)).length 
    : 0
  const totalCount = selectedDaySchedule?.timeBlocks?.length || 0

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
            <p className="text-white/90 text-xl">加载中...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen py-6 px-4 relative z-10">
        <div className="bg-decorations">
          <div className="bg-decoration-1"></div>
          <div className="bg-decoration-2"></div>
        </div>
        <div className="max-w-4xl mx-auto pb-32">
          <div className="bg-white/90 backdrop-blur rounded-3xl p-8 text-center shadow-xl animate-fadeIn">
            <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={48} className="text-red-500" />
            </div>
            <h3 className="text-red-800 font-bold text-xl mb-3">出错了</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={loadWeeklyPlan}
              className="px-8 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-2xl font-semibold hover:from-red-600 hover:to-rose-700 transition-all shadow-lg hover:shadow-xl btn-hover"
            >
              重试
            </button>
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
          <div className="text-center py-32 bg-white/90 backdrop-blur rounded-3xl shadow-xl animate-fadeIn">
            <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={48} className="text-gray-400" />
            </div>
            <h3 className="text-gray-600 font-bold text-xl mb-3">暂无周计划</h3>
            <p className="text-gray-400">请添加周计划以查看详细安排</p>
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
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 animate-float"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 animate-float" style={{animationDelay: '1s'}}></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-white/80 text-sm mb-2 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  第 {weeklyPlan?.week?.replace('第', '').replace('周', '')} 周
                </div>
                <div className="text-4xl font-bold">本周学习计划</div>
              </div>
              <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur animate-pulse-slow">
                <Sparkles size={40} className="text-white" />
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div>
                <div className="text-white/70 text-sm mb-1">英语目标进度</div>
                <div className="text-4xl font-bold">{totalEnglishHours}/{targetHours}h</div>
              </div>
              <div className="flex-1">
                <div className="h-4 bg-white/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-1500 progress-bar" 
                    style={{ width: `${progress}%` }} 
                  />
                </div>
                <div className="text-right text-white/80 text-sm mt-2">{progress}%</div>
              </div>
            </div>
          </div>
        </div>

        {weeklyPlan?.data?.goals && (
          <div className="bg-white rounded-3xl p-8 shadow-xl mb-8 animate-fadeIn stagger-1">
            <h2 className="font-bold text-gray-800 text-2xl mb-6 flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                <Target className="text-purple-600" size={24} />
              </div>
              本周目标
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {weeklyPlan.data.goals.map((goal: any, idx: number) => (
                <div
                  key={goal.id}
                  className={`p-6 rounded-3xl border-2 transition-all duration-300 card-hover ${
                    goal.type === 'exam' ? 'bg-red-50 border-red-100' :
                    goal.type === 'study' ? 'bg-green-50 border-green-100' :
                    'bg-blue-50 border-blue-100'
                  } animate-fadeIn`}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="font-semibold text-gray-800 text-base flex-1">{goal.text}</span>
                    {goal.type === 'exam' && (
                      <span className="text-xs bg-red-200 text-red-700 px-3 py-1 rounded-full font-semibold">考试</span>
                    )}
                    {goal.type === 'study' && (
                      <span className="text-xs bg-green-200 text-green-700 px-3 py-1 rounded-full font-semibold">学习</span>
                    )}
                  </div>
                  {goal.progress !== undefined && (
                    <div className="mb-3">
                      <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1500 progress-bar ${
                            goal.type === 'exam' ? 'bg-gradient-to-r from-red-500 to-rose-500' :
                            goal.type === 'study' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                            'bg-gradient-to-r from-blue-500 to-indigo-500'
                          }`}
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                      <div className="text-sm text-gray-500 mt-2 text-right">{goal.progress}%</div>
                    </div>
                  )}
                  {goal.deadline && (
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      截止: {goal.deadline}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl p-8 shadow-xl mb-8 animate-fadeIn stagger-2">
          <h2 className="font-bold text-gray-800 text-2xl mb-6 flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <Calendar className="text-blue-600" size={24} />
            </div>
            每日概览
          </h2>
          <div className="grid grid-cols-7 gap-3">
            {dayNames.map((day, idx) => {
              const schedule = weeklyPlan?.data?.dailySchedule?.[day]
              const theme = schedule?.themeColor ? themeColors[schedule.themeColor] : themeColors.blue
              const isToday = day === todayName
              const isExpanded = expandedDay === day
              
              return (
                <button
                  key={day}
                  onClick={() => {
                    setSelectedDay(day)
                    setExpandedDay(day)
                  }}
                  className={`relative p-4 rounded-2xl text-center transition-all duration-300 card-hover ${
                    isExpanded
                      ? `${theme.bg} text-white shadow-lg scale-105`
                      : isToday
                      ? 'bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 ring-2 ring-blue-300'
                      : 'bg-gray-50 hover:bg-gray-100'
                  } animate-fadeIn`}
                  style={{ animationDelay: `${idx * 0.08}s` }}
                >
                  <div className="font-bold text-lg">{day}</div>
                  {schedule && (
                    <>
                      <div className={`text-xs mt-2 ${isExpanded ? 'font-semibold' : 'text-gray-600'}`}>
                        {schedule.date?.slice(5)}
                      </div>
                      <div className={`text-xs mt-1 ${isExpanded ? 'font-semibold' : 'text-gray-500'}`}>
                        {schedule.englishTarget}h
                      </div>
                    </>
                  )}
                  {isToday && !isExpanded && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-blue-500 rounded-full border-2 border-white shadow"></div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {selectedDay && selectedDaySchedule && (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 animate-fadeIn stagger-3">
            <div className={`bg-gradient-to-r ${
              selectedDaySchedule.themeColor 
                ? themeColors[selectedDaySchedule.themeColor].gradient 
                : themeColors.blue.gradient
            } p-8 text-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white/80 text-base mb-1">{selectedDay}</div>
                  <div className="text-3xl font-bold">
                    {selectedDaySchedule.date}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-4 py-2 bg-white/20 backdrop-blur rounded-2xl text-sm font-semibold">
                    {selectedDaySchedule.theme}
                  </span>
                  {totalCount > 0 && (
                    <span className="px-4 py-2 bg-white/20 backdrop-blur rounded-2xl text-sm font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      {completedCount}/{totalCount}
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-5 flex items-center gap-6 flex-wrap">
                <span className="text-white/90 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  英语目标: {selectedDaySchedule.englishTarget}h
                </span>
                <span className="text-white/40">|</span>
                <span className="text-white/90">
                  重点: {selectedDaySchedule.focusGoal}
                </span>
              </div>
            </div>

            <div className="p-8">
              {selectedDaySchedule.timeBlocks && selectedDaySchedule.timeBlocks.length > 0 ? (
                <div className="space-y-4">
                  {selectedDaySchedule.timeBlocks.map((block: TimeBlock, i: number) => {
                    const blockTheme = block.type === 'class' ? themeColors.blue : 
                                      block.type === 'study' ? themeColors.green : 
                                      block.type === 'exam' ? themeColors.red :
                                      block.type === 'break' ? themeColors.orange :
                                      themeColors.purple
                    const past = isTimeBlockPast(block.time, selectedDaySchedule.date)
                    const completed = isBlockCompleted(selectedDay, i)
                    
                    return (
                      <div
                        key={i}
                        className={`flex items-start gap-5 p-6 rounded-2xl transition-all duration-300 card-hover ${
                          completed 
                            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200'
                            : past 
                            ? 'bg-gray-50 opacity-70' 
                            : blockTheme.light
                        } animate-fadeIn`}
                        style={{ animationDelay: `${i * 0.08}s` }}
                      >
                        <button
                          onClick={() => handleToggleCompletion(selectedDay, i, block)}
                          disabled={completingIndex !== null}
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                            completed
                              ? 'bg-green-500 text-white shadow-lg scale-110'
                              : past
                              ? 'bg-gray-200 text-gray-400'
                              : `${blockTheme.dark} text-white cursor-pointer hover:scale-110`
                          } ${completingIndex === i ? 'animate-pulse' : ''}`}
                        >
                          {completed ? (
                            <CheckCircle2 size={28} />
                          ) : (
                            <Circle size={28} />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`text-lg font-bold ${blockTheme.text}`}>{block.time}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${blockTheme.light} ${blockTheme.text}`}>
                              {typeLabels[block.type as keyof typeof typeLabels] || '任务'}
                            </span>
                          </div>
                          <div className={`text-gray-800 text-lg font-medium ${completed ? 'line-through text-green-700' : ''}`}>
                            {block.content}
                          </div>
                          {block.detail && (
                            <div className="text-gray-600 mt-2">{block.detail}</div>
                          )}
                          {block.location && (
                            <div className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {block.location}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="text-gray-400" size={36} />
                  </div>
                  <p className="text-gray-500 text-lg">暂无当天时间块安排</p>
                </div>
              )}
            </div>
          </div>
        )}

        {weeklyPlan?.data?.notes && weeklyPlan.data.notes.length > 0 && (
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-8 border border-yellow-200 mb-8 animate-fadeIn stagger-4">
            <h2 className="font-bold text-yellow-800 text-2xl mb-6 flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center">
                <AlertCircle className="text-yellow-600" size={24} />
              </div>
              重要提醒
            </h2>
            <ul className="space-y-3">
              {weeklyPlan.data.notes.map((note: string, i: number) => (
                <li key={i} className="flex items-start gap-4 text-yellow-700 text-lg animate-fadeIn" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="w-8 h-8 bg-yellow-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="text-yellow-600" size={16} />
                  </div>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {weeklyPlan?.data?.weeklyReview && (
          <div className="space-y-6 animate-fadeIn stagger-5">
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <h3 className="font-bold text-gray-800 text-xl mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="text-blue-600" size={20} />
                </div>
                上周总结
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">{weeklyPlan.data.weeklyReview.lastWeekSummary}</p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <h3 className="font-bold text-gray-800 text-xl mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Target className="text-green-600" size={20} />
                </div>
                本周重点
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">{weeklyPlan.data.weeklyReview.thisWeekFocus}</p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <h3 className="font-bold text-gray-800 text-xl mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Sparkles className="text-purple-600" size={20} />
                </div>
                下周计划
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">{weeklyPlan.data.weeklyReview.nextWeekGoals}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { Calendar, Clock, Target, CheckCircle2, AlertCircle, Circle, BookOpen, GraduationCap, Coffee, Brain } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'

const themeColors: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', gradient: 'from-blue-500 to-blue-600' },
  red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', gradient: 'from-red-500 to-red-600' },
  green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200', gradient: 'from-green-500 to-green-600' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', gradient: 'from-orange-500 to-orange-600' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', gradient: 'from-purple-500 to-purple-600' },
  teal: { bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-200', gradient: 'from-teal-500 to-teal-600' },
  pink: { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200', gradient: 'from-pink-500 to-pink-600' },
}

const typeIcons = {
  class: BookOpen,
  study: Brain,
  exam: GraduationCap,
  break: Coffee,
  task: Target,
}

export default function HomePage() {
  const [currentTimeBlock, setCurrentTimeBlock] = useState<string>('')
  const [currentTask, setCurrentTask] = useState<string>('')
  const [weeklyPlan, setWeeklyPlan] = useState<any>(null)
  const [selectedDay, setSelectedDay] = useState<string>('')
  const { todos } = useStore()

  const today = new Date()
  const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const todayName = dayNames[today.getDay()]
  const formattedDate = `${today.getMonth() + 1}月${today.getDate()}日`

  useEffect(() => {
    loadWeeklyPlan()
    updateCurrentTask()
    
    const interval = setInterval(updateCurrentTask, 60000)
    return () => clearInterval(interval)
  }, [weeklyPlan, selectedDay])

  async function loadWeeklyPlan() {
    const { data } = await supabase
      .from('weekly_plans')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
    
    if (data && data.length > 0) {
      setWeeklyPlan(data[0])
      if (data[0].data && data[0].data.dailySchedule) {
        setSelectedDay(todayName)
      }
    }
  }

  function updateCurrentTask() {
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const totalMinutes = hours * 60 + minutes
    
    const currentDaySchedule = weeklyPlan?.data?.dailySchedule?.[selectedDay]
    const timeBlocks = currentDaySchedule?.timeBlocks

    let timeBlock = ''
    let task = ''

    if (timeBlocks && timeBlocks.length > 0) {
      let found = false
      for (const block of timeBlocks) {
        const [startStr, endStr] = block.time.split('-')
        const [startHours, startMinutes] = startStr.split(':').map(Number)
        const [endHours, endMinutes] = endStr.split(':').map(Number)
        const startTotal = startHours * 60 + startMinutes
        const endTotal = endHours * 60 + endMinutes

        if (totalMinutes >= startTotal && totalMinutes < endTotal) {
          timeBlock = block.time
          task = block.content
          found = true
          break
        }
      }
      
      if (!found) {
        if (totalMinutes < 480) { // 0-8:00
          timeBlock = '早晨'
          task = '准备起床，开始新的一天'
        } else if (totalMinutes < 720) { // 8:00-12:00
          timeBlock = '上午'
          task = '上午学习或活动时间'
        } else if (totalMinutes < 840) { // 12:00-14:00
          timeBlock = '午休时间'
          task = '吃午饭，适当休息'
        } else if (totalMinutes < 1080) { // 14:00-18:00
          timeBlock = '下午'
          task = '下午学习或活动时间'
        } else if (totalMinutes < 1260) { // 18:00-21:00
          timeBlock = '晚间'
          task = '晚间学习或休闲时间'
        } else { // 21:00以后
          timeBlock = '休息时间'
          task = '该休息了，保持良好作息'
        }
      }
    } else {
      if (totalMinutes < 480) {
        timeBlock = '早晨'
        task = '准备起床，开始新的一天'
      } else if (totalMinutes < 720) {
        timeBlock = '上午'
        task = '上午学习或活动时间'
      } else if (totalMinutes < 840) {
        timeBlock = '午休时间'
        task = '吃午饭，适当休息'
      } else if (totalMinutes < 1080) {
        timeBlock = '下午'
        task = '下午学习或活动时间'
      } else if (totalMinutes < 1260) {
        timeBlock = '晚间'
        task = '晚间学习或休闲时间'
      } else {
        timeBlock = '休息时间'
        task = '该休息了，保持良好作息'
      }
    }

    setCurrentTimeBlock(timeBlock)
    setCurrentTask(task)
  }

  const incompleteTodos = todos.filter(t => !t.completed).slice(0, 3)
  const currentDaySchedule = weeklyPlan?.data?.dailySchedule?.[selectedDay]
  const theme = currentDaySchedule?.themeColor ? themeColors[currentDaySchedule.themeColor] : themeColors.blue

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className={`bg-gradient-to-r ${theme.gradient} rounded-2xl p-6 text-white mb-6 shadow-lg`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-white/80 text-sm mb-1">{todayName}</div>
            <div className="text-3xl font-bold">{formattedDate}</div>
          </div>
          <Calendar size={48} className="text-white/80" />
        </div>
        
        <div className="bg-white/20 backdrop-blur rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="text-yellow-300" size={20} />
            <span className="text-white/80 text-sm">当前时段</span>
          </div>
          <div className="text-xl font-semibold mb-1">{currentTimeBlock}</div>
          <div className="text-white/80">{currentTask}</div>
        </div>

        {currentDaySchedule && (
          <div className="mt-4 flex items-center gap-2">
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">{currentDaySchedule.theme}</span>
            <span className="text-white/60 text-sm">|</span>
            <span className="text-white/80 text-sm">今日英语目标: {currentDaySchedule.englishTarget}h</span>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <Target className={theme.text} size={20} />
            每日计划
          </h2>
          <div className="flex gap-1 flex-wrap">
            {dayNames.map((day) => (
              <button
                key={day}
                onClick={() => {
                  setSelectedDay(day)
                }}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedDay === day 
                    ? `${theme.bg} ${theme.text} font-medium` 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {day.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {currentDaySchedule?.timeBlocks ? (
          <div className="space-y-2">
            {currentDaySchedule.timeBlocks.map((block: any, i: number) => {
              const Icon = typeIcons[block.type as keyof typeof typeIcons] || Target
              const isPast = isTimeBlockPast(block.time)
              
              return (
                <div 
                  key={i} 
                  className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
                    isPast ? 'bg-gray-50 opacity-60' : block.type === 'break' ? 'bg-yellow-50' : theme.bg
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    block.type === 'class' ? 'bg-blue-100 text-blue-600' :
                    block.type === 'study' ? 'bg-green-100 text-green-600' :
                    block.type === 'exam' ? 'bg-red-100 text-red-600' :
                    block.type === 'break' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    <Icon size={12} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-800">{block.time}</span>
                      {isPast && <span className="text-xs text-green-500">已完成</span>}
                    </div>
                    <div className="text-gray-700">{block.content}</div>
                    {block.detail && <div className="text-sm text-gray-500 mt-1">{block.detail}</div>}
                    {block.location && <div className="text-xs text-gray-400 mt-1">📍 {block.location}</div>}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <AlertCircle size={40} className="mx-auto mb-2 opacity-50" />
            <p>暂无今日计划</p>
            <p className="text-sm">可以添加周计划来生成每日安排</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <CheckCircle2 className="text-blue-500" size={20} />
            待办事项
          </h2>
          <span className="text-sm text-gray-500">{incompleteTodos.length} 项待完成</span>
        </div>
        
        {incompleteTodos.length > 0 ? (
          <div className="space-y-3">
            {incompleteTodos.map((todo) => (
              <div key={todo.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Circle className="text-gray-300" size={20} />
                <span className="flex-1 text-gray-700">{todo.title}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p>暂无待办事项</p>
          </div>
        )}
      </div>

      {weeklyPlan?.data?.goals && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Target className="text-purple-500" size={20} />
            本周目标
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {weeklyPlan.data.goals.map((goal: any) => (
              <div 
                key={goal.id} 
                className={`p-4 rounded-xl ${
                  goal.type === 'exam' ? 'bg-red-50 border border-red-100' :
                  goal.type === 'study' ? 'bg-green-50 border border-green-100' :
                  'bg-blue-50 border border-blue-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800 text-sm">{goal.text}</span>
                  {goal.type === 'exam' && <span className="text-xs bg-red-200 text-red-700 px-2 py-0.5 rounded">考试</span>}
                  {goal.type === 'study' && <span className="text-xs bg-green-200 text-green-700 px-2 py-0.5 rounded">学习</span>}
                </div>
                {goal.progress !== undefined && (
                  <div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          goal.type === 'exam' ? 'bg-red-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                    {goal.totalHours && (
                      <div className="text-xs text-gray-500 mt-1">目标: {goal.totalHours}h</div>
                    )}
                  </div>
                )}
                {goal.deadline && (
                  <div className="text-xs text-gray-500 mt-2">截止: {goal.deadline}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function isTimeBlockPast(timeRange: string): boolean {
  const now = new Date()
  const [, endTime] = timeRange.split('-')
  const [hours, minutes] = endTime.split(':').map(Number)
  const blockEnd = new Date()
  blockEnd.setHours(hours, minutes, 0, 0)
  return now > blockEnd
}

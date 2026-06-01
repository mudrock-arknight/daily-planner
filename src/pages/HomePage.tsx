import { useState, useEffect } from 'react'
import { Calendar, Clock, Target, CheckCircle2, AlertCircle, Circle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'

export default function HomePage() {
  const [currentTimeBlock, setCurrentTimeBlock] = useState<string>('')
  const [currentTask, setCurrentTask] = useState<string>('')
  const [todaysSchedule, setTodaysSchedule] = useState<any>(null)
  const [weeklyPlan, setWeeklyPlan] = useState<any>(null)
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
  }, [weeklyPlan])

  async function loadWeeklyPlan() {
    const { data } = await supabase
      .from('weekly_plans')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
    
    if (data && data.length > 0) {
      setWeeklyPlan(data[0])
      if (data[0].data && data[0].data.dailySchedule) {
        setTodaysSchedule(data[0].data.dailySchedule[todayName])
      }
    }
  }

  function updateCurrentTask() {
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const totalMinutes = hours * 60 + minutes

    let timeBlock = ''
    let task = ''

    if (totalMinutes < 510) { // 0-8:30
      timeBlock = '早晨'
      task = '准备起床，开始新的一天'
    } else if (totalMinutes < 600) { // 8:30-10:00
      timeBlock = '上午学习时间'
      task = todaysSchedule?.classes?.[0] || '进行晨间学习'
    } else if (totalMinutes < 720) { // 10:00-12:00
      timeBlock = '上午第二时段'
      task = todaysSchedule?.classes?.[1] || '继续学习或上课'
    } else if (totalMinutes < 840) { // 12:00-14:00
      timeBlock = '午休时间'
      task = '吃午饭，适当休息'
    } else if (totalMinutes < 990) { // 14:00-16:30
      timeBlock = '下午学习时间'
      task = todaysSchedule?.classes?.[2] || '专注学习中'
    } else if (totalMinutes < 1110) { // 16:30-18:30
      timeBlock = '傍晚'
      task = '休息一下，准备晚饭'
    } else if (totalMinutes < 1260) { // 18:30-21:00
      timeBlock = '晚间学习时间'
      task = todaysSchedule?.tasks?.[0] || '晚间学习时间'
    } else if (totalMinutes < 1320) { // 21:00-22:00
      timeBlock = '睡前准备'
      task = '整理一天，准备休息'
    } else { // 22:00以后
      timeBlock = '睡眠时间'
      task = '该睡觉了，保持良好作息'
    }

    setCurrentTimeBlock(timeBlock)
    setCurrentTask(task)
  }

  const incompleteTodos = todos.filter(t => !t.completed).slice(0, 3)

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-blue-100 text-sm mb-1">{todayName}</div>
            <div className="text-3xl font-bold">{formattedDate}</div>
          </div>
          <Calendar size={48} className="text-blue-200" />
        </div>
        
        <div className="bg-white/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="text-yellow-300" size={20} />
            <span className="text-blue-100 text-sm">当前时段</span>
          </div>
          <div className="text-xl font-semibold mb-1">{currentTimeBlock}</div>
          <div className="text-blue-100">{currentTask}</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 mb-6">
        <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Target className="text-green-500" size={20} />
          今日任务
        </h2>
        
        {todaysSchedule ? (
          <div className="space-y-4">
            {todaysSchedule.classes && todaysSchedule.classes.length > 0 && (
              <div>
                <div className="text-sm text-gray-500 mb-2">📚 今日课程</div>
                <div className="space-y-2">
                  {todaysSchedule.classes.map((cls: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-gray-700">
                      <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {i + 1}
                      </span>
                      {cls}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {todaysSchedule.tasks && todaysSchedule.tasks.length > 0 && (
              <div>
                <div className="text-sm text-gray-500 mb-2">✅ 今日待办</div>
                <div className="space-y-2">
                  {todaysSchedule.tasks.map((task: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-gray-700">
                      <CheckCircle2 className="text-gray-300" size={18} />
                      {task}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {todaysSchedule.focusTime && (
              <div className="bg-yellow-50 rounded-lg p-3">
                <div className="text-sm text-yellow-700 font-medium">⏰ 专注时间段</div>
                <div className="text-yellow-600 text-sm">{todaysSchedule.focusTime}</div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <AlertCircle size={40} className="mx-auto mb-2 opacity-50" />
            <p>暂无今日计划</p>
            <p className="text-sm">可以添加周计划来生成每日安排</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 mb-6">
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
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Target className="text-purple-500" size={20} />
            本周目标
          </h2>
          <div className="space-y-3">
            {weeklyPlan.data.goals.slice(0, 4).map((goal: any) => (
              <div key={goal.id} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="text-gray-700">{goal.text}</div>
                  {goal.progress !== undefined && (
                    <div className="mt-1">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-500 rounded-full transition-all"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                {goal.deadline && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {goal.deadline}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

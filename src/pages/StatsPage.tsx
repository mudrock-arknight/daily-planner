import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Target, AlertCircle, Calendar, BookOpen, Flame } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface DailyData {
  date: string
  studyHours: number
  checkinCount: number
}

interface GoalProgress {
  text: string
  type: string
  progress: number
  deadline?: string
}

export default function StatsPage() {
  const [streakDays, setStreakDays] = useState(0)
  const [totalCheckinDays, setTotalCheckinDays] = useState(0)
  const [totalStudyHours, setTotalStudyHours] = useState(0)
  const [weeklyData, setWeeklyData] = useState<DailyData[]>([])
  const [goals, setGoals] = useState<GoalProgress[]>([])
  const [weeklyPlan, setWeeklyPlan] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [lastWeekHours, setLastWeekHours] = useState(0)
  const [thisWeekHours, setThisWeekHours] = useState(0)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    setLoading(true)
    try {
      const { data: checkinData } = await supabase
        .from('daily_checkins')
        .select('*')
        .order('date', { ascending: false })

      const { data: planData } = await supabase
        .from('weekly_plans')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)

      if (planData && planData.length > 0) {
        setWeeklyPlan(planData[0])
        if (planData[0].data?.goals) {
          setGoals(planData[0].data.goals)
        }
      }

      if (checkinData && checkinData.length > 0) {
        let totalHours = 0
        checkinData.forEach(checkin => {
          if (checkin.data?.studyHours) {
            totalHours += checkin.data.studyHours
          }
        })

        const streak = calculateStreak(checkinData.map(d => d.date))
        const days = checkinData.length

        const weekly: DailyData[] = []
        const today = new Date()
        let lastWeek = 0
        let thisWeek = 0
        
        for (let i = 13; i >= 0; i--) {
          const date = new Date(today)
          date.setDate(date.getDate() - i)
          const dateStr = date.toISOString().split('T')[0]
          const dayData = checkinData.find(d => d.date === dateStr)
          const hours = dayData?.data?.studyHours || 0
          weekly.push({
            date: dateStr,
            studyHours: hours,
            checkinCount: dayData ? 1 : 0,
          })
          
          if (i > 7) {
            lastWeek += hours
          } else {
            thisWeek += hours
          }
        }

        setStreakDays(streak)
        setTotalCheckinDays(days)
        setTotalStudyHours(totalHours)
        setWeeklyData(weekly)
        setLastWeekHours(lastWeek)
        setThisWeekHours(thisWeek)
      }
    } catch (error) {
      console.error('加载统计数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  function calculateStreak(dates: string[]): number {
    if (dates.length === 0) return 0
    
    const sortedDates = [...dates].sort().reverse()
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    
    if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
      return 0
    }
    
    let streak = 1
    for (let i = 1; i < sortedDates.length; i++) {
      const current = new Date(sortedDates[i - 1])
      const prev = new Date(sortedDates[i])
      const diffDays = (current.getTime() - prev.getTime()) / 86400000
      
      if (diffDays === 1) {
        streak++
      } else {
        break
      }
    }
    
    return streak
  }

  const maxHours = weeklyData.length > 0 ? Math.max(...weeklyData.map(d => d.studyHours), 1) : 1
  const englishTarget = weeklyPlan?.data?.weeklyReview?.targetHours || 100
  const englishProgress = Math.min(Math.round((totalStudyHours / englishTarget) * 100), 100)
  const hoursRemaining = Math.max(0, englishTarget - totalStudyHours)
  const daysUntilCET6 = getDaysUntilCET6()

  function getDaysUntilCET6(): number {
    const cet6Date = new Date('2025-06-14')
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    cet6Date.setHours(0, 0, 0, 0)
    const diff = cet6Date.getTime() - today.getTime()
    return Math.max(0, Math.ceil(diff / 86400000))
  }

  const trendChange = lastWeekHours > 0 ? Math.round(((thisWeekHours - lastWeekHours) / lastWeekHours) * 100) : 0

  return (
    <div className="min-h-screen py-6 px-4 relative z-10">
      <div className="bg-decorations">
        <div className="bg-decoration-1"></div>
        <div className="bg-decoration-2"></div>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg">
            <BarChart3 className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">学习统计</h1>
            <p className="text-sm text-gray-500">追踪你的成长轨迹</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">加载数据中...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-5 shadow-sm border border-orange-100">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="text-orange-500" size={20} />
                  <span className="text-sm text-gray-500">连续打卡</span>
                </div>
                <div className="text-3xl font-bold text-orange-600">{streakDays} 天</div>
                <div className="text-xs text-orange-400 mt-1">
                  {streakDays >= 7 ? '太棒了！' : streakDays >= 3 ? '继续保持！' : '加油！'}
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 shadow-sm border border-green-100">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="text-green-500" size={20} />
                  <span className="text-sm text-gray-500">累计打卡</span>
                </div>
                <div className="text-3xl font-bold text-green-600">{totalCheckinDays} 天</div>
                <div className="text-xs text-green-400 mt-1">继续坚持</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 shadow-sm border border-blue-100 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="text-blue-500" size={20} />
                  <span className="font-semibold text-gray-800">英语学习总览</span>
                </div>
                <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium">
                  六级倒计时 {daysUntilCET6} 天
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{totalStudyHours.toFixed(1)}h</div>
                  <div className="text-xs text-gray-500">已学习</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">{hoursRemaining.toFixed(1)}h</div>
                  <div className="text-xs text-gray-500">剩余目标</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">{englishTarget}h</div>
                  <div className="text-xs text-gray-500">目标时长</div>
                </div>
              </div>
              
              <div className="h-3 bg-white rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000"
                  style={{ width: `${englishProgress}%` }}
                />
              </div>
              <div className="text-right text-sm text-blue-600 mt-2 font-medium">{englishProgress}% 完成</div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="text-purple-500" size={20} />
                  <h3 className="font-semibold text-gray-800">学习趋势</h3>
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  trendChange >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {trendChange >= 0 ? '↑' : '↓'} {Math.abs(trendChange)}%
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-gray-600">{lastWeekHours.toFixed(1)}h</div>
                  <div className="text-xs text-gray-400">上周</div>
                </div>
                <div className="bg-blue-50 rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-blue-600">{thisWeekHours.toFixed(1)}h</div>
                  <div className="text-xs text-blue-400">本周</div>
                </div>
              </div>
              
              <div className="flex items-end justify-around h-32 gap-2">
                {weeklyData.slice(-7).map((day, i) => {
                  const date = new Date(day.date)
                  const dayName = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()]
                  const height = maxHours > 0 ? (day.studyHours / maxHours) * 100 : 0
                  const isToday = day.date === new Date().toISOString().split('T')[0]
                  
                  return (
                    <div key={i} className="flex flex-col items-center gap-1 flex-1">
                      <div className="w-full relative">
                        <div 
                          className={`w-full rounded-t-lg transition-all ${
                            isToday 
                              ? 'bg-gradient-to-t from-blue-500 to-cyan-400' 
                              : 'bg-gradient-to-t from-gray-300 to-gray-400'
                          }`}
                          style={{ height: `${Math.max(height, 5)}%` }}
                        />
                      </div>
                      <span className={`text-xs ${isToday ? 'font-bold text-blue-600' : 'text-gray-500'}`}>
                        周{dayName}
                      </span>
                      <span className="text-xs text-gray-400">{day.studyHours}h</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {goals.length > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="text-rose-500" size={20} />
                  <h3 className="font-semibold text-gray-800">目标进度</h3>
                </div>
                <div className="space-y-4">
                  {goals.slice(0, 5).map((goal, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-gray-600 flex items-center gap-2">
                          {goal.type === 'exam' && <span className="w-2 h-2 bg-red-400 rounded-full"></span>}
                          {goal.type === 'study' && <span className="w-2 h-2 bg-green-400 rounded-full"></span>}
                          {goal.text}
                        </span>
                        <span className={`font-medium ${
                          goal.type === 'exam' ? 'text-red-600' : 
                          goal.type === 'study' ? 'text-green-600' : 'text-blue-600'
                        }`}>{goal.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            goal.type === 'exam' ? 'bg-gradient-to-r from-red-400 to-rose-500' :
                            goal.type === 'study' ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                            'bg-gradient-to-r from-blue-400 to-indigo-500'
                          }`}
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                      {goal.deadline && (
                        <div className="text-xs text-gray-400 mt-1">截止: {goal.deadline}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {totalCheckinDays === 0 && (
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center">
                    <AlertCircle className="text-yellow-600" size={28} />
                  </div>
                  <div>
                    <p className="text-yellow-800 font-semibold text-lg">开始你的学习记录</p>
                    <p className="text-sm text-yellow-600 mt-1">去打卡页面记录每天的学习，让数据告诉你进步了多少！</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

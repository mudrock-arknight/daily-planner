import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Target, AlertCircle, Calendar, BookOpen, Flame, CheckCircle2, PieChart, Sparkles } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface DailyData {
  date: string
  studyHours: number
  checkinCount: number
  completedBlocks: number
  totalBlocks: number
}

interface GoalProgress {
  text: string
  type: string
  progress: number
  deadline?: string
}

interface CompletionRecord {
  planDate: string
  timeblockIndex: number
  timeblockType: string
  timeblockContent?: string
  completed: boolean
}

interface LongTermGoal {
  id: string
  text: string
  category: string
  keywords?: string[]
  progress: number
  totalHours?: number
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
  const [completions, setCompletions] = useState<CompletionRecord[]>([])
  const [weeklyCompletionRate, setWeeklyCompletionRate] = useState(0)
  const [typeCompletionRates, setTypeCompletionRates] = useState<Record<string, { completed: number; total: number }>>({})
  const [dailyCompletionRates, setDailyCompletionRates] = useState<{ date: string; rate: number }[]>([])
  const [longTermGoals, setLongTermGoals] = useState<LongTermGoal[]>([])

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
        .limit(1000)

      const { data: planData } = await supabase
        .from('weekly_plans')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1000)

      if (planData && planData.length > 0) {
        setWeeklyPlan(planData[0])
        if (planData[0].data?.goals) {
          setGoals(planData[0].data.goals)
        }
        if (planData[0].data?.longTermGoals) {
          setLongTermGoals(planData[0].data.longTermGoals)
        }
      }

      // 收集所有学习类型且可统计的完成记录
      const allCompletions: CompletionRecord[] = []
      // 收集所有学习时间块（用于长期目标统计）
      const studyBlocksWithContent: { content: string; planDate: string }[] = []
      
      if (checkinData && checkinData.length > 0) {
        let totalHours = 0
        checkinData.forEach(checkin => {
          if (checkin.data?.studyHours) {
            totalHours += checkin.data.studyHours
          }
          if (checkin.data?.completions) {
            checkin.data.completions.forEach((comp: any) => {
              // 只添加学习类型且可统计的时间块（或者如果无法判断countable，默认学习类型都统计）
              // 从weekly plan中获取对应时间块的countable属性
              let isStudyAndCountable = comp.timeblockType === 'study'
              
              // 如果有weekly plan，尝试从daily schedule中获取该时间块的详细信息
              if (planData && planData.length > 0 && planData[0].data?.dailySchedule) {
                const dailySchedule = planData[0].data.dailySchedule
                // 找到对应的日期和时间块
                for (const dayName of Object.keys(dailySchedule)) {
                  const daySchedule = dailySchedule[dayName]
                  if (daySchedule.date === checkin.date && daySchedule.timeBlocks) {
                    const block = daySchedule.timeBlocks[comp.timeblockIndex]
                    if (block) {
                      isStudyAndCountable = block.type === 'study' && block.countable !== false
                      // 收集学习内容用于长期目标统计
                      if (block.type === 'study' && comp.completed) {
                        studyBlocksWithContent.push({
                          content: block.content || comp.timeblockContent || '',
                          planDate: checkin.date
                        })
                      }
                      break
                    }
                  }
                }
              } else if (comp.timeblockType === 'study') {
                // 如果没有weekly plan，默认学习类型都算
                isStudyAndCountable = true
                if (comp.completed && comp.timeblockContent) {
                  studyBlocksWithContent.push({
                    content: comp.timeblockContent,
                    planDate: checkin.date
                  })
                }
              }
              
              if (isStudyAndCountable) {
                allCompletions.push({
                  planDate: checkin.date,
                  timeblockIndex: comp.timeblockIndex,
                  timeblockType: comp.timeblockType || 'study',
                  timeblockContent: comp.timeblockContent,
                  completed: comp.completed,
                })
              }
            })
          }
        })
        setCompletions(allCompletions)

        // 计算长期目标时间统计
        const goalsWithHours = calculateLongTermGoalHours(studyBlocksWithContent, planData?.[0]?.data?.longTermGoals || [])
        setLongTermGoals(goalsWithHours)

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
          const dayCompletions = allCompletions.filter(c => c.planDate === dateStr && c.completed)
          const totalBlocks = allCompletions.filter(c => c.planDate === dateStr).length
          
          weekly.push({
            date: dateStr,
            studyHours: hours,
            checkinCount: dayData ? 1 : 0,
            completedBlocks: dayCompletions.length,
            totalBlocks: totalBlocks,
          })
          
          if (i > 7) {
            lastWeek += hours
          } else {
            thisWeek += hours
          }
        }

        const completionRate = allCompletions.length > 0
          ? Math.round((allCompletions.filter(c => c.completed).length / allCompletions.length) * 100)
          : 0
        setWeeklyCompletionRate(completionRate)

        const typeStats: Record<string, { completed: number; total: number }> = {}
        allCompletions.forEach(c => {
          if (!typeStats[c.timeblockType]) {
            typeStats[c.timeblockType] = { completed: 0, total: 0 }
          }
          typeStats[c.timeblockType].total++
          if (c.completed) {
            typeStats[c.timeblockType].completed++
          }
        })
        setTypeCompletionRates(typeStats)

        const dailyRates = weekly.map(d => ({
          date: d.date,
          rate: d.totalBlocks > 0 ? Math.round((d.completedBlocks / d.totalBlocks) * 100) : 0
        }))
        setDailyCompletionRates(dailyRates)

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

  function calculateLongTermGoalHours(studyBlocks: { content: string; planDate: string }[], goals: any[]): LongTermGoal[] {
    return goals.map(goal => {
      // 从目标文本中提取关键词（或者使用预设的keywords字段）
      const keywords = goal.keywords || [goal.text.split(/[,，\s]+/)[0]] // 默认取第一个词作为关键词
      
      let matchCount = 0
      studyBlocks.forEach(block => {
        const content = block.content.toLowerCase()
        const hasMatch = keywords.some((keyword: string) => 
          content.includes(keyword.toLowerCase())
        )
        if (hasMatch) {
          matchCount++
        }
      })
      
      // 假设每个学习时间块平均1小时（简化处理）
      const totalHours = matchCount * 1
      
      return {
        ...goal,
        totalHours: totalHours
      }
    })
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

  const typeLabels: Record<string, string> = {
    class: '课程',
    study: '学习',
    exam: '考试',
    break: '休息',
    task: '任务',
  }

  const typeColors: Record<string, string> = {
    class: 'from-blue-500 to-indigo-500',
    study: 'from-green-500 to-emerald-500',
    exam: 'from-red-500 to-rose-500',
    break: 'from-amber-500 to-orange-500',
    task: 'from-violet-500 to-purple-500',
  }

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

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 shadow-sm border border-green-100 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="text-green-500" size={20} />
                  <span className="font-semibold text-gray-800">时间块完成率</span>
                </div>
                <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full font-medium">
                  {weeklyCompletionRate}% 完成
                </span>
              </div>
              
              <div className="h-3 bg-white rounded-full overflow-hidden mb-4">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-1000"
                  style={{ width: `${weeklyCompletionRate}%` }}
                />
              </div>

              {Object.keys(typeCompletionRates).length > 0 && (
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {Object.entries(typeCompletionRates).map(([type, stats]) => {
                    const rate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
                    return (
                      <div key={type} className="bg-white/80 rounded-xl p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">{typeLabels[type] || type}</span>
                          <span className="text-sm font-medium text-gray-700">{rate}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${typeColors[type] || 'from-gray-400 to-gray-500'} rounded-full`}
                            style={{ width: `${rate}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-400 mt-1">{stats.completed}/{stats.total}</div>
                      </div>
                    )
                  })}
                </div>
              )}
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

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <PieChart className="text-pink-500" size={20} />
                <h3 className="font-semibold text-gray-800">每日完成率</h3>
              </div>
              
              <div className="space-y-3">
                {dailyCompletionRates.slice(-7).reverse().map((day, i) => {
                  const date = new Date(day.date)
                  const dayLabel = `${date.getMonth() + 1}/${date.getDate()}`
                  const dayName = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()]
                  const isToday = day.date === new Date().toISOString().split('T')[0]
                  
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-sm text-gray-500 w-16">{dayLabel} {dayName}</span>
                      <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            isToday 
                              ? 'bg-gradient-to-r from-pink-500 to-rose-500' 
                              : day.rate >= 80 
                              ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                              : day.rate >= 50
                              ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                              : 'bg-gradient-to-r from-gray-300 to-gray-400'
                          }`}
                          style={{ width: `${day.rate}%` }}
                        />
                      </div>
                      <span className={`text-sm font-medium w-12 text-right ${
                        isToday ? 'text-pink-600' : 'text-gray-600'
                      }`}>
                        {day.rate}%
                      </span>
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

        {longTermGoals.length > 0 && (
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 shadow-sm border border-indigo-100 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-indigo-600" size={20} />
              <h3 className="font-semibold text-gray-800">长期目标时间统计</h3>
            </div>
            <div className="space-y-3">
              {longTermGoals.map((goal) => {
                const categoryColors: Record<string, string> = {
                  language: 'from-blue-400 to-indigo-500',
                  tech: 'from-green-400 to-emerald-500',
                  finance: 'from-amber-400 to-orange-500',
                  skill: 'from-purple-400 to-pink-500',
                  hobby: 'from-rose-400 to-red-500'
                }
                const categoryBg: Record<string, string> = {
                  language: 'bg-blue-50',
                  tech: 'bg-green-50',
                  finance: 'bg-amber-50',
                  skill: 'bg-purple-50',
                  hobby: 'bg-rose-50'
                }
                const categoryText: Record<string, string> = {
                  language: 'text-blue-600',
                  tech: 'text-green-600',
                  finance: 'text-amber-600',
                  skill: 'text-purple-600',
                  hobby: 'text-rose-600'
                }
                const categoryNames: Record<string, string> = {
                  language: '语言',
                  tech: '技术',
                  finance: '金融',
                  skill: '技能',
                  hobby: '爱好'
                }
                
                return (
                  <div 
                    key={goal.id} 
                    className={`p-4 rounded-xl ${categoryBg[goal.category] || 'bg-gray-50'} border border-transparent transition-all duration-300`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-8 rounded-full bg-gradient-to-b ${categoryColors[goal.category] || 'bg-gray-400'}`}></span>
                        <span className="font-medium text-gray-700">{goal.text}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${categoryBg[goal.category] || 'bg-gray-100'} ${categoryText[goal.category] || 'text-gray-600'}`}>
                          {categoryNames[goal.category] || '其他'}
                        </span>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-800">{goal.totalHours?.toFixed(1) || 0}h</div>
                          <div className="text-xs text-gray-500">已投入</div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>进度</span>
                        <span>{goal.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full bg-gradient-to-r ${categoryColors[goal.category] || 'bg-gray-400'}`}
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {totalCheckinDays === 0 && completions.length === 0 && (
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

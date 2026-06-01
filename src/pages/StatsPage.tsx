import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Clock, Target, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface WeeklyData {
  date: string
  studyHours: number
  completedTasks: number
}

export default function StatsPage() {
  const [checkinDays, setCheckinDays] = useState(0)
  const [totalStudyHours, setTotalStudyHours] = useState(0)
  const [averageDailyHours, setAverageDailyHours] = useState(0)
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('daily_checkins')
        .select('*')
        .order('date', { ascending: false })

      if (data && data.length > 0) {
        const days = data.length
        let total = 0
        
        data.forEach(checkin => {
          if (checkin.data?.studyHours) {
            total += checkin.data.studyHours
          }
        })
        
        const average = days > 0 ? total / days : 0

        const weekly: WeeklyData[] = []
        for (let i = 6; i >= 0; i--) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          const dateStr = date.toISOString().split('T')[0]
          const dayData = data.find(d => d.date === dateStr)
          weekly.push({
            date: dateStr,
            studyHours: dayData?.data?.studyHours || 0,
            completedTasks: dayData?.data?.completedTasks || 0,
          })
        }

        setCheckinDays(days)
        setTotalStudyHours(total)
        setAverageDailyHours(average)
        setWeeklyData(weekly)
      }
    } catch (error) {
      console.error('加载统计数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const maxHours = weeklyData.length > 0 ? Math.max(...weeklyData.map(d => d.studyHours), 1) : 1
  const englishProgress = Math.min(Math.round((totalStudyHours / 100) * 100), 100)

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="text-pink-600" size={28} />
        <h1 className="text-2xl font-bold text-gray-800">数据统计</h1>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">加载数据中...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="text-green-500" size={20} />
                <span className="text-sm text-gray-500">打卡天数</span>
              </div>
              <div className="text-3xl font-bold text-gray-800">{checkinDays}</div>
              <div className="text-xs text-green-600 mt-1">累计打卡</div>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="text-blue-500" size={20} />
                <span className="text-sm text-gray-500">学习时长</span>
              </div>
              <div className="text-3xl font-bold text-gray-800">{totalStudyHours.toFixed(1)}h</div>
              <div className="text-xs text-blue-600 mt-1">平均每天 {averageDailyHours.toFixed(1)}h</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">近7天学习时长</h3>
            <div className="flex items-end justify-around h-40 gap-2">
              {weeklyData.map((day, i) => {
                const date = new Date(day.date)
                const dayName = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()]
                const height = maxHours > 0 ? (day.studyHours / maxHours) * 100 : 0
                
                return (
                  <div key={i} className="flex flex-col items-center gap-2 flex-1">
                    <div 
                      className="w-full bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-lg transition-all" 
                      style={{ height: `${Math.max(height, 5)}%` }} 
                    />
                    <span className="text-xs text-gray-500">{dayName}</span>
                    <span className="text-xs text-gray-400">{day.studyHours}h</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Target className="text-purple-500" size={20} />
              <h3 className="font-semibold text-gray-800">本周目标进度</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">英语学习</span>
                  <span className="font-medium text-blue-600">{englishProgress}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${englishProgress}%` }} />
                </div>
                <div className="text-xs text-gray-400 mt-1">目标: 100小时</div>
              </div>
            </div>
          </div>

          {checkinDays === 0 && (
            <div className="mt-6 bg-yellow-50 rounded-2xl p-5 border border-yellow-200">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-yellow-600" size={24} />
                <div>
                  <p className="text-yellow-800 font-medium">暂无打卡数据</p>
                  <p className="text-sm text-yellow-600">去打卡页面记录你的学习吧！</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

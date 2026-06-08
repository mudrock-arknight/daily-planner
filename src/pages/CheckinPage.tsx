import { useState, useEffect } from 'react'
import { Save, Star, Moon, Sun, CheckCircle2, Calendar, BookOpen } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { showToast, ToastContainer } from '../components/Toast'

export default function CheckinPage() {
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]

  const [checkin, setCheckin] = useState<{
    id?: string
    date: string
    sleepTime: string
    wakeTime: string
    moodScore: number
    studyHours: number
    exercised: boolean
    waterEnough: boolean
  }>({
    date: todayStr,
    sleepTime: '',
    wakeTime: '',
    moodScore: 3,
    studyHours: 0,
    exercised: false,
    waterEnough: false,
  })

  useEffect(() => {
    loadTodayCheckin()
  }, [])

  async function loadTodayCheckin() {
    const { data } = await supabase
      .from('daily_checkins')
      .select('*')
      .eq('date', todayStr)
      .single()
    
    if (data && data.data) {
      // 使用函数式更新避免闭包导致的 stale state
      setCheckin(prev => ({ ...prev, ...data.data, id: data.id }))
    }
  }

  async function handleSave() {
    // 只保存打卡相关字段，不包含 id/date 等元数据
    const { id, date, ...checkinData } = checkin
    
    if (checkin.id) {
      await supabase
        .from('daily_checkins')
        .update({ data: checkinData })
        .eq('id', checkin.id)
    } else {
      await supabase
        .from('daily_checkins')
        .insert({ date: todayStr, data: checkinData })
        .select()
        .single()
    }
    
    showToast('保存成功！', 'success')
  }

  return (
    <div className="min-h-screen py-6 px-4">
      <div className="max-w-2xl mx-auto pb-32">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-600 rounded-card mb-4 shadow-card">
            <Calendar className="text-white" size={40} />
          </div>
          <h1 className="text-4xl font-bold text-ink mb-2">每日打卡</h1>
          <p className="text-ink-subtle">记录美好的一天</p>
        </div>

        <div className="space-y-6">
          <div className="bg-surface-card rounded-card p-8 shadow-card">
            <h2 className="font-bold text-ink text-xl mb-6 flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-600/10 rounded-card flex items-center justify-center">
                <Moon className="text-primary-600" size={24} />
              </div>
              作息记录
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-semibold text-ink mb-3">
                  昨晚入睡时间
                </label>
                <input
                  type="time"
                  value={checkin.sleepTime}
                  onChange={(e) => setCheckin({ ...checkin, sleepTime: e.target.value })}
                  className="w-full px-6 py-4 text-lg border-2 border-border rounded-card focus:outline-none focus:ring-4 focus:ring-primary-600/10 focus:border-primary-600 transition-all"
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-ink mb-3">
                  今天起床时间
                </label>
                <input
                  type="time"
                  value={checkin.wakeTime}
                  onChange={(e) => setCheckin({ ...checkin, wakeTime: e.target.value })}
                  className="w-full px-6 py-4 text-lg border-2 border-border rounded-card focus:outline-none focus:ring-4 focus:ring-primary-600/10 focus:border-primary-600 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="bg-surface-card rounded-card p-8 shadow-card">
            <h2 className="font-bold text-ink text-xl mb-6 flex items-center gap-3">
              <div className="w-12 h-12 bg-warning/10 rounded-card flex items-center justify-center">
                <Star className="text-warning" size={24} />
              </div>
              今日心情
            </h2>
            <div className="flex gap-3 justify-center">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setCheckin({ ...checkin, moodScore: n })}
                  className={`p-5 rounded-card transition-all duration-300 ${
                    checkin.moodScore >= n 
                      ? 'text-warning scale-110' 
                      : 'text-ink-muted hover:text-warning'
                  }`}
                >
                  <Star fill={checkin.moodScore >= n ? 'currentColor' : 'none'} size={40} />
                </button>
              ))}
            </div>
            <div className="text-center mt-4 text-ink-subtle text-lg">
              {checkin.moodScore === 1 && '今天不太开心...'}
              {checkin.moodScore === 2 && '今天有点难过'}
              {checkin.moodScore === 3 && '今天心情一般'}
              {checkin.moodScore === 4 && '今天挺开心的！'}
              {checkin.moodScore === 5 && '今天太棒了！🌟'}
            </div>
          </div>

          <div className="bg-surface-card rounded-card p-8 shadow-card">
            <h2 className="font-bold text-ink text-xl mb-6 flex items-center gap-3">
              <div className="w-12 h-12 bg-success/10 rounded-card flex items-center justify-center">
                <BookOpen className="text-success" size={24} />
              </div>
              学习时长
            </h2>
            <label className="block text-base font-semibold text-ink mb-3">
              今日学习时长（小时）
            </label>
            <input
              type="number"
              value={checkin.studyHours}
              onChange={(e) => setCheckin({ ...checkin, studyHours: parseFloat(e.target.value) || 0 })}
              step="0.5"
              min="0"
              max="24"
              className="w-full px-6 py-4 text-lg border-2 border-border rounded-card focus:outline-none focus:ring-4 focus:ring-success/10 focus:border-success transition-all"
            />
            <div className="mt-4 flex justify-between text-sm text-ink-muted">
              <span>0h</span>
              <span>6h</span>
              <span>12h</span>
              <span>24h</span>
            </div>
          </div>

          <div className="bg-surface-card rounded-card p-8 shadow-card">
            <h2 className="font-bold text-ink text-xl mb-6 flex items-center gap-3">
              <div className="w-12 h-12 bg-warning/10 rounded-card flex items-center justify-center">
                <Sun className="text-warning" size={24} />
              </div>
              健康打卡
            </h2>
            <div className="space-y-4">
              <label className="flex items-center gap-5 cursor-pointer p-4 rounded-card hover:bg-surface-hover transition-all">
                <input
                  type="checkbox"
                  checked={checkin.exercised}
                  onChange={(e) => setCheckin({ ...checkin, exercised: e.target.checked })}
                  className="w-7 h-7 rounded-btn text-success border-2 border-border focus:ring-success"
                />
                <div className="flex-1">
                  <span className="text-ink text-lg font-medium">今天有运动</span>
                  <p className="text-ink-subtle text-sm">动一动，身体好！</p>
                </div>
                {checkin.exercised && (
                  <CheckCircle2 className="text-success" size={24} />
                )}
              </label>
              <label className="flex items-center gap-5 cursor-pointer p-4 rounded-card hover:bg-surface-hover transition-all">
                <input
                  type="checkbox"
                  checked={checkin.waterEnough}
                  onChange={(e) => setCheckin({ ...checkin, waterEnough: e.target.checked })}
                  className="w-7 h-7 rounded-btn text-primary-600 border-2 border-border focus:ring-primary-600"
                />
                <div className="flex-1">
                  <span className="text-ink text-lg font-medium">喝水充足</span>
                  <p className="text-ink-subtle text-sm">八杯水，元气满满！</p>
                </div>
                {checkin.waterEnough && (
                  <CheckCircle2 className="text-primary-600" size={24} />
                )}
              </label>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handleSave}
              className="w-full bg-primary-600 text-white px-10 py-5 rounded-card font-bold text-xl shadow-card hover:shadow-card-hover transition-all duration-300 flex items-center justify-center gap-3"
            >
              <Save size={28} />
              保存打卡
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}
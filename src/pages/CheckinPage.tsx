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
    <div className="min-h-screen py-6 px-4 relative z-10">
      <div className="bg-decorations">
        <div className="bg-decoration-1"></div>
        <div className="bg-decoration-2"></div>
      </div>

      <div className="max-w-2xl mx-auto pb-32">
        <div className="text-center mb-8 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl mb-4 shadow-2xl animate-float">
            <Calendar className="text-white" size={40} />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">每日打卡</h1>
          <p className="text-gray-600">记录美好的一天</p>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-xl animate-fadeIn stagger-1">
            <h2 className="font-bold text-gray-800 text-xl mb-6 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center">
                <Moon className="text-blue-600" size={24} />
              </div>
              作息记录
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-3">
                  昨晚入睡时间
                </label>
                <input
                  type="time"
                  value={checkin.sleepTime}
                  onChange={(e) => setCheckin({ ...checkin, sleepTime: e.target.value })}
                  className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all input-glow"
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-3">
                  今天起床时间
                </label>
                <input
                  type="time"
                  value={checkin.wakeTime}
                  onChange={(e) => setCheckin({ ...checkin, wakeTime: e.target.value })}
                  className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all input-glow"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl animate-fadeIn stagger-2">
            <h2 className="font-bold text-gray-800 text-xl mb-6 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl flex items-center justify-center">
                <Star className="text-yellow-600" size={24} />
              </div>
              今日心情
            </h2>
            <div className="flex gap-3 justify-center">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setCheckin({ ...checkin, moodScore: n })}
                  className={`p-5 rounded-2xl transition-all duration-300 transform hover:scale-110 ${
                    checkin.moodScore >= n 
                      ? 'text-yellow-500 scale-110' 
                      : 'text-gray-300 hover:text-yellow-400'
                  }`}
                >
                  <Star fill={checkin.moodScore >= n ? 'currentColor' : 'none'} size={40} />
                </button>
              ))}
            </div>
            <div className="text-center mt-4 text-gray-500 text-lg">
              {checkin.moodScore === 1 && '今天不太开心...'}
              {checkin.moodScore === 2 && '今天有点难过'}
              {checkin.moodScore === 3 && '今天心情一般'}
              {checkin.moodScore === 4 && '今天挺开心的！'}
              {checkin.moodScore === 5 && '今天太棒了！🌟'}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl animate-fadeIn stagger-3">
            <h2 className="font-bold text-gray-800 text-xl mb-6 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center">
                <BookOpen className="text-green-600" size={24} />
              </div>
              学习时长
            </h2>
            <label className="block text-base font-semibold text-gray-700 mb-3">
              今日学习时长（小时）
            </label>
            <input
              type="number"
              value={checkin.studyHours}
              onChange={(e) => setCheckin({ ...checkin, studyHours: parseFloat(e.target.value) || 0 })}
              step="0.5"
              min="0"
              max="24"
              className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-400 transition-all input-glow"
            />
            <div className="mt-4 flex justify-between text-sm text-gray-500">
              <span>0h</span>
              <span>6h</span>
              <span>12h</span>
              <span>24h</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl animate-fadeIn stagger-4">
            <h2 className="font-bold text-gray-800 text-xl mb-6 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl flex items-center justify-center">
                <Sun className="text-orange-600" size={24} />
              </div>
              健康打卡
            </h2>
            <div className="space-y-4">
              <label className="flex items-center gap-5 cursor-pointer p-4 rounded-2xl hover:bg-gray-50 transition-all card-hover">
                <input
                  type="checkbox"
                  checked={checkin.exercised}
                  onChange={(e) => setCheckin({ ...checkin, exercised: e.target.checked })}
                  className="w-7 h-7 rounded-lg text-green-600 border-2 border-gray-300 focus:ring-green-500"
                />
                <div className="flex-1">
                  <span className="text-gray-700 text-lg font-medium">今天有运动</span>
                  <p className="text-gray-500 text-sm">动一动，身体好！</p>
                </div>
                {checkin.exercised && (
                  <CheckCircle2 className="text-green-500" size={24} />
                )}
              </label>
              <label className="flex items-center gap-5 cursor-pointer p-4 rounded-2xl hover:bg-gray-50 transition-all card-hover">
                <input
                  type="checkbox"
                  checked={checkin.waterEnough}
                  onChange={(e) => setCheckin({ ...checkin, waterEnough: e.target.checked })}
                  className="w-7 h-7 rounded-lg text-blue-600 border-2 border-gray-300 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <span className="text-gray-700 text-lg font-medium">喝水充足</span>
                  <p className="text-gray-500 text-sm">八杯水，元气满满！</p>
                </div>
                {checkin.waterEnough && (
                  <CheckCircle2 className="text-blue-500" size={24} />
                )}
              </label>
            </div>
          </div>

          <div className="pt-4 animate-fadeIn stagger-5">
            <button
              onClick={handleSave}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-10 py-5 rounded-3xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 btn-hover flex items-center justify-center gap-3"
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

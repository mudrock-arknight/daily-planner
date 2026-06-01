import { useState, useEffect } from 'react'
import { Save, Star, Moon, Sun } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function CheckinPage() {
  const today = new Date().toISOString().split('T')[0]

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
    date: today,
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
      .eq('date', today)
      .single()
    
    if (data && data.data) {
      setCheckin({ ...checkin, ...data.data, id: data.id })
    }
  }

  async function handleSave() {
    const payload = { date: today, data: checkin }
    
    if (checkin.id) {
      await supabase
        .from('daily_checkins')
        .update({ data: checkin })
        .eq('id', checkin.id)
    } else {
      await supabase
        .from('daily_checkins')
        .insert(payload)
        .select()
        .single()
    }
    
    alert('保存成功！')
  }

  return (
    <div className="p-4 max-w-2xl mx-auto pb-32">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">每日打卡</h1>
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-5 py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Save size={18} />
          保存
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Moon className="text-indigo-500" size={20} />
            作息记录
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">昨晚入睡时间</label>
              <input
                type="time"
                value={checkin.sleepTime}
                onChange={(e) => setCheckin({ ...checkin, sleepTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">今天起床时间</label>
              <input
                type="time"
                value={checkin.wakeTime}
                onChange={(e) => setCheckin({ ...checkin, wakeTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Star className="text-yellow-500" size={20} />
            今日心情
          </h2>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setCheckin({ ...checkin, moodScore: n })}
                className={`p-2 rounded-lg transition-colors ${checkin.moodScore >= n ? 'text-yellow-500' : 'text-gray-300'}`}
              >
                <Star fill={checkin.moodScore >= n ? 'currentColor' : 'none'} size={24} />
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
          <h2 className="font-semibold text-gray-800 mb-4">学习时长</h2>
          <label className="block text-sm text-gray-600 mb-1">今日学习时长 (小时)</label>
          <input
            type="number"
            value={checkin.studyHours}
            onChange={(e) => setCheckin({ ...checkin, studyHours: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Sun className="text-orange-500" size={20} />
            健康打卡
          </h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={checkin.exercised}
                onChange={(e) => setCheckin({ ...checkin, exercised: e.target.checked })}
                className="w-5 h-5 rounded text-green-600"
              />
              <span className="text-gray-700">今天有运动</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={checkin.waterEnough}
                onChange={(e) => setCheckin({ ...checkin, waterEnough: e.target.checked })}
                className="w-5 h-5 rounded text-blue-600"
              />
              <span className="text-gray-700">喝水充足</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

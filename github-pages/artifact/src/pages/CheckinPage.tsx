import { useState, useEffect } from 'react'
import { CheckCircle2, Save, Star } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'
import type { DailyCheckin } from '../types'

export default function CheckinPage() {
  const today = new Date().toISOString().split('T')[0]
  const { addDailyCheckin } = useStore()

  const [checkin, setCheckin] = useState<DailyCheckin>({
    date: today,
    sleepTime: '',
    wakeTime: '',
    energyScore: 3,
    moodScore: 3,
    phoneCheck: {
      noPhoneInBed: false,
      noPhoneFirst: false,
      noTikTok: false,
    },
    importantTasks: [
      { id: '1', text: '', status: 'todo' },
      { id: '2', text: '', status: 'todo' },
      { id: '3', text: '', status: 'todo' },
    ],
    studyTrack: {
      englishHours: 0,
      wordCount: 0,
      readingCount: 0,
      listeningMinutes: 0,
      writingCount: 0,
      timeBlocks: [],
    },
    phoneMonitor: {
      totalHours: 0,
      tiktokHours: 0,
      gameHours: 0,
      isQualified: true,
      issues: [],
    },
    healthStatus: {
      exercise: false,
      exerciseType: '',
      exerciseMinutes: 0,
      meals: 'regular',
      waterEnough: false,
      skincare: false,
      teethCare: false,
    },
    eveningReview: {
      achievements: ['', '', ''],
      improvements: ['', ''],
      timeWaste: '',
      mindset: '',
      messageToSelf: '',
    },
    tomorrowPlan: {
      tasks: ['', '', ''],
      wakeTime: '',
    },
    scores: {
      sleepScore: 0,
      englishScore: 0,
      phoneScore: 0,
      tasksScore: 0,
      moodScore: 0,
      total: 0,
    },
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
    
    if (data) {
      setCheckin({ ...checkin, ...data.data, id: data.id })
    }
  }

  async function handleSave() {
    const scores = calculateScores()
    const finalCheckin = { ...checkin, scores }
    
    if (checkin.id) {
      await supabase
        .from('daily_checkins')
        .update({ data: finalCheckin })
        .eq('id', checkin.id)
    } else {
      const { data } = await supabase
        .from('daily_checkins')
        .insert({ date: today, data: finalCheckin })
        .select()
        .single()
      if (data) addDailyCheckin(data)
    }
    
    setCheckin({ ...finalCheckin })
    alert('保存成功！')
  }

  function calculateScores() {
    let sleepScore = 20
    let englishScore = 20
    let phoneScore = 20
    let tasksScore = 20
    
    if (checkin.phoneCheck.noPhoneInBed) sleepScore += 2
    if (checkin.phoneCheck.noPhoneFirst) sleepScore += 2
    if (checkin.phoneCheck.noTikTok) sleepScore += 2
    
    const englishHours = checkin.studyTrack.englishHours
    if (englishHours >= 4) englishScore = 25
    else if (englishHours >= 3) englishScore = 20
    else if (englishHours >= 2) englishScore = 15
    else if (englishHours >= 1) englishScore = 10
    
    const phoneHours = checkin.phoneMonitor.totalHours
    if (phoneHours <= 2) phoneScore = 25
    else if (phoneHours <= 3) phoneScore = 20
    else if (phoneHours <= 4) phoneScore = 15
    else phoneScore = 10
    
    const doneTasks = checkin.importantTasks.filter(t => t.status === 'done').length
    if (doneTasks === 3) tasksScore = 25
    else if (doneTasks === 2) tasksScore = 18
    else if (doneTasks === 1) tasksScore = 12
    
    const moodScoreNormalized = checkin.moodScore * 5
    
    const total = Math.min(100, sleepScore + englishScore + phoneScore + tasksScore + moodScoreNormalized)
    
    return {
      sleepScore,
      englishScore,
      phoneScore,
      tasksScore,
      moodScore: moodScoreNormalized,
      total,
    }
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
            <span className="text-orange-500">🌅</span>
            早起检查
          </h2>
          <div className="space-y-4">
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
            <div className="space-y-2">
              <label className="block text-sm text-gray-600">手机检查</label>
              {[
                { key: 'noPhoneInBed' as const, label: '昨晚手机没有带上床' },
                { key: 'noPhoneFirst' as const, label: '今早起床后没有先刷手机' },
                { key: 'noTikTok' as const, label: '手机已卸载抖音/小游戏' },
              ].map((item) => (
                <label key={item.key} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkin.phoneCheck[item.key]}
                    onChange={(e) => setCheckin({
                      ...checkin,
                      phoneCheck: {
                        ...checkin.phoneCheck,
                        [item.key]: e.target.checked,
                      },
                    })}
                    className="w-5 h-5 rounded text-blue-600"
                  />
                  <span className="text-gray-700">{item.label}</span>
                </label>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">精力状态</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => setCheckin({ ...checkin, energyScore: n })}
                      className={`p-2 rounded-lg ${checkin.energyScore >= n ? 'text-yellow-500' : 'text-gray-300'}`}
                    >
                      <Star fill={checkin.energyScore >= n ? 'currentColor' : 'none'} size={20} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">心情状态</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => setCheckin({ ...checkin, moodScore: n })}
                      className={`p-2 rounded-lg ${checkin.moodScore >= n ? 'text-pink-500' : 'text-gray-300'}`}
                    >
                      <Star fill={checkin.moodScore >= n ? 'currentColor' : 'none'} size={20} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-blue-500">📋</span>
            今日三件最重要的事
          </h2>
          <div className="space-y-3">
            {checkin.importantTasks.map((task, i) => (
              <div key={task.id} className="flex items-center gap-3">
                <select
                  value={task.status}
                  onChange={(e) => {
                    const newTasks = [...checkin.importantTasks]
                    newTasks[i] = { ...task, status: e.target.value as 'todo' | 'done' | 'partial' }
                    setCheckin({ ...checkin, importantTasks: newTasks })
                  }}
                  className="px-2 py-1 border border-gray-200 rounded-lg text-sm"
                >
                  <option value="todo">未完成</option>
                  <option value="partial">进行中</option>
                  <option value="done">已完成</option>
                </select>
                <input
                  type="text"
                  value={task.text}
                  onChange={(e) => {
                    const newTasks = [...checkin.importantTasks]
                    newTasks[i] = { ...task, text: e.target.value }
                    setCheckin({ ...checkin, importantTasks: newTasks })
                  }}
                  placeholder={`任务 ${i + 1}`}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-green-500">📚</span>
            今日学习追踪
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">今天英语学习时长 (小时)</label>
              <input
                type="number"
                value={checkin.studyTrack.englishHours}
                onChange={(e) => setCheckin({
                  ...checkin,
                  studyTrack: { ...checkin.studyTrack, englishHours: parseFloat(e.target.value) || 0 },
                })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">背单词数量</label>
                <input
                  type="number"
                  value={checkin.studyTrack.wordCount}
                  onChange={(e) => setCheckin({
                    ...checkin,
                    studyTrack: { ...checkin.studyTrack, wordCount: parseInt(e.target.value) || 0 },
                  })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">阅读篇数</label>
                <input
                  type="number"
                  value={checkin.studyTrack.readingCount}
                  onChange={(e) => setCheckin({
                    ...checkin,
                    studyTrack: { ...checkin.studyTrack, readingCount: parseInt(e.target.value) || 0 },
                  })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">听力时长 (分钟)</label>
                <input
                  type="number"
                  value={checkin.studyTrack.listeningMinutes}
                  onChange={(e) => setCheckin({
                    ...checkin,
                    studyTrack: { ...checkin.studyTrack, listeningMinutes: parseInt(e.target.value) || 0 },
                  })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">写作/翻译篇数</label>
                <input
                  type="number"
                  value={checkin.studyTrack.writingCount}
                  onChange={(e) => setCheckin({
                    ...checkin,
                    studyTrack: { ...checkin.studyTrack, writingCount: parseInt(e.target.value) || 0 },
                  })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-red-500">🏃</span>
            身体与状态
          </h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={checkin.healthStatus.exercise}
                onChange={(e) => setCheckin({
                  ...checkin,
                  healthStatus: { ...checkin.healthStatus, exercise: e.target.checked },
                })}
                className="w-5 h-5 rounded text-green-600"
              />
              <span className="text-gray-700">今天有运动</span>
            </label>
            {checkin.healthStatus.exercise && (
              <div className="grid grid-cols-2 gap-4 ml-8">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">运动项目</label>
                  <input
                    type="text"
                    value={checkin.healthStatus.exerciseType}
                    onChange={(e) => setCheckin({
                      ...checkin,
                      healthStatus: { ...checkin.healthStatus, exerciseType: e.target.value },
                    })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">运动时长 (分钟)</label>
                  <input
                    type="number"
                    value={checkin.healthStatus.exerciseMinutes}
                    onChange={(e) => setCheckin({
                      ...checkin,
                      healthStatus: { ...checkin.healthStatus, exerciseMinutes: parseInt(e.target.value) || 0 },
                    })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">三餐</label>
                <select
                  value={checkin.healthStatus.meals}
                  onChange={(e) => setCheckin({
                    ...checkin,
                    healthStatus: { ...checkin.healthStatus, meals: e.target.value as 'regular' | 'oneMissing' | 'unhealthy' },
                  })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="regular">规律</option>
                  <option value="oneMissing">少了一餐</option>
                  <option value="unhealthy">乱吃</option>
                </select>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              {[
                { key: 'waterEnough' as const, label: '喝水够' },
                { key: 'skincare' as const, label: '皮肤护理' },
                { key: 'teethCare' as const, label: '认真刷牙' },
              ].map((item) => (
                <label key={item.key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkin.healthStatus[item.key]}
                    onChange={(e) => setCheckin({
                      ...checkin,
                      healthStatus: {
                        ...checkin.healthStatus,
                        [item.key]: e.target.checked,
                      },
                    })}
                    className="w-5 h-5 rounded text-blue-600"
                  />
                  <span className="text-gray-700 text-sm">{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-purple-500">🌙</span>
            晚间复盘
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">今天做成了什么？(写3件)</label>
              {[0, 1, 2].map((i) => (
                <input
                  key={i}
                  type="text"
                  value={checkin.eveningReview.achievements[i]}
                  onChange={(e) => {
                    const achievements = [...checkin.eveningReview.achievements]
                    achievements[i] = e.target.value
                    setCheckin({
                      ...checkin,
                      eveningReview: { ...checkin.eveningReview, achievements },
                    })
                  }}
                  placeholder={`成就 ${i + 1}`}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">今天哪里没做好？</label>
              {[0, 1].map((i) => (
                <input
                  key={i}
                  type="text"
                  value={checkin.eveningReview.improvements[i]}
                  onChange={(e) => {
                    const improvements = [...checkin.eveningReview.improvements]
                    improvements[i] = e.target.value
                    setCheckin({
                      ...checkin,
                      eveningReview: { ...checkin.eveningReview, improvements },
                    })
                  }}
                  placeholder={`改进 ${i + 1}`}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">今天最大的时间浪费是什么？</label>
              <input
                type="text"
                value={checkin.eveningReview.timeWaste}
                onChange={(e) => setCheckin({
                  ...checkin,
                  eveningReview: { ...checkin.eveningReview, timeWaste: e.target.value },
                })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">今天的心态怎么样？</label>
              <input
                type="text"
                value={checkin.eveningReview.mindset}
                onChange={(e) => setCheckin({
                  ...checkin,
                  eveningReview: { ...checkin.eveningReview, mindset: e.target.value },
                })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">给自己的话</label>
              <textarea
                value={checkin.eveningReview.messageToSelf}
                onChange={(e) => setCheckin({
                  ...checkin,
                  eveningReview: { ...checkin.eveningReview, messageToSelf: e.target.value },
                })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 text-white">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <CheckCircle2 size={24} />
            今日评分
          </h2>
          <div className="text-center mb-4">
            <div className="text-5xl font-bold">{calculateScores().total}</div>
            <div className="text-blue-100 mt-1">/ 100</div>
          </div>
          <div className="grid grid-cols-5 gap-2 text-center text-sm">
            <div className="bg-white/20 rounded-lg p-2">
              <div className="font-bold">{calculateScores().sleepScore}</div>
              <div className="text-blue-100">作息</div>
            </div>
            <div className="bg-white/20 rounded-lg p-2">
              <div className="font-bold">{calculateScores().englishScore}</div>
              <div className="text-blue-100">英语</div>
            </div>
            <div className="bg-white/20 rounded-lg p-2">
              <div className="font-bold">{calculateScores().phoneScore}</div>
              <div className="text-blue-100">手机</div>
            </div>
            <div className="bg-white/20 rounded-lg p-2">
              <div className="font-bold">{calculateScores().tasksScore}</div>
              <div className="text-blue-100">任务</div>
            </div>
            <div className="bg-white/20 rounded-lg p-2">
              <div className="font-bold">{calculateScores().moodScore}</div>
              <div className="text-blue-100">心情</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

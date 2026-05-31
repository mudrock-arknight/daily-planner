import { BarChart3, TrendingUp, Clock, Target } from 'lucide-react'

export default function StatsPage() {
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="text-pink-600" size={28} />
        <h1 className="text-2xl font-bold text-gray-800">数据统计</h1>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-green-500" size={20} />
            <span className="text-sm text-gray-500">打卡天数</span>
          </div>
          <div className="text-3xl font-bold text-gray-800">7</div>
          <div className="text-xs text-green-600 mt-1">本周连续 7 天</div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="text-blue-500" size={20} />
            <span className="text-sm text-gray-500">学习时长</span>
          </div>
          <div className="text-3xl font-bold text-gray-800">28h</div>
          <div className="text-xs text-blue-600 mt-1">平均每天 4h</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-4">本周目标进度</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">英语学习</span>
              <span className="font-medium text-blue-600">75%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '75%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">运动目标</span>
              <span className="font-medium text-green-600">60%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: '60%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">早睡早起</span>
              <span className="font-medium text-yellow-600">85%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-500 rounded-full" style={{ width: '85%' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Target className="text-purple-500" size={20} />
          <h3 className="font-semibold text-gray-800">每日平均分</h3>
        </div>
        <div className="flex items-end justify-around h-40">
          {[80, 75, 90, 85, 70, 95, 88].map((score, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div 
                className="w-8 bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg"
                style={{ height: `${score}%` }}
              />
              <span className="text-xs text-gray-500">周{i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

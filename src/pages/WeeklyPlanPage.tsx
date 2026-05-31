import { Target, Plus, Trash2 } from 'lucide-react'

export default function WeeklyPlanPage() {
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Target className="text-purple-600" size={28} />
        <h1 className="text-2xl font-bold text-gray-800">周计划</h1>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h2 className="font-semibold text-gray-800 mb-4">本周目标</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold">1</span>
            </div>
            <span className="flex-1 text-gray-700">完成六级复习计划</span>
            <button className="text-gray-400 hover:text-red-500">
              <Trash2 size={18} />
            </button>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold">2</span>
            </div>
            <span className="flex-1 text-gray-700">每天运动 30 分钟</span>
            <button className="text-gray-400 hover:text-red-500">
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        <button className="mt-4 w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-purple-400 hover:text-purple-600 transition-colors flex items-center justify-center gap-2">
          <Plus size={20} />
          添加目标
        </button>
      </div>

      <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h2 className="font-semibold text-gray-800 mb-4">本周安排</h2>
        {['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map((day) => (
          <div key={day} className="flex gap-3 py-3 border-b border-gray-100 last:border-0">
            <div className="w-16 font-medium text-gray-600">{day}</div>
            <input
              type="text"
              placeholder="安排..."
              className="flex-1 bg-gray-50 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { CheckCircle2, ListTodo, Calendar, BarChart3, TrendingUp, Clock, Target } from 'lucide-react'

export default function HomePage() {
  const today = new Date()
  const dateStr = today.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })

  const quickActions = [
    { path: '/checkin', icon: CheckCircle2, label: '每日打卡', color: 'bg-blue-500', desc: '记录今天的状态' },
    { path: '/todo', icon: ListTodo, label: '待办事项', color: 'bg-orange-500', desc: '管理今天的任务' },
    { path: '/schedule', icon: Calendar, label: '查看课表', color: 'bg-green-500', desc: '看看今天的课程' },
    { path: '/weekly', icon: Target, label: '周计划', color: 'bg-purple-500', desc: '制定本周目标' },
    { path: '/stats', icon: BarChart3, label: '数据统计', color: 'bg-pink-500', desc: '查看你的进度' },
  ]

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">你好！ 👋</h1>
        <p className="text-gray-500">{dateStr}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {quickActions.map((action) => (
          <Link
            key={action.path}
            to={action.path}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all"
          >
            <div className={`${action.color} w-12 h-12 rounded-xl flex items-center justify-center mb-3`}>
              <action.icon className="text-white" size={24} />
            </div>
            <h3 className="font-semibold text-gray-800">{action.label}</h3>
            <p className="text-sm text-gray-500 mt-1">{action.desc}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center">
            <TrendingUp className="text-blue-600" size={20} />
          </div>
          <h2 className="font-semibold text-gray-800">今日状态</h2>
        </div>
        <div className="text-center py-8 text-gray-500">
          <Clock size={48} className="mx-auto mb-3 text-gray-300" />
          <p>开始今天的打卡吧！</p>
          <Link
            to="/checkin"
            className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            立即打卡
          </Link>
        </div>
      </div>
    </div>
  )
}

import { Calendar } from 'lucide-react'

// 课表数据
interface Course {
  name: string
  teacher: string
  location: string
}

const scheduleData: (Course | null)[][] = [
  // 第1节
  [
    { name: '概率论与数理统计', teacher: '李博文', location: '日新楼南 408' },
    null,
    { name: '智能汽车平台技术', teacher: '曾子铭', location: '格物园 B 座 104' },
    null,
    null,
    null,
    null,
  ],
  // 第2节
  [
    { name: '概率论与数理统计', teacher: '李博文', location: '日新楼南 408' },
    null,
    { name: '智能汽车平台技术', teacher: '曾子铭', location: '格物园 B 座 104' },
    null,
    null,
    null,
    null,
  ],
  // 第3节
  [
    { name: '工程力学一', teacher: '赵升升', location: '日新楼南 401' },
    { name: '概率论与数理统计', teacher: '李博文', location: '日新楼南 408' },
    { name: '智能汽车平台技术', teacher: '曾子铭', location: '格物园 B 座 104' },
    { name: '概率论与数理统计', teacher: '李博文', location: '日新楼南 402' },
    { name: '工程力学一', teacher: '赵升升', location: '日新楼南 401' },
    null,
    null,
  ],
  // 第4节
  [
    { name: '工程力学一', teacher: '赵升升', location: '日新楼南 401' },
    { name: '概率论与数理统计', teacher: '李博文', location: '日新楼南 408' },
    { name: '智能汽车平台技术', teacher: '曾子铭', location: '格物园 B 座 104' },
    { name: '概率论与数理统计', teacher: '李博文', location: '日新楼南 402' },
    { name: '工程力学一', teacher: '赵升升', location: '日新楼南 401' },
    null,
    null,
  ],
  // 第5节
  [
    { name: '智能汽车环境感知技术', teacher: '林艳艳', location: '908（格物园 E 座）' },
    { name: '工程力学一', teacher: '赵升升', location: '日新楼南 401' },
    { name: '大学体育（4）（排球）', teacher: '郑军', location: 'B2 官龙山排球场 1' },
    null,
    null,
    null,
    null,
  ],
  // 第6节
  [
    { name: '智能汽车环境感知技术', teacher: '林艳艳', location: '908（格物园 E 座）' },
    { name: '工程力学一', teacher: '赵升升', location: '日新楼南 401' },
    { name: '大学体育（4）（排球）', teacher: '郑军', location: 'B2 官龙山排球场 1' },
    null,
    null,
    null,
    null,
  ],
  // 第7节
  [
    { name: '智能汽车环境感知技术', teacher: '林艳艳', location: '908（格物园 E 座）' },
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  // 第8节
  [
    { name: '智能汽车环境感知技术', teacher: '林艳艳', location: '908（格物园 E 座）' },
    null,
    null,
    null,
    null,
    null,
    null,
  ],
]

// 课程颜色映射
const courseColors: Record<string, string> = {
  '概率论与数理统计': 'bg-blue-100 border-blue-300 text-blue-800',
  '智能汽车平台技术': 'bg-green-100 border-green-300 text-green-800',
  '工程力学一': 'bg-purple-100 border-purple-300 text-purple-800',
  '智能汽车环境感知技术': 'bg-orange-100 border-orange-300 text-orange-800',
  '大学体育（4）（排球）': 'bg-pink-100 border-pink-300 text-pink-800',
}

const defaultColor = 'bg-yellow-100 border-yellow-300 text-yellow-800'

export default function SchedulePage() {
  const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const periods = [
    { time: '08:30-09:15', label: '第1节' },
    { time: '09:20-10:05', label: '第2节' },
    { time: '10:25-11:10', label: '第3节' },
    { time: '11:15-12:00', label: '第4节' },
    { time: '14:00-14:45', label: '第5节' },
    { time: '14:50-15:35', label: '第6节' },
    { time: '15:45-16:30', label: '第7节' },
    { time: '16:35-17:20', label: '第8节' },
  ]

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="text-blue-600" size={28} />
        <h1 className="text-2xl font-bold text-gray-800">第13周课程表</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 text-sm font-medium text-gray-600 border-b">时间</th>
                {weekDays.map((day) => (
                  <th key={day} className="p-3 text-sm font-medium text-gray-600 border-b min-w-36">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periods.map((period, pIdx) => (
                <tr key={period.label} className="border-b border-gray-100">
                  <td className="p-3 text-sm text-gray-500 border-r">
                    <div className="font-medium">{period.label}</div>
                    <div className="text-xs">{period.time}</div>
                  </td>
                  {weekDays.map((_, dIdx) => {
                    const course = scheduleData[pIdx][dIdx]
                    const colorClass = course ? (courseColors[course.name] || defaultColor) : ''
                    return (
                      <td key={`${pIdx}-${dIdx}`} className="p-1 border-r">
                        {course && (
                          <div className={`p-2 rounded border ${colorClass}`}>
                            <div className="text-xs font-medium">{course.name}</div>
                            <div className="text-xs opacity-80">{course.teacher}</div>
                            <div className="text-xs opacity-60">{course.location}</div>
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
        <h3 className="font-medium text-gray-700 mb-3">课程列表</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.entries(courseColors).map(([name, color]) => (
            <div key={name} className={`p-2 rounded border text-xs ${color}`}>
              {name}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

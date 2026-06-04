// --------------- 实际使用的数据结构 ---------------

// 待办事项
export interface TodoItem {
  id?: string
  title: string
  completed: boolean
  created_at?: string
}

// 时间块完成记录 (存储在 daily_checkins.data.completions 中)
export interface CompletionRecord {
  planDate: string      // ISO日期, e.g. "2026-06-02"
  timeblockIndex: number
  completed: boolean
  timestamp?: string
}

// 每日打卡记录 (data 字段中包含 completions 数组)
export interface DailyCheckin {
  id?: string
  date: string
  data: {
    sleepTime?: string
    wakeTime?: string
    energyScore?: number
    moodScore?: number
    phoneCheck?: any
    importantTasks?: any[]
    studyTrack?: any
    phoneMonitor?: any
    healthStatus?: any
    eveningReview?: any
    tomorrowPlan?: any
    scores?: any
    // 新增：时间块完成记录
    completions?: CompletionRecord[]
  }
  created_at?: string
  updated_at?: string
}

export interface Course {
  name: string
  teacher: string
  time: string
  location: string
  weeks: string
}

// 周度计划时间块
export interface TimeBlock {
  time: string       // 格式 "HH:MM-HH:MM"
  content: string
  location?: string
  type: 'class' | 'study' | 'exam' | 'break' | 'task'
  detail?: string
  countable?: boolean
}

// 周度计划每日数据
export interface DailyScheduleItem {
  date: string        // 可能是 "6月2日" 或 ISO日期，建议使用 startDate 计算
  dayOfWeek?: string
  theme?: string
  themeColor?: 'blue' | 'red' | 'green' | 'orange' | 'purple' | 'teal' | 'pink'
  focusGoal?: string
  englishTarget?: number
  timeBlocks: TimeBlock[]
}

// 周度计划目标
export interface WeeklyGoal {
  id: string
  text: string
  progress: number
  deadline?: string
  type?: 'exam' | 'task' | 'study'
  totalHours?: number
}

// 周度计划 (实际存储在 weekly_plans.data 中)
export interface WeeklyPlanData {
  startDate: string      // ISO日期, e.g. "2026-06-02"
  endDate: string        // ISO日期, e.g. "2026-06-08"
  goals: WeeklyGoal[]
  dailySchedule: {
    [dayName: string]: DailyScheduleItem   // key: "周一" | "周二" | ... | "周日"
  }
  longTermGoals?: any[]
  notes?: any[]
  weeklyReview?: any
}

// 完整的周度计划记录
export interface WeeklyPlan {
  id?: string
  week: string
  data: WeeklyPlanData  // 所有数据都在这个 JSONB 字段里
  created_at?: string
  updated_at?: string
}

// --------------- 旧版本数据结构 (保留仅参考) ---------------
// 以下类型已废弃，不再使用

export interface OldImportantTask {
  id: string
  text: string
  status: 'todo' | 'done' | 'partial'
}

export interface OldTimeBlock {
  start: string
  end: string
  content: string
}

export interface OldStudyTrack {
  englishHours: number
  wordCount?: number
  readingCount?: number
  listeningMinutes?: number
  writingCount?: number
  timeBlocks: OldTimeBlock[]
}

export interface OldPhoneMonitor {
  totalHours: number
  tiktokHours: number
  gameHours: number
  isQualified: boolean
  issues: string[]
}

export interface OldHealthStatus {
  exercise: boolean
  exerciseType?: string
  exerciseMinutes?: number
  meals: 'regular' | 'oneMissing' | 'unhealthy'
  waterEnough: boolean
  skincare: boolean
  teethCare: boolean
}

export interface OldEveningReview {
  achievements: string[]
  improvements: string[]
  timeWaste: string
  mindset: string
  messageToSelf: string
}

export interface OldTomorrowPlan {
  tasks: string[]
  wakeTime: string
}

export interface OldScores {
  sleepScore: number
  englishScore: number
  phoneScore: number
  tasksScore: number
  moodScore: number
  total: number
}

export interface OldDailyCheckin {
  id?: string
  date: string
  sleepTime: string
  wakeTime: string
  energyScore: number
  moodScore: number
  phoneCheck: {
    noPhoneInBed: boolean
    noPhoneFirst: boolean
    noTikTok: boolean
  }
  importantTasks: OldImportantTask[]
  studyTrack: OldStudyTrack
  phoneMonitor: OldPhoneMonitor
  healthStatus: OldHealthStatus
  eveningReview: OldEveningReview
  tomorrowPlan: OldTomorrowPlan
  scores: OldScores
  created_at?: string
  updated_at?: string
}

export interface OldWeeklyGoal {
  id: string
  text: string
  progress: number
}

export interface OldWeeklyPlan {
  id?: string
  week: string
  startDate: string
  endDate: string
  goals: OldWeeklyGoal[]
  dailySchedule: Record<string, string>
  timeBlocks: {
    morning?: { start: string; end: string }
    afternoon?: { start: string; end: string }
    evening?: { start: string; end: string }
  }
  created_at?: string
}

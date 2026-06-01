export interface TodoItem {
  id?: string
  title: string
  completed: boolean
  created_at?: string
}

export interface ImportantTask {
  id: string
  text: string
  status: 'todo' | 'done' | 'partial'
}

export interface TimeBlock {
  start: string
  end: string
  content: string
}

export interface StudyTrack {
  englishHours: number
  wordCount?: number
  readingCount?: number
  listeningMinutes?: number
  writingCount?: number
  timeBlocks: TimeBlock[]
}

export interface PhoneMonitor {
  totalHours: number
  tiktokHours: number
  gameHours: number
  isQualified: boolean
  issues: string[]
}

export interface HealthStatus {
  exercise: boolean
  exerciseType?: string
  exerciseMinutes?: number
  meals: 'regular' | 'oneMissing' | 'unhealthy'
  waterEnough: boolean
  skincare: boolean
  teethCare: boolean
}

export interface EveningReview {
  achievements: string[]
  improvements: string[]
  timeWaste: string
  mindset: string
  messageToSelf: string
}

export interface TomorrowPlan {
  tasks: string[]
  wakeTime: string
}

export interface Scores {
  sleepScore: number
  englishScore: number
  phoneScore: number
  tasksScore: number
  moodScore: number
  total: number
}

export interface DailyCheckin {
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
  importantTasks: ImportantTask[]
  studyTrack: StudyTrack
  phoneMonitor: PhoneMonitor
  healthStatus: HealthStatus
  eveningReview: EveningReview
  tomorrowPlan: TomorrowPlan
  scores: Scores
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

export interface WeeklyGoal {
  id: string
  text: string
  progress: number
}

export interface WeeklyPlan {
  id?: string
  week: string
  startDate: string
  endDate: string
  goals: WeeklyGoal[]
  dailySchedule: Record<string, string>
  timeBlocks: {
    morning?: { start: string; end: string }
    afternoon?: { start: string; end: string }
    evening?: { start: string; end: string }
  }
  created_at?: string
}

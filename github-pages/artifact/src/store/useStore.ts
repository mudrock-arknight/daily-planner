import { create } from 'zustand'
import { DailyCheckin, TodoItem, WeeklyPlan } from '../types'

interface AppState {
  todos: TodoItem[]
  dailyCheckins: DailyCheckin[]
  weeklyPlans: WeeklyPlan[]
  setTodos: (todos: TodoItem[]) => void
  addTodo: (todo: TodoItem) => void
  updateTodo: (id: string, updates: Partial<TodoItem>) => void
  deleteTodo: (id: string) => void
  setDailyCheckins: (checkins: DailyCheckin[]) => void
  addDailyCheckin: (checkin: DailyCheckin) => void
  updateDailyCheckin: (id: string, updates: Partial<DailyCheckin>) => void
  setWeeklyPlans: (plans: WeeklyPlan[]) => void
  addWeeklyPlan: (plan: WeeklyPlan) => void
}

export const useStore = create<AppState>((set) => ({
  todos: [],
  dailyCheckins: [],
  weeklyPlans: [],
  setTodos: (todos) => set({ todos }),
  addTodo: (todo) => set((state) => ({ todos: [...state.todos, todo] })),
  updateTodo: (id, updates) => set((state) => ({
    todos: state.todos.map((t) => t.id === id ? { ...t, ...updates } : t)
  })),
  deleteTodo: (id) => set((state) => ({
    todos: state.todos.filter((t) => t.id !== id)
  })),
  setDailyCheckins: (checkins) => set({ dailyCheckins: checkins }),
  addDailyCheckin: (checkin) => set((state) => ({
    dailyCheckins: [...state.dailyCheckins, checkin]
  })),
  updateDailyCheckin: (id, updates) => set((state) => ({
    dailyCheckins: state.dailyCheckins.map((c) => c.id === id ? { ...c, ...updates } : c)
  })),
  setWeeklyPlans: (plans) => set({ weeklyPlans: plans }),
  addWeeklyPlan: (plan) => set((state) => ({
    weeklyPlans: [...state.weeklyPlans, plan]
  })),
}))

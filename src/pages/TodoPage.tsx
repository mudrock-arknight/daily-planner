import { useState, useEffect } from 'react'
import { Plus, Trash2, CheckCircle2, Circle, ListTodo, Star } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'
import type { TodoItem } from '../types'

export default function TodoPage() {
  const [newTodo, setNewTodo] = useState('')
  const { todos, setTodos, addTodo, updateTodo, deleteTodo } = useStore()

  useEffect(() => {
    loadTodos()
    
    const channel = supabase
      .channel('todo_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'todo_items' },
        () => loadTodos()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function loadTodos() {
    const { data } = await supabase
      .from('todo_items')
      .select('*')
      .order('completed', { ascending: true })
      .order('created_at', { ascending: false })
    if (data) setTodos(data)
  }

  async function handleAddTodo(e: React.FormEvent) {
    e.preventDefault()
    if (!newTodo.trim()) return

    const todo: Omit<TodoItem, 'id' | 'created_at'> = {
      title: newTodo,
      completed: false,
    }

    const { data } = await supabase
      .from('todo_items')
      .insert(todo)
      .select()
      .single()

    if (data) addTodo(data)
    setNewTodo('')
  }

  async function toggleTodo(id: string, completed: boolean) {
    await supabase
      .from('todo_items')
      .update({ completed: !completed })
      .eq('id', id)
    updateTodo(id, { completed: !completed })
  }

  async function handleDeleteTodo(id: string) {
    await supabase
      .from('todo_items')
      .delete()
      .eq('id', id)
    deleteTodo(id)
  }

  const incompleteCount = todos.filter(t => !t.completed).length
  const completeCount = todos.filter(t => t.completed).length
  const completionRate = todos.length > 0 ? Math.round((completeCount / todos.length) * 100) : 0

  return (
    <div className="min-h-screen py-6 px-4 relative z-10">
      <div className="bg-decorations">
        <div className="bg-decoration-1"></div>
        <div className="bg-decoration-2"></div>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mb-4 shadow-2xl animate-float">
            <ListTodo className="text-white" size={40} />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">待办事项</h1>
          <p className="text-gray-600">管理你的日常任务</p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-xl mb-6 animate-fadeIn stagger-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{incompleteCount}</div>
                <div className="text-sm text-gray-500">未完成</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{completeCount}</div>
                <div className="text-sm text-gray-500">已完成</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold gradient-text">{completionRate}%</div>
              <div className="text-sm text-gray-500">完成率</div>
            </div>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-1000 progress-bar"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleAddTodo} className="mb-8 animate-fadeIn stagger-2">
          <div className="flex gap-3">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="添加新任务..."
              className="flex-1 px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all text-base input-glow"
            />
            <button
              type="submit"
              disabled={!newTodo.trim()}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed btn-hover flex items-center gap-2"
            >
              <Plus size={22} />
              添加
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {todos.length === 0 ? (
            <div className="text-center py-20 bg-white/90 backdrop-blur rounded-3xl border-2 border-dashed border-gray-200 animate-fadeIn">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Star className="text-yellow-500" size={48} />
              </div>
              <p className="text-gray-700 text-xl font-semibold mb-2">还没有待办事项</p>
              <p className="text-gray-400">添加你的第一个任务开始吧！</p>
            </div>
          ) : (
            todos.map((todo, idx) => (
              <div
                key={todo.id}
                className={`bg-white rounded-3xl p-5 shadow-lg card-hover transition-all duration-300 flex items-center gap-4 ${
                  todo.completed ? 'opacity-70 bg-gray-50' : ''
                } animate-fadeIn`}
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                <button
                  onClick={() => toggleTodo(todo.id!, todo.completed)}
                  className="flex-shrink-0 transition-all duration-300 icon-bounce"
                >
                  {todo.completed ? (
                    <CheckCircle2 className="text-green-500" size={32} />
                  ) : (
                    <Circle className="text-gray-300 hover:text-blue-500" size={32} />
                  )}
                </button>
                <span className={`flex-1 text-lg ${
                  todo.completed ? 'line-through text-gray-400' : 'text-gray-800'
                }`}>
                  {todo.title}
                </span>
                <button
                  onClick={() => handleDeleteTodo(todo.id!)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-3 hover:bg-red-50 rounded-2xl icon-bounce"
                >
                  <Trash2 size={22} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

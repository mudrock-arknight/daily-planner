import { useState, useEffect } from 'react'
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react'
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

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">待办事项</h1>
        <p className="text-gray-500">管理你的日常任务</p>
      </div>

      <form onSubmit={handleAddTodo} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="添加新任务..."
            className="flex-1 px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-base"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-8 py-4 rounded-2xl font-semibold hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <Plus size={22} />
            添加
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className={`bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-4 ${todo.completed ? 'opacity-70' : ''}`}
          >
            <button
              onClick={() => toggleTodo(todo.id!, todo.completed)}
              className="flex-shrink-0 transition-transform hover:scale-110"
            >
              {todo.completed ? (
                <CheckCircle2 className="text-emerald-500" size={28} />
              ) : (
                <Circle className="text-gray-300 hover:text-indigo-400" size={28} />
              )}
            </button>
            <span className={`flex-1 text-lg ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
              {todo.title}
            </span>
            <button
              onClick={() => handleDeleteTodo(todo.id!)}
              className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-xl"
            >
              <Trash2 size={22} />
            </button>
          </div>
        ))}
        {todos.length === 0 && (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <div className="text-5xl mb-4">📝</div>
            <p className="text-gray-600 text-lg font-medium mb-2">还没有待办事项</p>
            <p className="text-gray-400">添加你的第一个任务开始吧！</p>
          </div>
        )}
      </div>
    </div>
  )
}

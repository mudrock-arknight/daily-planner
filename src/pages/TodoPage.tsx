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
      .order('created_at', { ascending: false })
    if (data) setTodos(data)
  }

  async function handleAddTodo(e: React.FormEvent) {
    e.preventDefault()
    if (!newTodo.trim()) return

    const todo: Omit<TodoItem, 'id' | 'created_at' | 'priority'> = {
      title: newTodo,
      completed: false,
    }

    const { data } = await supabase
      .from('todo_items')
      .insert({ ...todo, priority: 'medium' })
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
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">待办事项</h1>

      <form onSubmit={handleAddTodo} className="mb-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="添加新任务..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            添加
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3"
          >
            <button
              onClick={() => toggleTodo(todo.id!, todo.completed)}
              className="flex-shrink-0"
            >
              {todo.completed ? (
                <CheckCircle2 className="text-green-500" size={24} />
              ) : (
                <Circle className="text-gray-300" size={24} />
              )}
            </button>
            <span className={`flex-1 ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
              {todo.title}
            </span>
            <button
              onClick={() => handleDeleteTodo(todo.id!)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
        {todos.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>还没有待办事项</p>
            <p className="text-sm">添加你的第一个任务吧！</p>
          </div>
        )}
      </div>
    </div>
  )
}

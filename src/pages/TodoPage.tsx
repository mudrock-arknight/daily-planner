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
    <div className="min-h-screen py-6 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-600 rounded-card mb-4 shadow-card">
            <ListTodo className="text-white" size={40} />
          </div>
          <h1 className="text-4xl font-bold text-ink mb-2">待办事项</h1>
          <p className="text-ink-subtle">管理你的日常任务</p>
        </div>

        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">{incompleteCount}</div>
                <div className="text-sm text-ink-subtle">未完成</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-success">{completeCount}</div>
                <div className="text-sm text-ink-subtle">已完成</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary-600">{completionRate}%</div>
              <div className="text-sm text-ink-subtle">完成率</div>
            </div>
          </div>
          <div className="h-3 bg-surface-hover rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-600 rounded-full transition-all duration-1000"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleAddTodo} className="mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="添加新任务..."
              className="flex-1 px-5 py-4 rounded-btn border border-border focus:outline-none focus:shadow-focus focus:border-primary-600 transition-all text-base"
            />
            <button
              type="submit"
              disabled={!newTodo.trim()}
              className="btn-primary px-6 py-4 text-base font-semibold gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={22} />
              添加
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {todos.length === 0 ? (
            <div className="text-center py-20 bg-surface-card rounded-card shadow-card border-2 border-dashed border-border">
              <div className="w-24 h-24 bg-warning/10 rounded-card flex items-center justify-center mx-auto mb-6">
                <Star className="text-warning" size={48} />
              </div>
              <p className="text-ink text-xl font-semibold mb-2">还没有待办事项</p>
              <p className="text-ink-muted">添加你的第一个任务开始吧！</p>
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className={`p-5 flex items-center gap-4 transition-all duration-200 ${
                  todo.completed ? 'card opacity-70' : 'card-interactive'
                }`}
              >
                <button
                  onClick={() => toggleTodo(todo.id!, todo.completed)}
                  className="flex-shrink-0 transition-all duration-200"
                >
                  {todo.completed ? (
                    <CheckCircle2 className="text-success" size={32} />
                  ) : (
                    <Circle className="text-ink-muted hover:text-primary-600" size={32} />
                  )}
                </button>
                <span className={`flex-1 text-lg ${
                  todo.completed ? 'line-through text-ink-muted' : 'text-ink'
                }`}>
                  {todo.title}
                </span>
                <button
                  onClick={() => handleDeleteTodo(todo.id!)}
                  className="text-ink-muted hover:text-danger transition-colors p-3 hover:bg-surface-hover rounded-btn"
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
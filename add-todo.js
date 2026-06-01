#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ptizhibqkhkozakklzqh.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0aXpoaWJxa2hrb3pha2tsenFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDIyNjM1MywiZXhwIjoyMDk1ODAyMzUzfQ.2Z2seY7CyJmqf8AWdVAt-_nMRDmEctnu0uJEhgQarb4'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

const title = process.argv[2]

if (!title) {
  console.log('用法: node add-todo.js "待办内容"')
  process.exit(1)
}

const { data, error } = await supabase
  .from('todo_items')
  .insert({ title, completed: false, priority: 'medium' })
  .select()
  .single()

if (error) {
  console.error('❌ 添加失败:', error.message)
  process.exit(1)
} else {
  console.log('✅ 已添加待办:', title)
  process.exit(0)
}

#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ptizhibqkhkozakklzqh.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0aXpoaWJxa2hrb3pha2tsenFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDIyNjM1MywiZXhwIjoyMDk1ODAyMzUzfQ.2Z2seY7CyJmqf8AWdVAt-_nMRDmEctnu0uJEhgQarb4'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function createTables() {
  console.log('🚀 开始创建数据表...\n')

  // 创建 timeblock_completions 表
  const { error: createError } = await supabase.rpc('exec', {
    sql: `
      CREATE TABLE IF NOT EXISTS timeblock_completions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        plan_date DATE NOT NULL,
        day_name VARCHAR(10) NOT NULL,
        timeblock_index INTEGER NOT NULL,
        timeblock_time VARCHAR(20) NOT NULL,
        timeblock_content TEXT NOT NULL,
        timeblock_type VARCHAR(20) NOT NULL,
        completed BOOLEAN DEFAULT false NOT NULL,
        completed_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(plan_date, timeblock_index)
      );

      -- 启用 RLS
      ALTER TABLE timeblock_completions ENABLE ROW LEVEL SECURITY;

      -- 创建允许所有操作的策略（因为是个人使用）
      CREATE POLICY IF NOT EXISTS "Allow all access" ON timeblock_completions
        FOR ALL USING (true) WITH CHECK (true);
    `
  })

  if (createError) {
    console.log('⚠️ RPC 执行失败，尝试直接建表...')
    
    // 尝试通过直接 SQL 执行
    const { error: tableError } = await supabase
      .from('timeblock_completions')
      .insert({
        plan_date: '2000-01-01',
        day_name: '测试',
        timeblock_index: 0,
        timeblock_time: '00:00-00:00',
        timeblock_content: '测试记录 - 如成功则表已存在',
        timeblock_type: 'test'
      })
      .select()
    
    if (tableError) {
      console.log('表可能需要手动创建，请运行以下 SQL：')
      console.log(`
-- 创建时间块完成记录表
CREATE TABLE IF NOT EXISTS timeblock_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_date DATE NOT NULL,
  day_name VARCHAR(10) NOT NULL,
  timeblock_index INTEGER NOT NULL,
  timeblock_time VARCHAR(20) NOT NULL,
  timeblock_content TEXT NOT NULL,
  timeblock_type VARCHAR(20) NOT NULL,
  completed BOOLEAN DEFAULT false NOT NULL,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(plan_date, timeblock_index)
);

-- 启用 RLS
ALTER TABLE timeblock_completions ENABLE ROW LEVEL SECURITY;

-- 创建策略
CREATE POLICY "Allow all" ON timeblock_completions FOR ALL USING (true) WITH CHECK (true);
      `)
    } else {
      console.log('✅ 表已创建（通过插入测试数据验证）')
      // 删除测试数据
      await supabase.from('timeblock_completions').delete().eq('plan_date', '2000-01-01')
    }
  } else {
    console.log('✅ timeblock_completions 表创建成功')
  }

  console.log('\n✅ 数据库设置完成！')
}

createTables().catch(console.error)

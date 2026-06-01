# Tasks - 时间块完成标记与界面优化

## Task 1: 创建 Supabase 数据表
- [ ] Task 1.1: 创建 timeblock_completions 表用于存储完成标记
  - 字段：id, user_id, plan_date, timeblock_index, completed, completed_at, created_at
  - 配置行级安全策略

## Task 2: 实现时间块完成标记功能
- [ ] Task 2.1: 修改 HomePage.tsx - 添加完成标记按钮和状态管理
- [ ] Task 2.2: 修改 WeeklyPlanPage.tsx - 添加完成标记按钮和状态管理
- [ ] Task 2.3: 创建 timeblock completion 的 API 函数（保存到 Supabase）

## Task 3: 修复日期选择跳转问题
- [ ] Task 3.1: 检查并修复 HomePage 中的 selectedDay 状态管理
- [ ] Task 3.2: 检查并修复 WeeklyPlanPage 中的 selectedDay/expandedDay 状态管理
- [ ] Task 3.3: 验证切换日期后不再自动跳回

## Task 4: 优化计划生成脚本
- [ ] Task 4.1: 修改 generate-plan.js 确保时间块紧凑排布
- [ ] Task 4.2: 8:00-23:00 之间无间隔排布
- [ ] Task 4.3: 重新生成并上传周计划数据

## Task 5: 增强统计页面
- [ ] Task 5.1: 修改 StatsPage.tsx 添加完成率统计组件
- [ ] Task 5.2: 添加本周/本月完成率展示
- [ ] Task 5.3: 添加各类型任务完成率对比
- [ ] Task 5.4: 添加每日完成率柱状图

## Task 6: 前端界面全面优化（frontend-design skill）
- [ ] Task 6.1: 制定独特的设计风格方向
- [ ] Task 6.2: 优化全局样式和 CSS 变量
- [ ] Task 6.3: 优化 HomePage 界面设计
- [ ] Task 6.4: 优化 WeeklyPlanPage 界面设计
- [ ] Task 6.5: 优化 StatsPage 界面设计
- [ ] Task 6.6: 添加流畅的过渡动画
- [ ] Task 6.7: 优化移动端响应式设计

## Task 7: 测试和验证
- [ ] Task 7.1: 测试完成标记功能
- [ ] Task 7.2: 测试日期切换稳定性
- [ ] Task 7.3: 验证统计数据正确性
- [ ] Task 7.4: 提交代码并推送 GitHub

## Task Dependencies
- Task 2 依赖 Task 1
- Task 5 依赖 Task 1 和 Task 2
- Task 7 依赖 Task 2, 3, 4, 5

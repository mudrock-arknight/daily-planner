# Checklist - 时间块完成标记与界面优化

## Database
- [x] 使用 daily_checkins 表存储完成标记数据
- [x] 完成状态正确保存

## HomePage
- [x] 时间块显示完成标记按钮
- [x] 点击按钮可切换完成状态
- [x] 完成状态同步到 Supabase
- [x] 日期切换不自动跳回当天
- [x] 界面视觉优化完成
- [x] 课程不显示打卡按钮

## WeeklyPlanPage
- [x] 时间块显示完成标记按钮
- [x] 点击按钮可切换完成状态
- [x] 完成状态同步到 Supabase
- [x] 日期切换不自动跳回当天
- [x] 界面视觉优化完成

## StatsPage
- [x] 显示本周完成率百分比
- [x] 显示完成数量统计
- [x] 显示各类型任务完成率
- [x] 显示每日完成率图表
- [x] 界面视觉优化完成

## Plan Generator
- [x] 正确读取大二下13周课表 CSV
- [x] 课程解析正确（概率论、工程力学、智能汽车技术、体育）
- [x] 课程不计入打卡（countable: false）
- [x] 学习时间计入打卡（countable: true）
- [x] 时间块排布紧凑无间隔
- [x] 每天有效时间安排充足
- [x] 周计划数据已更新

## General
- [x] 代码无 TypeScript 编译错误
- [x] 所有动画流畅自然
- [x] 移动端响应式正常
- [x] GitHub Actions 构建成功
- [x] 代码已推送到 GitHub

# Tasks - 非学习事件自动完成与事件触发刷新

## Task 1: 调试并修复日期显示问题（核心问题）
- [ ] Task 1.1: 检查 `dailySchedule` 的 keys 格式
  - 是 '周一' 还是 '6月2日' 格式？
  - 从 Supabase 加载的实际数据结构是什么？

- [ ] Task 1.2: 添加调试日志检查 `selectedDay` 设置
  ```typescript
  console.log('todayName:', todayName);
  console.log('days:', Object.keys(dailySchedule));
  console.log('targetDay:', targetDay);
  console.log('selectedDay:', selectedDay);
  ```

- [ ] Task 1.3: 检查 `currentDaySchedule.date` 的实际值
  ```typescript
  console.log('currentDaySchedule.date:', currentDaySchedule?.date);
  ```

- [ ] Task 1.4: 检查 `effectivelyCompleted` 函数中的数据流
  ```typescript
  console.log('dayDate:', dayDate);
  console.log('block.type:', block.type);
  console.log('isBlockDateBeforeToday:', isBlockDateBeforeToday(dayDate));
  console.log('isTimeBlockPast:', isTimeBlockPast(block.time, dayDate));
  console.log('effectivelyCompleted result:', result);
  ```

## Task 2: 修复日期选择逻辑
- [ ] Task 2.1: 确保 `selectedDay` 初始化为正确的星期几
  - 如果 `dailySchedule` keys 是 '周一' 格式：使用 `todayName`
  - 如果 `dailySchedule` keys 是 '6月2日' 格式：需要转换

- [ ] Task 2.2: 修复 `effectivelyCompleted` 函数
  - 确保非学习类型在时间已过或日期已过期时返回 true
  - 今天的非学习事件：检查结束时间是否已过
  - 历史日期的非学习事件：直接自动完成

## Task 3: 改进刷新机制
- [x] Task 3.1: 移除60秒定时器（已完成）

- [ ] Task 3.2: 考虑事件开始触发刷新（可选）
  - 计算下一个事件开始时间
  - 设置定时器在该时间刷新页面

## Task 4: 验证修复
- [ ] Task 4.1: 本地测试日期显示
  - 今天是周二，应该显示周二的计划表
  - selectedDay 应该是 '周二'

- [ ] Task 4.2: 测试周二非学习事件自动完成
  - 周二 14:00-15:35 的课程（今天是18:30）应该自动完成
  - 检查 effectivelyCompleted 返回 true

- [ ] Task 4.3: 测试刷新机制
  - 页面加载时立即显示正确状态
  - 不需要等待60秒

## Task Dependencies
- Task 1 必须在 Task 2 之前完成
- Task 4 必须在 Task 2 之后进行

## 预期结果
1. 今天是周二，页面显示周二的计划表
2. 周二的非学习事件（课程、任务、休息）时间结束后自动勾选
3. 周一及之前的非学习事件自动勾选
4. 学习类型的事件始终需要手动勾选
5. 页面加载时立即显示正确的状态（不需要等待刷新）

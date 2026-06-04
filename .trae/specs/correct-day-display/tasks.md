# Tasks - 正确日期显示与历史任务自动完成

## Task 1: 修复日期显示逻辑
- [x] Task 1.1: 检查 HomePage.tsx 中 todayName 的计算逻辑
  - 确认 dayNames 数组与 Date.getDay() 返回值正确对应
  - Date.getDay() 返回 0=周日, 1=周一, 2=周二...
  - 当前代码：dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  - 当前代码：todayName = dayNames[today.getDay()]
  - 如果 today.getDay() 返回 2（周二），todayName 应该是 "周二"

- [x] Task 1.2: 检查 selectedDay 的初始化逻辑
  - 确认 loadWeeklyPlan 中是否正确设置 selectedDay
  - 确认是否被其他 useEffect 覆盖

- [x] Task 1.3: 检查 WeeklyPlanPage.tsx 中的日期逻辑
  - 确认是否正确计算今天对应的星期几

## Task 2: 修复历史非学习事件自动完成
- [x] Task 2.1: 修改 isTimeBlockPast 函数
  - 当前逻辑：只比较时间（小时:分钟）
  - 新逻辑：需要比较完整的日期+时间
  - 如果事件日期 < 今天日期，自动认为已过去
  - 如果事件日期 = 今天日期，比较时间
  - 如果事件日期 > 今天日期，未过去

- [x] Task 2.2: 修改 effectivelyCompleted 函数
  - 传入完整的日期信息
  - 对于非学习事件：
    - 如果事件日期 < 今天：自动完成
    - 如果事件日期 = 今天且时间已过：自动完成
    - 如果事件日期 > 今天：不自动完成

- [x] Task 2.3: 更新 HomePage.tsx 中的调用
  - 确保传入正确的日期参数

- [x] Task 2.4: 更新 WeeklyPlanPage.tsx 中的调用
  - 确保传入正确的日期参数

## Task 3: 测试验证
- [x] Task 3.1: 验证周二显示周二计划
- [x] Task 3.2: 验证周一已过去的非学习事件自动完成
- [x] Task 3.3: 验证周二已过去的非学习事件自动完成
- [x] Task 3.4: 验证未来的事件不自动完成

## Task Dependencies
- Task 2 依赖 Task 1
- Task 3 依赖 Task 1 和 Task 2

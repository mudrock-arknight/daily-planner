# 代码优化重构 - 任务列表

- [x] Task 1: 提取共享工具函数到 src/utils/
  - [x] SubTask 1.1: 创建 src/utils/planUtils.ts，提取 themeColors、typeLabels、parseChineseDate、getTodayInfo、isTimeBlockPast、isBlockDateBeforeToday、isBlockDateToday、effectivelyCompleted、calcCorrectDate
  - [x] SubTask 1.2: 更新 HomePage.tsx 和 WeeklyPlanPage.tsx，从 utils 导入替代本地定义

- [x] Task 2: 提取自定义 Hook useWeeklyPlan
  - [x] SubTask 2.1: 创建 src/hooks/useWeeklyPlan.ts，封装 weeklyPlan 加载、completions 加载、handleToggleCompletion 逻辑
  - [x] SubTask 2.2: 更新 HomePage.tsx 使用 useWeeklyPlan hook
  - [x] SubTask 2.3: 更新 WeeklyPlanPage.tsx 使用 useWeeklyPlan hook

- [x] Task 3: 创建 Toast 通知组件
  - [x] SubTask 3.1: 创建 src/components/Toast.tsx
  - [x] SubTask 3.2: 替换 CheckinPage.tsx 中的 alert() 为 Toast

- [x] Task 4: 添加 React Error Boundary
  - [x] SubTask 4.1: 创建 src/components/ErrorBoundary.tsx
  - [x] SubTask 4.2: 在 App.tsx 中包裹 Routes

- [x] Task 5: 更新六级倒计时日期
  - [x] SubTask 5.1: 将 StatsPage.tsx 中的日期改为 2026-06-14

- [x] Task 6: 清理根目录脚本
  - [x] SubTask 6.1: 创建 scripts/ 目录，移动 25 个 .mjs/.js 脚本文件
  - [x] SubTask 6.2: 删除未使用的 pg 依赖

- [x] Task 7: 验证所有修改
  - [x] SubTask 7.1: TypeScript 编译通过
  - [x] SubTask 7.2: 构建成功
  - [x] SubTask 7.3: 提交推送

# Task Dependencies
- Task 2 depends on Task 1
- Task 7 depends on Task 1-6

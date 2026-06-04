# 代码优化重构 - 检查清单

- [ ] HomePage.tsx 和 WeeklyPlanPage.tsx 不再包含重复的 themeColors/typeLabels/parseChineseDate 等定义
- [ ] 共享工具函数在 src/utils/planUtils.ts 中定义且被两个页面正确导入
- [ ] useWeeklyPlan hook 封装了 weeklyPlan 加载和 completions 逻辑
- [ ] CheckinPage.tsx 不再使用 alert()，改用 Toast 组件
- [ ] App.tsx 包含 Error Boundary 包裹
- [ ] StatsPage.tsx 六级倒计时日期为 2026-06-14
- [ ] 根目录不再有散落的 .mjs/.js 脚本文件（已移到 scripts/）
- [ ] package.json 中不再包含 pg 依赖
- [ ] TypeScript 编译通过 (npx tsc --noEmit)
- [ ] Vite 构建成功 (npm run build)
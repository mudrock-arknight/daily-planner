# Tasks

- [x] Task 1: 重构 tailwind.config.js 和 src/index.css — 建立统一设计 Token
  - [x] 在 tailwind.config.js 中定义颜色、圆角、阴影、字体等自定义主题
  - [x] 重写 src/index.css，移除 AI 痕迹样式（渐变背景、玻璃拟态、浮动画装饰、渐变文字等）
  - [x] 保留页面基础样式（字体、滚动条、必要的过渡动画）
  - [x] 添加 `prefers-reduced-motion: reduce` 媒体查询
  - [x] 验证：`npm run build` 通过

- [x] Task 2: 重构 App.tsx 根布局
  - [x] 移除 `bg-gray-50` 背景，使用新的背景色
  - [x] 确保 Navbar 样式与设计系统一致
  - [x] 验证：`npm run build` 通过

- [x] Task 3: 重构 HomePage 页面
  - [x] 移除玻璃拟态卡片，替换为纯白卡片 + 浅阴影
  - [x] 移除渐变文字，使用纯色标题
  - [x] 统一按钮、卡片、输入框样式
  - [x] 确保移动端显示正常
  - [x] 验证：`npm run build` 通过

- [x] Task 4: 重构 WeeklyPlanPage 页面
  - [x] 移除玻璃拟态元素，替换为纯白卡片
  - [x] 统一进度条、时间块卡片样式
  - [x] 统一日期选择器样式
  - [x] 验证：`npm run build` 通过

- [x] Task 5: 重构 CheckinPage 页面
  - [x] 统一卡片、按钮、输入框样式
  - [x] 移除玻璃拟态效果
  - [x] 验证：`npm run build` 通过

- [x] Task 6: 重构 TodoPage 和 SchedulePage 页面
  - [x] 统一卡片、按钮样式
  - [x] 验证：`npm run build` 通过

- [x] Task 7: 重构 StatsPage 页面
  - [x] 统一卡片、进度条样式
  - [x] 验证：`npm run build` 通过

- [x] Task 8: 最终验证
  - [x] 运行 `npm run build` 确保无编译错误
  - [x] 检查所有页面无 AI 痕迹（渐变背景、玻璃拟态、渐变文字、浮动画装饰）

# Task Dependencies
- Task 2-7 都依赖 Task 1
- Task 3-7 互相独立，可并行执行
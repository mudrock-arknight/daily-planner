# 前端 UI 优化 Spec

## Why
当前前端存在大量 AI 生成痕迹（紫色渐变背景、玻璃拟态、渐变文字、浮动画装饰等），用户希望优化为「活力现代」风格的产品型 UI，干净、现代、高效。

## What Changes
- 移除 AI 紫色渐变背景，替换为低调简约的现代背景
- 移除玻璃拟态效果（glassmorphism）
- 移除渐变文字（gradient text）
- 移除浮动画装饰元素（bg-decoration-1/2/3）
- 简化 CSS 动画，只保留必要的状态反馈动效
- 统一色彩系统为 OKLCH 基础的中性色 + indigo 主色
- 统一字体为 Inter + Noto Sans SC（系统字体栈优先）
- 规范化圆角、阴影、间距等设计 token
- 添加 prefers-reduced-motion 支持
- 优化移动端显示效果
- 使用 Tailwind CSS 自定义主题替代手写 CSS 变量

## Impact
- Affected specs: 所有前端页面（HomePage, WeeklyPlanPage, CheckinPage, TodoPage, SchedulePage, StatsPage）
- Affected code: src/index.css, tailwind.config.js, src/App.tsx, 所有页面组件

## ADDED Requirements

### Requirement: 统一色彩系统
系统 SHALL 使用基于 DESIGN.md 的 OKLCH 色彩系统，通过 Tailwind 自定义主题实现。

#### Scenario: 页面背景
- **WHEN** 用户访问任意页面
- **THEN** 背景为浅灰白（#fafafa），非紫色渐变

### Requirement: 移除 AI 痕迹
系统 SHALL 移除所有 AI 生成痕迹类视觉效果。

#### Scenario: 检查页面
- **WHEN** 在任意页面中
- **THEN** 不存在渐变文字、玻璃拟态、浮动画装饰、紫色渐变背景

### Requirement: 减少动效
系统 SHALL 只保留必要的状态反馈动画（hover、focus、active、loading），移除所有装饰性动画。

#### Scenario: 减少动效
- **WHEN** 用户启用系统的 reduced motion
- **THEN** 所有非必要动画停止

### Requirement: 规范设计 Token
系统 SHALL 在 tailwind.config.js 中定义统一的设计 Token（颜色、圆角、阴影、间距）。

#### Scenario: 组件一致性
- **WHEN** 查看不同页面
- **THEN** 按钮、卡片、输入框等组件样式保持一致

## REMOVED Requirements

### Requirement: 装饰性渐变背景
**Reason**: 用户明确不要 AI 紫色渐变
**Migration**: 替换为简洁的浅灰背景

### Requirement: 玻璃拟态效果
**Reason**: 用户明确不要玻璃拟态
**Migration**: 替换为纯白卡片 + 浅阴影

### Requirement: 浮动画装饰元素
**Reason**: 装饰性元素，无功能价值
**Migration**: 直接移除
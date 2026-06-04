# Daily Planner - Windows 11 桌面应用转换 - 验证清单

## 基础设置检查
- [ ] Windows 文件夹已创建
- [ ] Windows/package.json 文件已创建并包含 Electron 依赖
- [ ] 根目录的 package.json 未被修改
- [ ] 所有 Electron 相关文件都在 Windows 文件夹中

## Electron 配置检查
- [ ] Windows/main.js 文件已创建
- [ ] Windows/main.js 包含窗口创建逻辑
- [ ] 窗口配置加载 ../dist/index.html
- [ ] Windows/preload.js 文件已创建
- [ ] 上下文隔离已正确配置

## 构建配置检查
- [ ] Windows/package.json 包含 electron:dev 脚本
- [ ] Windows/package.json 包含 electron:build 脚本
- [ ] Windows/package.json 包含 build 配置部分
- [ ] 配置为只构建 Windows 版本

## 功能测试检查
- [ ] React 应用可以成功构建到根目录的 dist 文件夹
- [ ] Electron 开发模式可以正常启动
- [ ] 应用窗口正常显示
- [ ] 所有页面可以正常访问
- [ ] 待办事项功能正常
- [ ] 每日打卡功能正常
- [ ] 周计划功能正常
- [ ] 统计页面功能正常

## 安装包检查
- [ ] Windows 安装包 (.exe) 成功生成
- [ ] 安装包可以正常安装
- [ ] 安装后应用可以正常启动
- [ ] 安装后的应用所有功能正常

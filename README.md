# 标签俱乐部 (Tag Club)

游戏化便签任务管理 Web 应用 — 撕掉一张，离想成为的自己更近一步。

把每日任务变成彩色便签贴在面板上，完成后"撕掉"拿 XP，像游戏一样升级。

![](../public/home.png)

## 功能

- **便签面板** — 创建、拆解子任务、按分类筛选
- **时间安排** — 给便签设时间段，按时间排序
- **日期规划** — 可以为未来几天提前创建便签
- **撕掉动画** — 完成任务时的彩色纸屑庆祝效果
- **XP / 等级** — 10 级成长体系，从「便签新手」到「标签传说」
- **连续打卡** — 每天打开自动签到，追踪连续天数
- **周视图** — 查看过去 7 天的便签概览
- **统计面板** — 完成率、分类占比、XP 趋势图
- **数据持久化** — 全部数据存在浏览器 localStorage，刷新不丢失

## 技术栈

- React 19 + Vite
- Zustand（状态管理 + localStorage 持久化）
- Lucide React（图标）
- 自定义 CSS（无框架）

## 本地运行

```bash
git clone https://github.com/Lotus-7/rip-off.git
cd tag-club
npm install
npm run dev
```

打开 http://localhost:5173

## 部署

```bash
npm run build
```

将 `dist/` 目录部署到 Vercel / Netlify / 任意静态托管即可。

## License

MIT

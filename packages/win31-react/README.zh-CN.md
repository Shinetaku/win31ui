# @win31ui/react

高保真 Windows 3.1 风格 React 组件库。SSR 安全、与框架无关——可用于 Next.js、
Vite、Electron 和 Tauri。

English docs: [README.md](./README.md)

## 安装

```bash
npm install @win31ui/react
```

```ts
import '@win31ui/react/win31.css'    // 必需——tokens、主题、字体与基础类
import '@win31ui/react/styles.css'   // 必需——组件状态
import { Win31Window, Win31Button } from '@win31ui/react'
```

tokens（样式表、像素字体、位图）已内置在本包，单个依赖即可使用；
位图资源位于 `@win31ui/react/assets/*`。

## 组件

| 组件 | 说明 |
|---|---|
| `Win31Provider` / `useWin31Theme` / `applyWin31Theme` | 通过 `<html>` 的 `data-win31-theme` 同步主题；默认 `light` |
| `Win31Window` | 窗口框架；`dialog`、`maximized`、`hideTitleBar`、`bodyClassName` |
| `Win31TitleBar` | 标题、系统菜单、最小化/最大化/关闭；`dragMode: none \| manual \| electron \| tauri` |
| `Win31MenuBar` / `Win31Menu` / `Win31MenuItem` / `Win31MenuLink` / `Win31MenuSeparator` | 下拉菜单，支持快捷键、勾选、禁用；Esc / 点击外部关闭 |
| `Win31Tabs` | 受控 tablist + 面板，方向键切换 |
| `Win31GroupBox` | `fieldset` + `legend` |
| `Win31Button` | `small`、`isDefault`（双重描边）、`pressed` |
| `Win31Input` / `Win31Textarea` / `Win31Field` | 凹陷斜面输入框；原生属性透传 |
| `Win31Checkbox` / `Win31Radio` | 像素复选/单选，可选 label |
| `Win31NumberField` | 微调框，支持 min/max/step、方向键、非法输入缓冲 |
| `Win31Slider` | 指针拖动 + 方向键/翻页键/Home/End |
| `Win31ProgressBar` | 条纹进度，`showLabel` |
| `Win31ComboBox` | 输入过滤下拉，Esc / 点击外部关闭 |
| `Win31ListBox` | 受控单选列表，键盘导航，禁用项 |
| `Win31Table<T>` | TanStack Table：表头排序（`aria-sort`）、行选中 |
| `Win31Tree` | 三角展开/收起，受控选中，透传 `aria-label` |
| `Win31Dialog` | Portal、Esc 关闭、可选遮罩关闭、打开时聚焦、`buttons` 插槽 |
| `Win31MessageBox` | info/warn/stop 图标、预设按钮（`ok/cancel/yes/no/retry/abort/ignore`）、`onResult` |
| `Win31Tooltip` | hover/focus 提示，Portal + fixed 定位 |
| `Win31Toolbar` / `Win31ToolbarSeparator` | `showDrives`、右对齐 `path` |
| `Win31StatusBar` / `Win31StatusPane` | 凹陷窗格、省略号溢出 |
| `Win31Desktop` / `Win31DesktopIcon` | 全屏容器；最小化应用图标与还原 |

所有 props 类型均已导出；在编辑器中悬停组件即可查看完整 JSDoc。

## 窗口示例

```tsx
<Win31Window
  title="质检管理 — 质检开户"
  dragMode="electron"           // 让系统窗口跟随标题栏拖动
  onMaximize={() => {}}
  onClose={() => {}}
  bodyClassName="is-flush"
>
  <Win31Field label="企业：">
    <Win31Input placeholder="示例公司" />
  </Win31Field>
  <Win31Button isDefault>确定</Win31Button>
</Win31Window>
```

## SSR 规则

- 服务端在 `<html>` 上设置 `data-win31-theme`（根布局），首屏不闪白。
- 库入口带 `'use client'`；服务端渲染仍输出完整 HTML，仅交互部分 hydrate。
- 模块作用域无 `window`/`document`——可安全用于 RSC 树。

## 主题

六套主题：`light`（默认）、`dark`、`fun`、`mahogany`、`emerald`、`cinnamon`。
通过 `Win31Provider`、`applyWin31Theme()` 或手动
`document.documentElement.dataset.win31Theme = 'dark'` 切换。

## 桌面端拖动

| `dragMode` | 行为 |
|---|---|
| `none` | 静态（默认） |
| `manual` | 由本库处理指针拖动（浏览器/Electron/Tauri 均可） |
| `electron` | 标题栏 `-webkit-app-region: drag`，按钮 `no-drag` |
| `tauri` | 标题栏 `data-tauri-drag-region` |

`maximized` 时不启用手动拖动。

## 脚本

`build`（tsup → esm/cjs + d.ts）、`dev`（watch）、`test`（vitest）、`typecheck`。

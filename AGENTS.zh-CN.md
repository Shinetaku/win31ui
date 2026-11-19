# AGENTS.zh-CN.md — win31ui AI 编码指南

目的：让任何 AI 编码助手为 win31ui 贡献组件时，保持 Windows 3.1 的像素级还原，
并兼容 Web / SSR / Electron / Tauri。写代码前先读本文。（英文版：[AGENTS.md](./AGENTS.md)）

## 项目结构

```
packages/win31-tokens   静态 CSS + 字体 + 位图。无构建步骤。禁止加 JS。
packages/win31-react    组件库。所有 TS/TSX 都在 src/ 下。
examples/vite-app       CSR 示例；同时是 Electron/Tauri 的渲染层。
examples/next-app       SSR 示例；验证服务端渲染 + hydration。
e2e/                    Playwright 用例，每个示例一份配置。
```

## 强制规则

1. **设计已冻结。** 颜色、斜面、尺寸全部来自
   `packages/win31-tokens/win31.css` 的 CSS 变量（`--win31-*`）。禁止硬编码
   颜色、禁止 border-radius、渐变（既有的除外）、现代阴影、Emoji 图标。
   缺少变量时，先在 tokens 的 `:root` 里加 token，再引用变量。
2. **复用类名。** 组件类名与 tokens 样式表完全一致（`win31-*`，如
   `win31-button`、`is-pressed`、`is-dialog`）。React 组件渲染同样的类名；
   组件专属状态写在 `packages/win31-react/styles.css`，只用既有变量。
3. **命名。** 组件与 props 用 `Win31` 前缀（`Win31Button`）；布尔状态 props
   用 `is*` 前缀（`isDefault`、`pressed`），原生属性保持原名。文件：
   `src/components/` 每组件一个文件，非组件文件用 kebab-case。
4. **可移植性。** 发布代码不得导入 `process`、Node 内置模块、`next/*` 或任何
   打包器专有 API。仅支持 React `^18.2 || ^19`。未经用户明确同意不得新增
   运行时依赖。
5. **SSR 安全。** 禁止模块顶层访问 `window`/`document`；仅浏览器可用的代码
   放进 effect/handler。id 用 `useId()` 生成。`'use client'` 指令由
   `tsup.config.ts` 的 `banner` 注入产物——保持该行不动。
6. **Electron/Tauri。** 库内禁止调用 Electron/Tauri API。宿主级拖动通过
   `dragMode` prop 支持（`electron` → CSS 类 `is-electron-drag` 应用
   `-webkit-app-region`，`tauri` → `data-tauri-drag-region`）。厂商前缀样式
   一律写入 `packages/win31-react/styles.css` 的类中——禁止内联样式，jsdom
   无法验证它们。

## 新增组件（清单）

1. 新建 `src/components/Thing.tsx`：
   - 导出 `Win31ThingProps` 接口，继承对应原生 HTML 属性类型
   - 叶子交互元素用 `forwardRef`
   - 组件和每个不显然的 prop 写简短 JSDoc（LSP 悬停提示文本）
2. 仅状态的 CSS 加到 `packages/win31-react/styles.css`（只用 tokens 变量）。
3. 在 `src/index.ts` 导出组件 + props 类型（保持分组）。
4. 单测 `src/__tests__/Thing.test.tsx`：渲染、类名、回调、受控/非受控、
   禁用态、SSR 安全 props。
5. 视觉上有变化的，在 `e2e/` 加断言或截图。
6. 更新两份 README（英文 + 中文）和组件表。
7. 运行：`npm run typecheck && npm test`。

## 命令

| 命令 | 作用 |
|---|---|
| `npm install` | 安装全部 workspace（本机 bun install 存在 Windows EPERM 问题） |
| `npm run build` | tsup 构建 `@win31ui/react`（esm + cjs + d.ts） |
| `npm run typecheck` | 全包严格 tsc |
| `npm test` | vitest 单测 |
| `npm run test:e2e:vite` / `npm run test:e2e:next` | Playwright（系统 Edge；禁止 `playwright install`） |
| `npm run dev:vite` / `npm run dev:next` | 运行示例 :5173 / :3000 |

## 测试要求

- 每个公开组件都有对应 `*.test.tsx`，覆盖：基础类名、变体、回调、受控 props、
  （若适用）ref 转发。
- e2e 必须保持通过：渲染、交互、主题切换、SSR 标记（`request.get`）、
  hydration 错误扫描、视觉快照。
- Playwright 用 `channel: 'msedge'`（系统 Edge）。禁止运行
  `playwright install`——本机已有浏览器。
- 视觉快照：有意的视觉变更后用
  `npm run test:e2e:vite -- --update-snapshots` 重新生成；禁止手改 PNG。

## 发布

- 包：`@win31ui/tokens`、`@win31ui/react`；`publishConfig.access: public`。
- 首次发布前：在 npm 创建 `win31ui` 组织或改名 scope；在 `packages/*` 下用
  `npm publish --dry-run` 验证。
- `files` 字段就是发布面：react 包只放 `dist`（不放 `src/`），tokens 包保留
  `assets/`。

## 设计参考

权威视觉参考在 VBSS 文档（不在本仓库）：`D:/VBSS/docs/win31/[Win31]设计规范.html`。
对某个控件外观拿不准时，复刻那里的标记与类名；tokens CSS 是唯一事实来源。

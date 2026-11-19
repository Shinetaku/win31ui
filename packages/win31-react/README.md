# @win31ui/react

Authentic Windows 3.1 React components. SSR-safe, framework-agnostic — works in
Next.js, Vite, Electron and Tauri.

中文文档：[README.zh-CN.md](./README.zh-CN.md)

## Install

```bash
npm install @win31ui/react
```

```ts
import '@win31ui/react/win31.css'    // required — tokens, themes, fonts, base classes
import '@win31ui/react/styles.css'   // required — component states
import { Win31Window, Win31Button } from '@win31ui/react'
```

The tokens (stylesheet, pixel fonts, bitmaps) are bundled in this package, so
the single dependency is all you need. Bitmap assets are available under
`@win31ui/react/assets/*`.

## Components

| Component | Notes |
|---|---|
| `Win31Provider` / `useWin31Theme` / `applyWin31Theme` | theme sync via `data-win31-theme` on `<html>`; `light` is default |
| `Win31Window` | window frame; `dialog`, `maximized`, `hideTitleBar`, `bodyClassName` |
| `Win31TitleBar` | caption, system menu, min/max/close; `dragMode: none \| manual \| electron \| tauri` |
| `Win31MenuBar` / `Win31Menu` / `Win31MenuItem` / `Win31MenuLink` / `Win31MenuSeparator` | dropdown menus with accel keys, check marks, disabled items; Esc / outside-click close |
| `Win31Tabs` | controlled tablist + panel, arrow-key navigation |
| `Win31GroupBox` | `fieldset` + `legend` |
| `Win31Button` | `small`, `isDefault` (double outline), `pressed` |
| `Win31Input` / `Win31Textarea` / `Win31Field` | sunken bevel inputs; native props pass through |
| `Win31Checkbox` / `Win31Radio` | pixel check / radio with optional label |
| `Win31NumberField` | spinner with min/max/step, arrow keys, invalid-text buffering |
| `Win31Slider` | pointer drag + Arrow/PageUp/Down/Home/End |
| `Win31ProgressBar` | striped fill, `showLabel` |
| `Win31ComboBox` | input + filterable dropdown, Esc / outside-click close |
| `Win31ListBox` | controlled single-select list, keyboard navigation, disabled options |
| `Win31Table<T>` | TanStack Table: sortable headers (`aria-sort`), row selection |
| `Win31Tree` | expand/collapse carets, controlled selection, `aria-label` passthrough |
| `Win31Dialog` | portal, Esc close, optional backdrop close, focus on open, `buttons` slot |
| `Win31MessageBox` | info/warn/stop icons, preset buttons (`ok/cancel/yes/no/retry/abort/ignore`), `onResult` |
| `Win31Tooltip` | hover/focus tooltip, portal + fixed positioning |
| `Win31Toolbar` / `Win31ToolbarSeparator` | `showDrives`, right-aligned `path` |
| `Win31StatusBar` / `Win31StatusPane` | sunken panes, ellipsis overflow |
| `Win31Desktop` / `Win31DesktopIcon` | fullscreen container; minimized app icon with restore |

Every props type is exported; hover any component in your editor for the full
JSDoc.

## Window example

```tsx
<Win31Window
  title="Quality Inspection — Onboarding"
  dragMode="electron"           // let the OS window follow the title bar
  onMaximize={() => {}}
  onClose={() => {}}
  bodyClassName="is-flush"
>
  <Win31Field label="Enterprise:">
    <Win31Input placeholder="ACME" />
  </Win31Field>
  <Win31Button isDefault>OK</Win31Button>
</Win31Window>
```

## SSR rules

- Set `data-win31-theme` on `<html>` server-side (root layout) for a
  flash-free first paint.
- The library entry carries `'use client'`; server rendering still emits full
  HTML, only interactivity hydrates.
- No `window`/`document` at module scope — safe in RSC trees.

## Theming

Six themes: `light` (default), `dark`, `fun`, `mahogany`, `emerald`, `cinnamon`.
Switch via `Win31Provider`, `applyWin31Theme()`, or by hand:
`document.documentElement.dataset.win31Theme = 'dark'`.

## Desktop dragging

| `dragMode` | Behavior |
|---|---|
| `none` | static (default) |
| `manual` | pointer dragging handled here (browser/Electron/Tauri all fine) |
| `electron` | `-webkit-app-region: drag` on the bar, `no-drag` on buttons |
| `tauri` | `data-tauri-drag-region` on the bar |

Manual dragging is suppressed while `maximized`.

## Scripts

`build` (tsup → esm/cjs + d.ts), `dev` (watch), `test` (vitest), `typecheck`.

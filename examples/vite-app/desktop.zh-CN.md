# 桌面端壳——Electron 与 Tauri

`@win31ui/example-vite` 构建出的静态产物可被任何桌面壳加载。React 库本身不含
Node 或平台代码；原生窗口拖动通过组件上的 `dragMode` 开启。

English docs: [desktop.md](./desktop.md)

## Electron

```bash
bun add -D electron
```

`electron/main.cjs`：

```js
const { app, BrowserWindow } = require('electron')
const path = require('node:path')

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 640,
    frame: false, // 使用自绘 Win31 标题栏
    webPreferences: { contextIsolation: true, nodeIntegration: false }
  })
  win.loadFile(path.join(__dirname, '../vite-app/dist/index.html'))
}

app.whenReady().then(createWindow)
```

渲染进程：

```tsx
<Win31Window title="我的应用" dragMode="electron">…</Win31Window>
```

`dragMode="electron"` 会在标题栏设置 `-webkit-app-region: drag`、按钮设置
`no-drag`：系统负责移动窗口，按钮仍可点击。

## Tauri 2

每台机器安装一次（需要 Rust 工具链），然后初始化：

```bash
bun add -D @tauri-apps/cli
bun x tauri init   # frontendDist → ../vite-app/dist，devUrl → http://localhost:5173
```

`src-tauri/tauri.conf.json` 关键配置：

```json
{
  "app": {
    "windows": [{ "title": "win31ui", "width": 900, "height": 640, "decorations": false }],
    "security": {
      "csp": "default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:"
    }
  }
}
```

渲染进程：

```tsx
<Win31Window title="我的应用" dragMode="tauri">…</Win31Window>
```

`dragMode="tauri"` 在标题栏渲染 `data-tauri-drag-region`，由 Tauri 拖动原生
窗口（需 `decorations: false`）。

### CSP 说明

- 库的动态内联样式仅限拖动定位（`left/top/position`）。若禁用
  `'unsafe-inline'`，可在壳里生成 nonce 并注入 `style-src 'nonce-…'`；或保持
  `dragMode="manual"`（出于同样原因仍需允许内联样式）。
- `img-src` 必须允许 `data:`（样式表中的像素 SVG 图标）。

## dragMode 选择建议

| 场景 | 推荐 |
|---|---|
| 纯 Web / Next.js | `manual` 或 `none` |
| Electron | `electron`（系统级拖动，无 JS 开销） |
| Tauri | `tauri`（原生，遵循 `decorations: false`） |
| 窗口嵌在其他布局内 | `manual` |

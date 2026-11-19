# Desktop shells — Electron & Tauri

`@win31ui/example-vite` builds a static bundle that any desktop shell can load.
The React library itself contains no Node or platform code; native window
dragging is enabled per-component via `dragMode`.

中文版：[desktop.zh-CN.md](./desktop.zh-CN.md)

## Electron

```bash
bun add -D electron
```

`electron/main.cjs`:

```js
const { app, BrowserWindow } = require('electron')
const path = require('node:path')

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 640,
    frame: false, // draw our own Win31 title bar
    webPreferences: { contextIsolation: true, nodeIntegration: false }
  })
  win.loadFile(path.join(__dirname, '../vite-app/dist/index.html'))
}

app.whenReady().then(createWindow)
```

Renderer side:

```tsx
<Win31Window title="My App" dragMode="electron">…</Win31Window>
```

`dragMode="electron"` sets `-webkit-app-region: drag` on the title bar and
`no-drag` on the control buttons, so the OS moves the window while the buttons
stay clickable.

## Tauri 2

Install once per machine (Rust toolchain required), then scaffold:

```bash
bun add -D @tauri-apps/cli
bun x tauri init   # frontendDist → ../vite-app/dist, devUrl → http://localhost:5173
```

`src-tauri/tauri.conf.json` essentials:

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

Renderer side:

```tsx
<Win31Window title="My App" dragMode="tauri">…</Win31Window>
```

`dragMode="tauri"` renders `data-tauri-drag-region` on the title bar; Tauri
drags the native window (requires `decorations: false`).

### CSP notes

- The library's dynamic inline styles are limited to drag positioning
  (`left/top/position`). If you disallow `'unsafe-inline'`, generate a nonce in
  the shell and inject it into `style-src 'nonce-…'` — or keep `dragMode="manual"`
  which still needs `style-src 'unsafe-inline'` for the same reason.
- `img-src` must allow `data:` (pixel SVG icons in the stylesheet).

## Which dragMode to pick

| Scenario | Recommendation |
|---|---|
| Plain web / Next.js | `manual` or `none` |
| Electron | `electron` (OS-grade dragging, no JS overhead) |
| Tauri | `tauri` (native, respects `decorations: false`) |
| Embedding the window inside another layout | `manual` |

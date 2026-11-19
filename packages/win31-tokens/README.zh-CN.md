# @win31ui/tokens

Windows 3.1 设计令牌、像素字体、位图资源与基础样式表。

English docs: [README.md](./README.md)

- `win31.css` — CSS variables, six themes, fonts and all base component classes (`win31-*`).
- `assets/fonts` — Pixelated MS Sans Serif (woff2).
- `assets/img` — pixel icons and wallpapers.

Themes are selected by setting `data-win31-theme` on `<html>`:
`light` (default), `dark`, `fun`, `mahogany`, `emerald`, `cinnamon`.

The stylesheet references assets with relative URLs, so any bundler that
resolves CSS `url()` (Vite, Next.js, webpack, esbuild) copies them
automatically. Electron and Tauri use the same bundlers, so no extra
configuration is required.

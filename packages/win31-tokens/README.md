# @win31ui/tokens

Windows 3.1 design tokens, pixel fonts, bitmap assets and the base stylesheet.

- `win31.css` — CSS variables, six themes, fonts and all base component classes (`win31-*`).
- `assets/fonts` — Pixelated MS Sans Serif (woff2).
- `assets/img` — pixel icons and wallpapers.

## Usage

```ts
import '@win31ui/tokens/win31.css'
```

Themes are selected by setting `data-win31-theme` on `<html>`:
`light` (default), `dark`, `fun`, `mahogany`, `emerald`, `cinnamon`.

```html
<html data-win31-theme="dark">
```

The stylesheet references assets with relative URLs, so any bundler that resolves
CSS `url()` (Vite, Next.js, webpack, esbuild) copies them automatically. Electron
and Tauri use the same bundlers, so no extra configuration is required.

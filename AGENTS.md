# AGENTS.md — AI coding guide for win31ui

Purpose: let any AI coding assistant contribute components that stay pixel-authentic
to Windows 3.1 and compatible with Web / SSR / Electron / Tauri. Read this before
writing code. (中文版：[AGENTS.zh-CN.md](./AGENTS.zh-CN.md))

## Project shape

```
packages/win31-tokens   static CSS + fonts + bitmaps. NO build step. Never add JS.
packages/win31-react    the component library. All TS/TSX lives under src/.
examples/vite-app       CSR demo; also the Electron/Tauri renderer.
examples/next-app       SSR demo; proves server rendering + hydration.
e2e/                    Playwright specs, one config per demo app.
```

## Non-negotiable rules

1. **Design is frozen.** Colors, bevels, sizes come from CSS variables in
   `packages/win31-tokens/win31.css` (`--win31-*`). Never hardcode colors,
   never add border-radius, gradients (except the ones already there), modern
   shadows, or emoji icons. If a value is missing, add a token to `:root` in
   the tokens package and reference the variable.
2. **Reuse class names.** Component classes are `win31-*` exactly as in the
   tokens stylesheet (e.g. `win31-button`, `is-pressed`, `is-dialog`). React
   components render these same class names; component-specific states go in
   `packages/win31-react/styles.css` using existing variable names.
3. **Naming.** Components and props: `Win31` prefix (`Win31Button`), props use
   `is*` prefixes for boolean state flags (`isDefault`, `pressed`) but plain
   names for native attributes. Files: one component per file in
   `src/components/`, kebab-case only for non-component files.
4. **Portability.** Published code must not import `process`, Node built-ins,
   `next/*`, or any bundler-specific API. React `^18.2 || ^19` only. No new
   runtime dependencies without explicit user approval.
5. **SSR safety.** No top-level `window`/`document` access. Guard browser-only
   code inside effects/handlers. Generate ids with `useId()`. The `'use client'`
   directive is injected into dist via `banner` in `tsup.config.ts` — keep that
   line intact.
6. **Electron/Tauri.** Never call Electron/Tauri APIs from the library. Support
   host-level dragging through the `dragMode` prop (`electron` → CSS class
   `is-electron-drag` applying `-webkit-app-region`, `tauri` →
   `data-tauri-drag-region`). Put vendor-prefixed styles into
   `packages/win31-react/styles.css` as classes — never inline styles, since
   jsdom cannot verify them.

## Adding a component (checklist)

1. Create `src/components/Thing.tsx` with:
   - exported `Win31ThingProps` interface extending the native HTML attributes
   - `forwardRef` for leaf interactive elements
   - short JSDoc on the component and on every non-obvious prop (LSP hover text)
2. Add state-only CSS to `packages/win31-react/styles.css` (variables from tokens only).
3. Export component + props type from `src/index.ts` (keep alphabetical grouping).
4. Unit test `src/__tests__/Thing.test.tsx`: render, classes, callbacks,
   controlled/uncontrolled, disabled state, SSR-safe props.
5. If visually significant, add an e2e assertion or screenshot in `e2e/`.
6. Update both READMEs (EN + zh-CN) and the component table.
7. Run: `npm run typecheck && npm test`.

## Commands

| Command | Effect |
|---|---|
| `npm install` | install all workspaces (bun install hits a Windows EPERM bug on this machine) |
| `npm run build` | tsup build of `@win31ui/react` (esm + cjs + d.ts) |
| `npm run typecheck` | strict tsc across packages |
| `npm test` | vitest unit suite |
| `npm run test:e2e:vite` / `npm run test:e2e:next` | Playwright (system Edge; never `playwright install`) |
| `npm run dev:vite` / `npm run dev:next` | run demos on :5173 / :3000 |

## Testing expectations

- Every public component has a matching `*.test.tsx` covering: base class,
  variants, callbacks, controlled props, ref forwarding where applicable.
- e2e must keep passing: render, interaction, theme switch, SSR markup
  (`request.get`), hydration-error scan, visual snapshots.
- Playwright uses `channel: 'msedge'` (system Edge). Do not run
  `playwright install` — browsers are already on this machine.
- Visual snapshots: regenerate with `npm run test:e2e:vite -- --update-snapshots`
  after intentional visual changes; never edit PNGs by hand.

## Publishing

- Packages: `@win31ui/tokens`, `@win31ui/react`; `publishConfig.access: public`.
- Before first publish: create the `win31ui` npm org or rename the scope;
  verify with `npm publish --dry-run` from `packages/*`.
- `files` field is the release surface: never add `src/` to `files` for react
  (only `dist`), and keep `assets/` for tokens.

## Design reference

Canonical visual reference lives in the VBSS docs (not in this repo):
`D:/VBSS/docs/win31/[Win31]设计规范.html`. When in doubt about how a control
looks, replicate that markup/classes; the tokens CSS is the single source of truth.

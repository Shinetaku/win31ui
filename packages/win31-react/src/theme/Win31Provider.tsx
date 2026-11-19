import {
  createContext,
  useContext,
  useEffect,
  type ReactNode
} from 'react'

/** All themes shipped in `@win31ui/tokens`. `light` is the `:root` default. */
export const win31Themes = [
  'light',
  'dark',
  'fun',
  'mahogany',
  'emerald',
  'cinnamon'
] as const

export type Win31Theme = (typeof win31Themes)[number]

/**
 * Sets the active theme by toggling `data-win31-theme` on a root element
 * (defaults to `document.documentElement`). Client-side only.
 */
export function applyWin31Theme(theme: Win31Theme, root?: HTMLElement): void {
  const el = root ?? document.documentElement
  if (theme === 'light') delete el.dataset.win31Theme
  else el.dataset.win31Theme = theme
}

export interface Win31ProviderProps {
  /** Theme to activate. Defaults to `'light'`. */
  theme?: Win31Theme
  children?: ReactNode
}

const Win31ThemeContext = createContext<Win31Theme>('light')

/**
 * Provides the theme to `useWin31Theme()` and keeps `data-win31-theme`
 * on `<html>` in sync after hydration. On the server render the initial
 * theme by setting the attribute on `<html>` yourself, e.g.
 * `<html data-win31-theme="dark">`.
 */
export function Win31Provider({ theme = 'light', children }: Win31ProviderProps) {
  useEffect(() => {
    applyWin31Theme(theme)
  }, [theme])
  return <Win31ThemeContext.Provider value={theme}>{children}</Win31ThemeContext.Provider>
}

/** Returns the theme provided by the nearest `Win31Provider` (default `'light'`). */
export function useWin31Theme(): Win31Theme {
  return useContext(Win31ThemeContext)
}

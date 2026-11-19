'use client'

import { useState } from 'react'
import { Win31Button, Win31Provider, win31Themes, type Win31Theme } from '@win31ui/react'

/**
 * Client Component boundary: only this file ships JavaScript; the page
 * window stays server-rendered. Provider writes data-win31-theme on <html>
 * after hydration; layout already set it server-side.
 */
export function ThemeSwitcher() {
  const [theme, setTheme] = useState<Win31Theme>('light')
  return (
    <Win31Provider theme={theme}>
      <div className="win31-toolbar-inline">
        <span className="win31-label">Theme:</span>
        <select
          className="win31-select"
          value={theme}
          onChange={(event) => setTheme(event.target.value as Win31Theme)}
        >
          {win31Themes.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <Win31Button small onClick={() => setTheme('light')}>
          Reset
        </Win31Button>
      </div>
    </Win31Provider>
  )
}

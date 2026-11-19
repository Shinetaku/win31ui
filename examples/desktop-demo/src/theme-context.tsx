import { createContext, useContext, type Dispatch, type SetStateAction } from 'react'
import type { Win31Theme } from '@win31ui/react'

export interface DemoThemeContextValue {
  theme: Win31Theme
  setTheme: Dispatch<SetStateAction<Win31Theme>>
}

export const DemoThemeContext = createContext<DemoThemeContextValue>({
  theme: 'light',
  setTheme: () => {}
})

export function useDemoTheme(): DemoThemeContextValue {
  return useContext(DemoThemeContext)
}

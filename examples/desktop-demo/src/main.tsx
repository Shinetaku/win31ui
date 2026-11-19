import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@win31ui/react/win31.css'
import '@win31ui/react/styles.css'
import './desktop.css'
import { DesktopApp } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DesktopApp />
  </StrictMode>
)

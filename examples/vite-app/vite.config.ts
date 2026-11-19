import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: { host: '127.0.0.1', port: 5173, strictPort: true },
  // Electron/Tauri load this build via file:// — keep asset URLs relative.
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})

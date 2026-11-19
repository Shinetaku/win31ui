import { defineConfig, devices } from '@playwright/test'

/** e2e for the Vite demo (also the Electron/Tauri renderer). */
export default defineConfig({
  testDir: '.',
  testMatch: /vite\.spec\.ts/,
  outputDir: '../test-results/vite',
  fullyParallel: true,
  retries: 0,
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'on-first-retry'
  },
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.02 }
  },
  webServer: {
    command: 'npm run dev -w @win31ui/example-vite -- --port 5173 --strictPort',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: true,
    timeout: 60_000
  },
  // System browsers only — no bundled Chromium downloads.
  projects: [{ name: 'edge', use: { ...devices['Desktop Chrome'], channel: 'msedge' } }]
})

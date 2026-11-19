import { defineConfig, devices } from '@playwright/test'

/** e2e for the Windows 3.1 desktop replica demo. */
export default defineConfig({
  testDir: '.',
  testMatch: /desktop\.spec\.ts/,
  outputDir: '../test-results/desktop',
  fullyParallel: true,
  retries: 0,
  use: {
    baseURL: 'http://127.0.0.1:5174',
    trace: 'on-first-retry'
  },
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.02 }
  },
  webServer: {
    command: 'npm run dev -w @win31ui/example-desktop',
    url: 'http://127.0.0.1:5174',
    reuseExistingServer: true,
    timeout: 60_000
  },
  // System browsers only — no bundled Chromium downloads.
  projects: [{ name: 'edge', use: { ...devices['Desktop Chrome'], channel: 'msedge' } }]
})

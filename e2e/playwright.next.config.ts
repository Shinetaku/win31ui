import { defineConfig, devices } from '@playwright/test'

/** e2e for the Next.js SSR demo. */
export default defineConfig({
  testDir: '.',
  testMatch: /next\.spec\.ts/,
  outputDir: '../test-results/next',
  fullyParallel: true,
  retries: 0,
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry'
  },
  webServer: {
    command: 'npm run dev -w @win31ui/example-next -- --port 3000',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: true,
    timeout: 120_000
  },
  // System browsers only — no bundled Chromium downloads.
  projects: [{ name: 'edge', use: { ...devices['Desktop Chrome'], channel: 'msedge' } }]
})

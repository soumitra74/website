import { defineConfig, devices } from '@playwright/test'

// Post-deployment sanity checks against a live URL. Read-only: no server is started.
// Override the target with BASE_URL=https://... (e.g. a Vercel preview).
const baseURL = (process.env.BASE_URL || 'https://soumitraghosh.in').replace(/\/+$/, '')

export default defineConfig({
  testDir: './smoke',
  timeout: 30_000,
  fullyParallel: true,
  retries: 2,
  reporter: [['list']],
  use: {
    baseURL,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})

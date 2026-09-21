import { defineConfig, devices } from '@playwright/test'

// Non-functional checks (performance, accessibility, SEO, responsiveness, delivery) against
// a live URL. Override with BASE_URL=https://... Run from a normal machine: timings from
// a throttled CI runner or a cold cache can exceed budgets, hence the retries.
const baseURL = (process.env.BASE_URL || 'https://soumitraghosh.in').replace(/\/+$/, '')

export default defineConfig({
  testDir: './nfr',
  timeout: 60_000,
  fullyParallel: false,
  workers: 1, // parallel pages compete for CPU and skew timing metrics
  retries: 1,
  reporter: [['list']],
  use: { baseURL, trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})

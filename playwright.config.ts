import { defineConfig, devices } from '@playwright/test'

const PORT = 3000

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // Local runs (including pre-push) expect `npm run dev` already on PORT. CI can start it.
  ...(process.env.CI
    ? {
        webServer: {
          command: 'npm run dev',
          url: `http://localhost:${PORT}`,
          reuseExistingServer: false,
          timeout: 120_000,
        },
      }
    : {}),
})

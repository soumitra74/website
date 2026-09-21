import { defineConfig, devices } from '@playwright/test'

// Local-only NFR suite. Expect `npm run dev` on PORT (same as e2e / pre-push).
// Public/prod URLs are rejected — use smoke for post-deploy checks.
// Escape hatch (rare): ALLOW_NFR_REMOTE=1 BASE_URL=https://about.soumitraghosh.in npm run test:nfr
const PORT = 3000
const baseURL = (process.env.BASE_URL || `http://localhost:${PORT}`).replace(/\/+$/, '')

const isLocal =
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(baseURL)

if (!isLocal && process.env.ALLOW_NFR_REMOTE !== '1') {
  throw new Error(
    `NFR tests must target localhost, not ${baseURL}. ` +
      `Unset BASE_URL (defaults to http://localhost:${PORT}), or set ALLOW_NFR_REMOTE=1 to override.`
  )
}

export default defineConfig({
  testDir: './nfr',
  globalSetup: './nfr/global-setup.ts',
  globalTeardown: './nfr/global-teardown.ts',
  timeout: 60_000,
  fullyParallel: false,
  workers: 1, // parallel pages compete for CPU and skew timing metrics
  retries: 1,
  reporter: [['list']],
  use: { baseURL, trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})

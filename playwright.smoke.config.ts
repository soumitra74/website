import { defineConfig, devices } from '@playwright/test'

// Post-deployment sanity checks against the public site. Read-only: no server is started.
// Override with BASE_URL=https://... (e.g. a Vercel preview). Localhost is rejected —
// use `npm run test:e2e` or `npm run test:nfr` for local runs.
export const PUBLIC_SITE_URL = 'https://about.soumitraghosh.in'

const baseURL = (process.env.BASE_URL || PUBLIC_SITE_URL).replace(/\/+$/, '')

if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(baseURL)) {
  throw new Error(
    `Smoke/sanity tests must target a public URL, not ${baseURL}. ` +
      `Unset BASE_URL (defaults to ${PUBLIC_SITE_URL}) or pass a deployed URL.`
  )
}

export default defineConfig({
  testDir: './smoke',
  timeout: 30_000,
  fullyParallel: true,
  retries: 2,
  reporter: [['list'], ['json', { outputFile: 'smoke-results.json' }]],
  use: {
    baseURL,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})

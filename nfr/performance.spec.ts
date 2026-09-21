import { expect, test } from '@playwright/test'
import { measureMedian, perfRuns } from './baseline-lib'
import { pages } from './pages'
import { recordMetric } from './record'

// Budgets follow Google's "good" Core Web Vitals thresholds, plus a page-weight cap.
const budget = {
  ttfbMs: 800,
  lcpMs: 2500,
  cls: 0.1,
  transferKB: 3000,
  requests: 80,
}

// Playwright tracing adds ~300ms to client-rendered pages' LCP, which would skew every measurement.
test.use({ trace: 'off' })

for (const path of pages) {
  test(`${path} meets performance budgets`, async ({ browser, baseURL }) => {
    test.setTimeout(30_000 * perfRuns() + 30_000)
    // Median of several cold loads, the same method as the baseline, so the comparison is like for like.
    const m = await measureMedian(browser, baseURL + path)
    console.log(
      `${path}: ttfb=${m.ttfb.toFixed(0)}ms lcp=${m.lcp.toFixed(0)}ms cls=${m.cls.toFixed(3)} ` +
        `transfer=${m.transferKB.toFixed(0)}KB requests=${m.requests}`
    )

    for (const key of ['ttfb', 'lcp', 'cls', 'transferKB', 'requests'] as const) {
      recordMetric(path, key, m[key])
    }

    expect.soft(m.ttfb, 'TTFB (ms)').toBeLessThan(budget.ttfbMs)
    expect.soft(m.lcp, 'LCP (ms)').toBeGreaterThan(0)
    expect.soft(m.lcp, 'LCP (ms)').toBeLessThan(budget.lcpMs)
    expect.soft(m.cls, 'CLS').toBeLessThan(budget.cls)
    expect.soft(m.transferKB, 'transferred KB').toBeLessThan(budget.transferKB)
    expect.soft(m.requests, 'request count').toBeLessThan(budget.requests)
  })
}

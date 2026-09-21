import { expect, test } from '@playwright/test'
import { pages } from './pages'

// Budgets follow Google's "good" Core Web Vitals thresholds, plus a page-weight cap.
const budget = {
  ttfbMs: 800,
  lcpMs: 2500,
  cls: 0.1,
  transferKB: 3000,
  requests: 80,
}

for (const path of pages) {
  test(`${path} meets performance budgets`, async ({ page }) => {
    await page.addInitScript(() => {
      ;(window as any).__lcp = 0
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        ;(window as any).__lcp = entries[entries.length - 1].startTime
      }).observe({ type: 'largest-contentful-paint', buffered: true })
    })
    await page.goto(path, { waitUntil: 'load' })
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000) // let late layout shifts and LCP candidates settle

    const m = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      const shifts = performance.getEntriesByType('layout-shift') as any[]
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
      return {
        ttfb: nav.responseStart,
        lcp: (window as any).__lcp as number,
        cls: shifts.filter((s) => !s.hadRecentInput).reduce((sum, s) => sum + s.value, 0),
        transferKB: (nav.transferSize + resources.reduce((s, r) => s + r.transferSize, 0)) / 1024,
        requests: resources.length + 1,
      }
    })
    console.log(
      `${path}: ttfb=${m.ttfb.toFixed(0)}ms lcp=${m.lcp.toFixed(0)}ms cls=${m.cls.toFixed(3)} ` +
        `transfer=${m.transferKB.toFixed(0)}KB requests=${m.requests}`
    )

    expect.soft(m.ttfb, 'TTFB (ms)').toBeLessThan(budget.ttfbMs)
    expect.soft(m.lcp, 'LCP (ms)').toBeGreaterThan(0)
    expect.soft(m.lcp, 'LCP (ms)').toBeLessThan(budget.lcpMs)
    expect.soft(m.cls, 'CLS').toBeLessThan(budget.cls)
    expect.soft(m.transferKB, 'transferred KB').toBeLessThan(budget.transferKB)
    expect.soft(m.requests, 'request count').toBeLessThan(budget.requests)
  })
}

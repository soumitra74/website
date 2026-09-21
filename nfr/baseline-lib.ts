import type { Browser } from '@playwright/test'
import path from 'path'

export type MetricKey = 'ttfb' | 'lcp' | 'cls' | 'transferKB' | 'requests' | 'a11y'
export type PageMetrics = Record<MetricKey, number>
export type Snapshot<T = PageMetrics> = {
  meta: { baseUrl: string; capturedAt: string; runs: number }
  pages: Record<string, T>
}

export const nfrBaseUrl = (fallback: string) => (process.env.BASE_URL || fallback).replace(/\/+$/, '')

export const isLocalUrl = (url: string) => /^https?:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(url)

export const baselinePathFor = (local: boolean) =>
  path.join(__dirname, local ? 'baseline.local.json' : 'baseline.json')

// Differences smaller than max(abs, pct * baseline) count as noise.
export const metrics: Array<{
  key: MetricKey
  label: string
  unit: string
  digits: number
  abs: number
  pct: number
}> = [
  { key: 'ttfb', label: 'TTFB', unit: 'ms', digits: 0, abs: 100, pct: 0.5 },
  { key: 'lcp', label: 'LCP', unit: 'ms', digits: 0, abs: 200, pct: 0.25 },
  { key: 'cls', label: 'CLS', unit: '', digits: 3, abs: 0.02, pct: 0 },
  { key: 'transferKB', label: 'Transfer', unit: 'KB', digits: 0, abs: 20, pct: 0.05 },
  { key: 'requests', label: 'Requests', unit: '', digits: 0, abs: 1, pct: 0 },
  { key: 'a11y', label: 'A11y issues', unit: '', digits: 0, abs: 0, pct: 0 },
]

const useColor = () => process.stdout.isTTY && !process.env.NO_COLOR
const paint = (code: number, text: string) => (useColor() ? `\x1b[${code}m${text}\x1b[0m` : text)
const strip = (s: string) => s.replace(/\x1b\[[0-9;]*m/g, '')

// Prints a table of current vs baseline. Metrics missing from `cur` (e.g. a partial run) are skipped.
export function compare(base: Snapshot, cur: Snapshot<Partial<PageMetrics>>) {
  console.log(`\nBaseline: ${base.meta.baseUrl}  captured ${base.meta.capturedAt}  (median of ${base.meta.runs})`)
  console.log(`Current:  ${cur.meta.baseUrl}  captured ${cur.meta.capturedAt}  (median of ${cur.meta.runs})`)
  if (base.meta.baseUrl !== cur.meta.baseUrl) {
    console.log(paint(33, 'Warning: baseline and current were measured against different URLs.'))
  }

  const rows: string[][] = [['Page', 'Metric', 'Baseline', 'Current', 'Delta', 'Status']]
  let better = 0, worse = 0, same = 0

  for (const route of Object.keys(cur.pages)) {
    const b = base.pages[route]
    if (!b) {
      rows.push([route, '(not in baseline)', '', '', '', paint(33, 'new')])
      continue
    }
    for (const m of metrics) {
      const after = cur.pages[route][m.key]
      if (after === undefined) continue
      const before = b[m.key]
      const delta = after - before
      const tolerance = Math.max(m.abs, Math.abs(before) * m.pct)
      let status: string
      if (Math.abs(delta) <= tolerance) { status = paint(90, '≈ same'); same++ }
      else if (delta > 0) { status = paint(31, 'worse'); worse++ }
      else { status = paint(32, 'better'); better++ }
      const sign = (n: number) => (n >= 0 ? '+' : '')
      const pct = before !== 0 ? ` (${sign(delta)}${((delta / before) * 100).toFixed(0)}%)` : ''
      rows.push([
        route,
        m.label,
        `${before.toFixed(m.digits)}${m.unit}`,
        `${after.toFixed(m.digits)}${m.unit}`,
        `${sign(delta)}${delta.toFixed(m.digits)}${m.unit}${pct}`,
        status,
      ])
    }
  }

  const widths = rows[0].map((_, i) => Math.max(...rows.map((r) => strip(r[i]).length)))
  const line = (r: string[]) =>
    r.map((c, i) => c + ' '.repeat(widths[i] - strip(c).length)).join('  ').trimEnd()
  console.log()
  console.log(line(rows[0]))
  console.log(widths.map((w) => '-'.repeat(w)).join('  '))
  let last = ''
  for (const r of rows.slice(1)) {
    if (r[0] === last && r[0] !== '') console.log(line(['', ...r.slice(1)]))
    else { console.log(line(r)); last = r[0] }
  }
  console.log(
    `\n${paint(32, `${better} better`)}, ${paint(31, `${worse} worse`)}, ${same} within noise ` +
      `(tolerance: TTFB ±100ms/50%, LCP ±200ms/25%, CLS ±0.02, transfer ±20KB/5%, requests ±1, a11y ±0)`
  )
  return { better, worse, same }
}

export const median = (values: number[]) => {
  const s = [...values].sort((a, b) => a - b)
  const mid = Math.floor(s.length / 2)
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2
}

export const perfRuns = () => Number(process.env.NFR_RUNS || 3)

export type PerfSample = Omit<PageMetrics, 'a11y'>

// One cold-cache page load in a fresh browser context.
export async function measurePerformance(browser: Browser, url: string): Promise<PerfSample> {
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.addInitScript(() => {
    ;(window as any).__lcp = 0
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      ;(window as any).__lcp = entries[entries.length - 1].startTime
    }).observe({ type: 'largest-contentful-paint', buffered: true })
  })
  await page.goto(url, { waitUntil: 'load' })
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
  await context.close()
  return m
}

// Median of `runs` cold loads, per metric.
export async function measureMedian(browser: Browser, url: string, runs = perfRuns()): Promise<PerfSample> {
  const samples: PerfSample[] = []
  for (let i = 0; i < runs; i++) samples.push(await measurePerformance(browser, url))
  const pick = (k: keyof PerfSample) => median(samples.map((s) => s[k]))
  return { ttfb: pick('ttfb'), lcp: pick('lcp'), cls: pick('cls'), transferKB: pick('transferKB'), requests: pick('requests') }
}

import AxeBuilder from '@axe-core/playwright'
import { chromium, type Browser } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { pages } from '../nfr/pages'

// Usage: vite-node scripts/nfr-metrics.ts <baseline|compare> [--local] [--check]
//   baseline  measure and write the baseline file
//   compare   measure and print a comparison against the baseline (--check exits 1 on regressions)
//   --local   target the dev server (http://localhost:3000) and use nfr/baseline.local.json
// Default target is production (nfr/baseline.json). BASE_URL overrides the URL, NFR_RUNS the
// number of runs per page (default 3, the median is used). Dev-server timings are not
// comparable with production, so each target keeps its own baseline.

const args = process.argv.slice(2)
const local = args.includes('--local')
const baseUrl = (
  process.env.BASE_URL || (local ? 'http://localhost:3000' : 'https://soumitraghosh.in')
).replace(/\/+$/, '')
const runs = Number(process.env.NFR_RUNS || 3)
const root = path.join(__dirname, '..', 'nfr')
const suffix = local ? '.local' : ''
const baselinePath = path.join(root, `baseline${suffix}.json`)
const currentPath = path.join(root, `current${suffix}.json`)

type PageMetrics = {
  ttfb: number
  lcp: number
  cls: number
  transferKB: number
  requests: number
  a11y: number
}
type Snapshot = {
  meta: { baseUrl: string; capturedAt: string; runs: number }
  pages: Record<string, PageMetrics>
}

// Differences smaller than max(abs, pct * baseline) count as noise.
const metrics: Array<{ key: keyof PageMetrics; label: string; unit: string; digits: number; abs: number; pct: number }> = [
  { key: 'ttfb', label: 'TTFB', unit: 'ms', digits: 0, abs: 100, pct: 0.5 },
  { key: 'lcp', label: 'LCP', unit: 'ms', digits: 0, abs: 200, pct: 0.25 },
  { key: 'cls', label: 'CLS', unit: '', digits: 3, abs: 0.02, pct: 0 },
  { key: 'transferKB', label: 'Transfer', unit: 'KB', digits: 0, abs: 20, pct: 0.05 },
  { key: 'requests', label: 'Requests', unit: '', digits: 0, abs: 1, pct: 0 },
  { key: 'a11y', label: 'A11y issues', unit: '', digits: 0, abs: 0, pct: 0 },
]

const median = (values: number[]) => {
  const s = [...values].sort((a, b) => a - b)
  const mid = Math.floor(s.length / 2)
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2
}

async function measurePerformance(browser: Browser, route: string) {
  const context = await browser.newContext() // fresh context each run: cold cache
  const page = await context.newPage()
  await page.addInitScript(() => {
    ;(window as any).__lcp = 0
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      ;(window as any).__lcp = entries[entries.length - 1].startTime
    }).observe({ type: 'largest-contentful-paint', buffered: true })
  })
  await page.goto(baseUrl + route, { waitUntil: 'load' })
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1000)
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

// Serious and critical axe nodes, summed over the light and dark themes.
async function measureAccessibility(browser: Browser, route: string) {
  let total = 0
  for (const theme of ['light', 'dark']) {
    const context = await browser.newContext()
    const page = await context.newPage()
    await page.addInitScript((t) => localStorage.setItem('theme', t), theme)
    await page.goto(baseUrl + route)
    await page.waitForLoadState('networkidle')
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()
    total += results.violations
      .filter((v) => v.impact === 'serious' || v.impact === 'critical')
      .reduce((sum, v) => sum + v.nodes.length, 0)
    await context.close()
  }
  return total
}

async function collect(): Promise<Snapshot> {
  const browser = await chromium.launch()
  const snapshot: Snapshot = {
    meta: { baseUrl, capturedAt: new Date().toISOString(), runs },
    pages: {},
  }
  try {
    for (const route of pages) {
      process.stdout.write(`measuring ${route} ...`)
      const samples = []
      for (let i = 0; i < runs; i++) samples.push(await measurePerformance(browser, route))
      const pick = (k: keyof (typeof samples)[number]) => median(samples.map((s) => s[k]))
      snapshot.pages[route] = {
        ttfb: pick('ttfb'),
        lcp: pick('lcp'),
        cls: pick('cls'),
        transferKB: pick('transferKB'),
        requests: pick('requests'),
        a11y: await measureAccessibility(browser, route),
      }
      process.stdout.write(' done\n')
    }
  } finally {
    await browser.close()
  }
  return snapshot
}

const useColor = process.stdout.isTTY && !process.env.NO_COLOR
const paint = (code: number, text: string) => (useColor ? `\x1b[${code}m${text}\x1b[0m` : text)
const fmt = (v: number, digits: number) => v.toFixed(digits)

function compare(base: Snapshot, cur: Snapshot) {
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
      const before = b[m.key]
      const after = cur.pages[route][m.key]
      const delta = after - before
      const tolerance = Math.max(m.abs, Math.abs(before) * m.pct)
      let status: string
      if (Math.abs(delta) <= tolerance) { status = paint(90, '≈ same'); same++ }
      else if (delta > 0) { status = paint(31, 'worse'); worse++ }
      else { status = paint(32, 'better'); better++ }
      const pct = before !== 0 ? ` (${delta >= 0 ? '+' : ''}${((delta / before) * 100).toFixed(0)}%)` : ''
      rows.push([
        route,
        m.label,
        `${fmt(before, m.digits)}${m.unit}`,
        `${fmt(after, m.digits)}${m.unit}`,
        `${delta >= 0 ? '+' : ''}${fmt(delta, m.digits)}${m.unit}${pct}`,
        status,
      ])
    }
  }

  const strip = (s: string) => s.replace(/\x1b\[[0-9;]*m/g, '')
  const widths = rows[0].map((_, i) => Math.max(...rows.map((r) => strip(r[i]).length)))
  const line = (r: string[]) =>
    r.map((c, i) => c + ' '.repeat(widths[i] - strip(c).length)).join('  ').trimEnd()
  console.log()
  console.log(line(rows[0]))
  console.log(widths.map((w) => '-'.repeat(w)).join('  '))
  let last = ''
  for (const r of rows.slice(1)) {
    if (r[0] === last && r[0] !== '') { console.log(line(['', ...r.slice(1)])) } else { console.log(line(r)); last = r[0] }
  }
  console.log(
    `\n${paint(32, `${better} better`)}, ${paint(31, `${worse} worse`)}, ${same} within noise ` +
      `(tolerance: TTFB ±100ms/50%, LCP ±200ms/25%, CLS ±0.02, transfer ±20KB/5%, requests ±1, a11y ±0)`
  )
  return worse
}

async function main() {
  const flags = args.filter((a) => a.startsWith('--'))
  const mode = args.find((a) => !a.startsWith('--'))
  if (mode !== 'baseline' && mode !== 'compare') {
    console.error('Usage: vite-node scripts/nfr-metrics.ts <baseline|compare> [--local] [--check]')
    process.exit(2)
  }

  const snapshot = await collect()

  if (mode === 'baseline') {
    fs.writeFileSync(baselinePath, JSON.stringify(snapshot, null, 2) + '\n')
    console.log(`\nBaseline written to ${path.relative(process.cwd(), baselinePath)} (${baseUrl})`)
    return
  }

  if (!fs.existsSync(baselinePath)) {
    console.error(`No baseline found. Run \`npm run nfr:baseline${local ? ':local' : ''}\` first.`)
    process.exit(2)
  }
  fs.writeFileSync(currentPath, JSON.stringify(snapshot, null, 2) + '\n')
  const regressions = compare(JSON.parse(fs.readFileSync(baselinePath, 'utf8')), snapshot)
  if (flags.includes('--check') && regressions > 0) process.exit(1)
}

main().catch((err) => {
  console.error(err)
  process.exit(2)
})

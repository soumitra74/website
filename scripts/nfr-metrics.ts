import AxeBuilder from '@axe-core/playwright'
import { chromium, type Browser } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { baselinePathFor, compare, isLocalUrl, measureMedian, type Snapshot } from '../nfr/baseline-lib'
import { pages } from '../nfr/pages'

// Usage: vite-node scripts/nfr-metrics.ts <baseline|compare> [--local] [--check]
//   baseline  measure and write the baseline file
//   compare   measure and print a comparison against the baseline (--check exits 1 on regressions)
//   --local   target the dev server (http://localhost:3000) and use nfr/baseline.local.json
// Default target is production (nfr/baseline.json). BASE_URL overrides the URL, NFR_RUNS the
// number of runs per page (default 3, the median is used). Dev-server timings are not
// comparable with production, so each target keeps its own baseline.

const args = process.argv.slice(2)
const baseUrl = (
  process.env.BASE_URL ||
  (args.includes('--local') ? 'http://localhost:3000' : 'https://soumitraghosh.in')
).replace(/\/+$/, '')
// The baseline follows the target: localhost uses baseline.local.json, anything else baseline.json.
const local = isLocalUrl(baseUrl)
const runs = Number(process.env.NFR_RUNS || 3)
const root = path.join(__dirname, '..', 'nfr')
const suffix = local ? '.local' : ''
const baselinePath = baselinePathFor(local)
const currentPath = path.join(root, `current${suffix}.json`)

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
      const perf = await measureMedian(browser, baseUrl + route, runs)
      snapshot.pages[route] = {
        ...perf,
        a11y: await measureAccessibility(browser, route),
      }
      process.stdout.write(' done\n')
    }
  } finally {
    await browser.close()
  }
  return snapshot
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
  const { worse: regressions } = compare(JSON.parse(fs.readFileSync(baselinePath, 'utf8')), snapshot)
  if (flags.includes('--check') && regressions > 0) process.exit(1)
}

main().catch((err) => {
  console.error(err)
  process.exit(2)
})

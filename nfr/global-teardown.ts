import fs from 'fs'
import path from 'path'
import { baselinePathFor, compare, isLocalUrl, nfrBaseUrl, perfRuns, type PageMetrics, type Snapshot } from './baseline-lib'
import { metricsDir } from './record'

// Metrics that are only meaningful when every variant was measured.
const requiredVariants: Record<string, string[]> = { a11y: ['light', 'dark'] }

export default async function globalTeardown() {
  if (!fs.existsSync(metricsDir)) return
  const files = fs.readdirSync(metricsDir).filter((f) => f.endsWith('.json')).sort()
  if (files.length === 0) return

  // route -> metric -> variant -> value; later files (retries) override earlier ones.
  const raw: Record<string, Record<string, Record<string, number>>> = {}
  for (const file of files) {
    const { route, metric, variant, value } = JSON.parse(fs.readFileSync(path.join(metricsDir, file), 'utf8'))
    ;((raw[route] ||= {})[metric] ||= {})[variant] = value
  }
  fs.rmSync(metricsDir, { recursive: true, force: true })

  const pages: Record<string, Partial<PageMetrics>> = {}
  for (const [route, byMetric] of Object.entries(raw)) {
    for (const [metric, byVariant] of Object.entries(byMetric)) {
      const needed = requiredVariants[metric]
      if (needed && !needed.every((v) => v in byVariant)) continue
      ;(pages[route] ||= {})[metric as keyof PageMetrics] = Object.values(byVariant).reduce((a, b) => a + b, 0)
    }
  }
  if (Object.keys(pages).length === 0) return

  // Same default as playwright.nfr.config.ts.
  const baseUrl = nfrBaseUrl('http://localhost:3000')
  const local = isLocalUrl(baseUrl)
  const baselinePath = baselinePathFor(local)
  console.log('\n──────── NFR baseline comparison ────────')
  if (!fs.existsSync(baselinePath)) {
    console.log(`No baseline for ${baseUrl}. Run \`npm run nfr:baseline${local ? ':local' : ''}\` to create one.`)
    return
  }

  const baseline: Snapshot = JSON.parse(fs.readFileSync(baselinePath, 'utf8'))
  compare(baseline, {
    meta: { baseUrl, capturedAt: new Date().toISOString(), runs: perfRuns() },
    pages,
  })
}

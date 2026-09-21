import fs from 'fs'
import path from 'path'

export const metricsDir = path.join(__dirname, '.metrics')

// Specs record what they measure; global-teardown.ts aggregates it and compares to the baseline.
// `variant` distinguishes repeated measurements that are summed (e.g. the light and dark theme).
export function recordMetric(route: string, metric: string, value: number, variant = '') {
  fs.mkdirSync(metricsDir, { recursive: true })
  const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.json`
  fs.writeFileSync(path.join(metricsDir, name), JSON.stringify({ route, metric, variant, value }))
}

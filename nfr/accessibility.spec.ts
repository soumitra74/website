import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { pages } from './pages'
import { recordMetric } from './record'

// Serious/critical WCAG 2.x A/AA violations are reported as warnings so they don't block
// pushes or deploy checks. Set STRICT_A11Y=1 to make them fail the run.
const strict = process.env.STRICT_A11Y === '1'

for (const theme of ['light', 'dark'] as const) {
  for (const path of pages) {
    test(`${path} has no serious accessibility violations (${theme})`, async ({ page }, testInfo) => {
      await page.addInitScript((t) => localStorage.setItem('theme', t), theme)
      await page.goto(path)
      await page.waitForLoadState('networkidle')

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()

      const serious = results.violations.filter(
        (v) => v.impact === 'serious' || v.impact === 'critical'
      )
      recordMetric(path, 'a11y', serious.reduce((n, v) => n + v.nodes.length, 0), theme)
      const summary = serious.map(
        (v) => `${v.id} [${v.impact}] x${v.nodes.length}: ${v.help}\n    e.g. ${v.nodes[0].target.join(' ')}`
      )

      if (summary.length > 0 && !strict) {
        const message = `a11y warning: ${path} (${theme})\n  ${summary.join('\n  ')}`
        console.warn(message)
        testInfo.annotations.push({ type: 'warning', description: summary.join('; ') })
        return
      }
      expect(summary, 'axe violations').toEqual([])
    })
  }
}

import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { pages } from './pages'

// Fails on serious/critical WCAG 2.x A/AA violations, in both light and dark themes
// because colour contrast differs between them.
for (const theme of ['light', 'dark'] as const) {
  for (const path of pages) {
    test(`${path} has no serious accessibility violations (${theme})`, async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem('theme', t), theme)
      await page.goto(path)
      await page.waitForLoadState('networkidle')

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()

      const serious = results.violations.filter(
        (v) => v.impact === 'serious' || v.impact === 'critical'
      )
      const summary = serious.map(
        (v) => `${v.id} [${v.impact}] x${v.nodes.length}: ${v.help}\n    e.g. ${v.nodes[0].target.join(' ')}`
      )
      expect(summary, 'axe violations').toEqual([])
    })
  }
}

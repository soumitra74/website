import { expect, test } from '../support/diagnostics'

test.describe('home page', () => {
  test('renders hero, nav brand and About section from content', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('nav').getByText('Soumitra Ghosh').first()).toBeVisible()
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('#about')).toBeAttached()
    await expect(page.locator('#about h2')).not.toBeEmpty()
  })

  test('years of experience placeholder is interpolated', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('body')).not.toContainText('{{yearsOfExperience}}')
  })

  test('profile image loads', async ({ page }) => {
    await page.goto('/')
    const img = page.getByRole('img', { name: 'Soumitra Ghosh' })
    await expect(img).toBeVisible()
    await expect
      .poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0))
      .toBe(true)
  })

  test('nav anchor links point at sections that exist', async ({ page }) => {
    await page.goto('/')
    const hrefs = await page
      .locator('nav a[href^="#"]')
      .evaluateAll((els) => els.map((el) => el.getAttribute('href') as string))
    expect(hrefs.length).toBeGreaterThan(0)
    for (const href of hrefs) {
      await expect(page.locator(href)).toBeAttached()
    }
  })
})

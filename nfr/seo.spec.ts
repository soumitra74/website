import { expect, test } from '@playwright/test'
import { pages } from './pages'

for (const path of pages) {
  test(`${path} has essential metadata`, async ({ page }) => {
    await page.goto(path)

    await expect(page.locator('html')).toHaveAttribute('lang', /^[a-z]{2}/)
    await expect(page.locator('meta[name="viewport"]')).toHaveAttribute('content', /width=device-width/)

    const title = await page.title()
    expect(title.length, 'title length').toBeGreaterThanOrEqual(3)
    expect(title.length, 'title length').toBeLessThanOrEqual(70)

    const description = await page.locator('meta[name="description"]').getAttribute('content')
    expect(description, 'meta description').toBeTruthy()
    expect(description!.length, 'description length').toBeGreaterThanOrEqual(50)
    expect(description!.length, 'description length').toBeLessThanOrEqual(200)

    // Some pages render client-side, so wait for the heading instead of counting immediately.
    await expect(page.locator('h1'), 'number of <h1>').toHaveCount(1)
  })
}

test('home page has canonical and Open Graph metadata for sharing', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /^https?:\/\//)
  for (const property of ['og:title', 'og:description', 'og:image', 'og:url']) {
    await expect(
      page.locator(`meta[property="${property}"]`),
      `meta ${property}`
    ).toHaveAttribute('content', /.+/)
  }
})

test('all images have alt text', async ({ page }) => {
  for (const path of pages) {
    await page.goto(path)
    const missing = await page
      .locator('img:not([alt])')
      .evaluateAll((imgs) => (imgs as HTMLImageElement[]).map((i) => i.currentSrc || i.src))
    expect(missing, `images without alt on ${path}`).toEqual([])
  }
})

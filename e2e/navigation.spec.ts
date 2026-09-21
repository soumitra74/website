import { expect, test } from '@playwright/test'

const routes = [
  { path: '/', title: /Soumitra Ghosh/ },
  { path: '/ask-me', title: /Ask Me/ },
  { path: '/spot-me', title: /Spot Me/ },
  { path: '/now', title: /Now/ },
  { path: '/events', title: /.+/ },
  { path: '/career-timeline', title: /.+/ },
]

for (const { path, title } of routes) {
  test(`${path} loads without errors`, async ({ page }) => {
    const pageErrors: string[] = []
    page.on('pageerror', (err) => pageErrors.push(err.message))

    const response = await page.goto(path)
    expect(response?.status()).toBe(200)
    await expect(page).toHaveTitle(title)
    await expect(page.locator('h1').first()).toBeAttached()
    expect(pageErrors).toEqual([])
  })
}

test('unknown route returns 404', async ({ page }) => {
  const response = await page.goto('/does-not-exist')
  expect(response?.status()).toBe(404)
})

test('home page links to Ask Me', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: /Ask Me/ }).first().click()
  await expect(page).toHaveURL(/\/ask-me$/)
})

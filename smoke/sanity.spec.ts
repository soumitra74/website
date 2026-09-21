import { expect, test } from '../support/diagnostics'

const pages = ['/', '/ask-me', '/spot-me', '/now', '/now/archive', '/events', '/career-timeline']
const apis = [
  '/api/content',
  '/api/content-detailed',
  '/api/experience-dates',
  '/api/career-timeline',
  '/api/chatbot',
  '/api/daily-schedule',
  '/api/now',
  '/api/now-archive',
]

test.describe('pages', () => {
  for (const path of pages) {
    test(`${path} renders without errors`, async ({ page }) => {
      const response = await page.goto(path)
      expect(response?.status()).toBe(200)
      expect(
        page.url(),
        'landed on Vercel SSO — smoke must use the public domain, not a protected *.vercel.app URL'
      ).not.toMatch(/vercel\.com\/(login|sso)/i)
      await expect(page).toHaveTitle(/.+/)
      await expect(page.locator('h1').first()).toBeAttached()
      await page.waitForLoadState('networkidle')
    })
  }

  test('unknown route returns 404', async ({ page, diagnostics }) => {
    diagnostics.ignore(/this-page-does-not-exist/)
    const response = await page.goto('/this-page-does-not-exist')
    expect(response?.status()).toBe(404)
  })
})

test.describe('home page', () => {
  test('shows content with placeholders resolved', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('nav').getByText('Soumitra Ghosh').first()).toBeVisible()
    await expect(page.locator('#about h2')).not.toBeEmpty()
    await expect(page.locator('body')).not.toContainText('{{yearsOfExperience}}')
  })

  test('every image on the page loads', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const broken = await page.locator('img').evaluateAll((imgs) =>
      (imgs as HTMLImageElement[])
        .filter((img) => img.loading !== 'lazy' && !(img.complete && img.naturalWidth > 0))
        .map((img) => img.currentSrc || img.src)
    )
    expect(broken).toEqual([])
  })

  test('JavaScript hydrates: theme toggle switches to dark', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Light|Dark|Ambient/ }).first().click()
    await page.getByRole('button', { name: 'Dark' }).click()
    await expect(page.locator('html')).toHaveClass(/\bdark\b/)
  })
})

test.describe('ask-me', () => {
  test('chatbot data loads and the input is usable', async ({ page }) => {
    await page.goto('/ask-me')
    const input = page.locator('form input[type="text"]')
    await expect(input).toBeVisible({ timeout: 15_000 })
    await input.fill('hello')
    await expect(page.locator('form button[type="submit"]')).toBeEnabled()
  })
})

test.describe('data endpoints', () => {
  // The static export serves /api/* as application/octet-stream, so parse the body
  // instead of relying on the content type.
  for (const endpoint of apis) {
    test(`${endpoint} serves valid JSON`, async ({ request }) => {
      const response = await request.get(endpoint)
      expect(response.status()).toBe(200)
      const text = await response.text()
      expect(() => JSON.parse(text)).not.toThrow()
      expect(text).not.toContain('{{yearsOfExperience}}')
    })
  }
})

test.describe('deployment configuration', () => {
  test('security headers are present', async ({ request }) => {
    const headers = (await request.get('/')).headers()
    expect(headers['x-frame-options']).toBe('DENY')
    expect(headers['x-content-type-options']).toBe('nosniff')
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin')
    expect(headers['content-security-policy']).toContain("default-src 'self'")
  })

  test('robots.txt allows crawling and lists a sitemap', async ({ request }) => {
    const response = await request.get('/robots.txt')
    expect(response.status()).toBe(200)
    const body = await response.text()
    expect(body).toMatch(/User-Agent:\s*\*/i)
    expect(body).toMatch(/Sitemap:\s*https?:\/\//i)
  })

  test('sitemap paths all resolve on this deployment', async ({ request }) => {
    const response = await request.get('/sitemap.xml')
    expect(response.status()).toBe(200)
    const xml = await response.text()
    const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname)
    expect(paths.length).toBeGreaterThan(0)
    for (const path of paths) {
      const res = await request.get(path)
      expect(res.status(), `sitemap path ${path}`).toBe(200)
    }
  })
})

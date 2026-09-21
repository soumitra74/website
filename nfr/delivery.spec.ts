import { expect, test } from '@playwright/test'

const isLocal = (baseURL?: string) =>
  !!baseURL && (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(baseURL) || baseURL.includes('localhost'))

test('HTML is served compressed', async ({ request, baseURL }) => {
  test.skip(isLocal(baseURL), 'next dev does not compress responses')
  const res = await request.get('/', { headers: { 'accept-encoding': 'br, gzip' } })
  expect(res.headers()['content-encoding']).toMatch(/br|gzip/)
})

test('HTTPS is enforced with HSTS', async ({ request, baseURL }) => {
  test.skip(!baseURL?.startsWith('https://'), 'only meaningful for https targets')
  const res = await request.get('/')
  const hsts = res.headers()['strict-transport-security']
  expect(hsts, 'Strict-Transport-Security').toBeTruthy()
  const maxAge = Number(/max-age=(\d+)/.exec(hsts)?.[1] ?? 0)
  expect(maxAge).toBeGreaterThanOrEqual(15_552_000) // 180 days
})

test('http redirects to https', async ({ request, baseURL }) => {
  test.skip(!baseURL?.startsWith('https://'), 'only meaningful for https targets')
  const res = await request.get(baseURL!.replace('https://', 'http://'), { maxRedirects: 0 })
  expect([301, 302, 307, 308]).toContain(res.status())
  expect(res.headers()['location']).toMatch(/^https:\/\//)
})

test('fingerprinted static assets are cached immutably', async ({ page, baseURL }) => {
  test.skip(isLocal(baseURL), 'immutable cache headers are set by the CDN/host, not next dev')
  const assets = new Map<string, string>()
  page.on('response', (res) => {
    const url = new URL(res.url())
    if (url.pathname.startsWith('/_next/static/')) {
      assets.set(url.pathname, res.headers()['cache-control'] ?? '')
    }
  })
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  expect(assets.size, 'static assets seen').toBeGreaterThan(0)
  const weak = [...assets].filter(([, cc]) => !/immutable|max-age=31536000/.test(cc))
  expect(weak, 'static assets without long-lived caching').toEqual([])
})

test('JS and CSS assets over 1 KB are compressed', async ({ page, baseURL }) => {
  test.skip(isLocal(baseURL), 'next dev does not compress responses')
  const uncompressed: string[] = []
  page.on('response', (res) => {
    const type = res.headers()['content-type'] ?? ''
    const size = Number(res.headers()['content-length'] ?? 0)
    if (/javascript|css/.test(type) && !res.headers()['content-encoding'] && size > 1024) {
      uncompressed.push(res.url())
    }
  })
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  expect(uncompressed).toEqual([])
})

import { expect, test as base } from '@playwright/test'

// Shared by e2e/ and smoke/. Any test that uses `page` fails if the page logged a console
// error, threw an uncaught exception, had a request fail, or received an HTTP 4xx/5xx.
// Expected noise is opted out per test with `diagnostics.ignore(/regex/)`.
export type Diagnostics = {
  ignore: (pattern: RegExp) => void
  readonly patterns: RegExp[]
}

export const test = base.extend<{ diagnostics: Diagnostics }>({
  diagnostics: async ({}, use) => {
    const patterns: RegExp[] = []
    await use({ ignore: (pattern) => patterns.push(pattern), patterns })
  },

  page: async ({ page, diagnostics }, use, testInfo) => {
    const found: string[] = []

    page.on('console', (msg) => {
      if (msg.type() !== 'error') return
      const { url, lineNumber } = msg.location()
      found.push(`console.error: ${msg.text()}${url ? ` (${url}:${lineNumber})` : ''}`)
    })
    page.on('pageerror', (err) => found.push(`pageerror: ${err.message}`))
    page.on('requestfailed', (req) => {
      const reason = req.failure()?.errorText ?? 'unknown'
      // Aborted requests are the browser cancelling its own work (navigation, prefetch).
      if (reason === 'net::ERR_ABORTED') return
      found.push(`request failed: ${req.method()} ${req.url()} (${reason})`)
    })
    page.on('response', (res) => {
      if (res.status() >= 400) {
        found.push(`http ${res.status()}: ${res.request().method()} ${res.url()}`)
      }
    })

    await use(page)

    const unexpected = found.filter((entry) => !diagnostics.patterns.some((p) => p.test(entry)))
    if (found.length > 0) {
      await testInfo.attach('browser-diagnostics', {
        body: found.join('\n'),
        contentType: 'text/plain',
      })
    }
    expect(unexpected, 'browser console/network errors').toEqual([])
  },
})

export { expect }

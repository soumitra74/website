import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const DEFAULT = 'https://about.soumitraghosh.in'
const KEYS = ['NEXT_PUBLIC_SITE_URL', 'NEXT_PUBLIC_BASE_URL'] as const

async function loadSiteUrl(env: Partial<Record<(typeof KEYS)[number], string>>) {
  for (const key of KEYS) {
    if (env[key] === undefined) delete process.env[key]
    else process.env[key] = env[key]
  }
  vi.resetModules()
  const { siteUrl } = await import('./site')
  return siteUrl
}

describe('siteUrl', () => {
  const original = { ...process.env }

  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    for (const key of KEYS) {
      if (original[key] === undefined) delete process.env[key]
      else process.env[key] = original[key]
    }
  })

  it('defaults to the production site when no env is set', async () => {
    expect(await loadSiteUrl({})).toBe(DEFAULT)
  })

  it('uses NEXT_PUBLIC_SITE_URL when it is a valid URL', async () => {
    expect(await loadSiteUrl({ NEXT_PUBLIC_SITE_URL: 'https://preview.example.com' })).toBe(
      'https://preview.example.com'
    )
  })

  it('falls back to NEXT_PUBLIC_BASE_URL when SITE_URL is unset', async () => {
    expect(await loadSiteUrl({ NEXT_PUBLIC_BASE_URL: 'https://base.example.com' })).toBe(
      'https://base.example.com'
    )
  })

  it('prefers NEXT_PUBLIC_SITE_URL over NEXT_PUBLIC_BASE_URL', async () => {
    expect(
      await loadSiteUrl({
        NEXT_PUBLIC_SITE_URL: 'https://site.example.com',
        NEXT_PUBLIC_BASE_URL: 'https://base.example.com',
      })
    ).toBe('https://site.example.com')
  })

  it('ignores the "." relative-fetch marker used on static hosts', async () => {
    expect(await loadSiteUrl({ NEXT_PUBLIC_BASE_URL: '.' })).toBe(DEFAULT)
  })

  it('ignores values that are not absolute URLs', async () => {
    expect(await loadSiteUrl({ NEXT_PUBLIC_SITE_URL: 'not a url' })).toBe(DEFAULT)
  })
})

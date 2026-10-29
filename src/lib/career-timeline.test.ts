import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getCareerTimelineData } from './career-timeline'

describe('getCareerTimelineData', () => {
  const fetchMock = vi.fn()
  const originalBaseUrl = process.env.NEXT_PUBLIC_BASE_URL

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock)
    vi.spyOn(console, 'error').mockImplementation(() => {})
    delete process.env.NEXT_PUBLIC_BASE_URL
  })

  afterEach(() => {
    fetchMock.mockReset()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    if (originalBaseUrl === undefined) delete process.env.NEXT_PUBLIC_BASE_URL
    else process.env.NEXT_PUBLIC_BASE_URL = originalBaseUrl
  })

  it('fetches from localhost by default with no-store caching and returns JSON', async () => {
    const payload = { metadata: { title: 'Career', years: [], delay: 0 }, projects: {} }
    fetchMock.mockResolvedValue({ ok: true, json: async () => payload })

    await expect(getCareerTimelineData()).resolves.toBe(payload)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:3000/api/career-timeline', {
      cache: 'no-store',
    })
  })

  it('uses a relative API path when NEXT_PUBLIC_BASE_URL is "."', async () => {
    process.env.NEXT_PUBLIC_BASE_URL = '.'
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({}) })

    await getCareerTimelineData()
    expect(fetchMock.mock.calls[0][0]).toBe('/api/career-timeline')
  })

  it('resolves the API path against an absolute NEXT_PUBLIC_BASE_URL', async () => {
    process.env.NEXT_PUBLIC_BASE_URL = 'https://example.com/some/prefix'
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({}) })

    await getCareerTimelineData()
    expect(fetchMock.mock.calls[0][0]).toBe('https://example.com/api/career-timeline')
  })

  it('throws with the status code and logs on a non-OK response', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 404 })

    await expect(getCareerTimelineData()).rejects.toThrow(
      'Failed to fetch career timeline data: 404'
    )
    expect(console.error).toHaveBeenCalled()
  })

  it('rethrows network errors', async () => {
    fetchMock.mockRejectedValue(new Error('offline'))

    await expect(getCareerTimelineData()).rejects.toThrow('offline')
  })
})

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getExperienceWithDates } from './experience-dates'

describe('getExperienceWithDates', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock)
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    fetchMock.mockReset()
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  it('fetches from the default base URL with no-store caching and returns JSON', async () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_URL', '')
    const payload = { experience: [] }
    fetchMock.mockResolvedValue({ ok: true, json: async () => payload })

    await expect(getExperienceWithDates()).resolves.toBe(payload)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:3000/api/experience-dates', {
      cache: 'no-store',
    })
  })

  it('uses NEXT_PUBLIC_BASE_URL when set', async () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_URL', 'https://example.com')
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({}) })

    await getExperienceWithDates()
    expect(fetchMock.mock.calls[0][0]).toBe('https://example.com/api/experience-dates')
  })

  it('throws with the status code on a non-OK response', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 500 })

    await expect(getExperienceWithDates()).rejects.toThrow(
      'Failed to fetch experience dates: 500'
    )
  })

  it('rethrows network errors', async () => {
    fetchMock.mockRejectedValue(new Error('offline'))

    await expect(getExperienceWithDates()).rejects.toThrow('offline')
  })
})

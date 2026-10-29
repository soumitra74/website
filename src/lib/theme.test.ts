import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getAmbientTheme,
  getEffectiveTheme,
  getThemeFromLocalStorage,
  getThemeFromUrl,
  setThemeInLocalStorage,
} from './theme'

describe('getAmbientTheme', () => {
  afterEach(() => vi.useRealTimers())

  const at = (hour: number, minute = 0) => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2025, 0, 15, hour, minute))
    return getAmbientTheme()
  }

  it('is light from 06:00 inclusive', () => {
    expect(at(6)).toBe('light')
  })

  it('is light up to 17:59', () => {
    expect(at(17, 59)).toBe('light')
  })

  it('is dark from 18:00 inclusive', () => {
    expect(at(18)).toBe('dark')
  })

  it('is dark before 06:00', () => {
    expect(at(5, 59)).toBe('dark')
    expect(at(0)).toBe('dark')
  })
})

describe('getThemeFromUrl', () => {
  it.each(['light', 'dark', 'ambient'] as const)('accepts theme=%s', (theme) => {
    expect(getThemeFromUrl(`?theme=${theme}`)).toBe(theme)
  })

  it('finds the param among other params', () => {
    expect(getThemeFromUrl('?lang=en&theme=dark')).toBe('dark')
  })

  it('returns null for unknown values', () => {
    expect(getThemeFromUrl('?theme=purple')).toBeNull()
  })

  it('returns null when the param is absent', () => {
    expect(getThemeFromUrl('?lang=en')).toBeNull()
    expect(getThemeFromUrl('')).toBeNull()
  })
})

describe('localStorage theme helpers', () => {
  let store: Record<string, string>

  beforeEach(() => {
    store = {}
    vi.stubGlobal('window', {})
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => (key in store ? store[key] : null),
      setItem: (key: string, value: string) => {
        store[key] = value
      },
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('reads a stored valid theme', () => {
    store.theme = 'ambient'
    expect(getThemeFromLocalStorage()).toBe('ambient')
  })

  it('falls back to light for missing or invalid stored values', () => {
    expect(getThemeFromLocalStorage()).toBe('light')
    store.theme = 'neon'
    expect(getThemeFromLocalStorage()).toBe('light')
  })

  it('writes the theme under the "theme" key', () => {
    setThemeInLocalStorage('dark')
    expect(store.theme).toBe('dark')
  })
})

describe('localStorage theme helpers without a window (SSR)', () => {
  it('reads light by default and never throws on write', () => {
    expect(getThemeFromLocalStorage()).toBe('light')
    expect(() => setThemeInLocalStorage('dark')).not.toThrow()
  })
})

describe('getEffectiveTheme', () => {
  afterEach(() => vi.useRealTimers())

  it('returns explicit light and dark unchanged', () => {
    expect(getEffectiveTheme('light')).toBe('light')
    expect(getEffectiveTheme('dark')).toBe('dark')
  })

  it('resolves ambient using the time of day', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2025, 0, 15, 12, 0))
    expect(getEffectiveTheme('ambient')).toBe('light')

    vi.setSystemTime(new Date(2025, 0, 15, 22, 0))
    expect(getEffectiveTheme('ambient')).toBe('dark')
  })
})

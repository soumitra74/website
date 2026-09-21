import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  cn,
  convertToIST,
  formatTimeWithTimezone,
  getCurrentISTTime,
  getTimezoneInfo,
} from './utils'

// convertToIST returns a Date whose *local* fields hold IST wall-clock time,
// so assertions use getHours()/getMinutes() and are independent of the runner's TZ.
const hm = (d: Date) => [d.getHours(), d.getMinutes()]

describe('cn', () => {
  it('joins class names and drops falsy values', () => {
    expect(cn('a', false, undefined, null, 'b')).toBe('a b')
  })

  it('supports conditional object syntax', () => {
    expect(cn('a', { b: true, c: false })).toBe('a b')
  })

  it('lets later tailwind classes override conflicting earlier ones', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })
})

describe('convertToIST', () => {
  it('converts UTC to IST (+5:30)', () => {
    expect(hm(convertToIST(new Date('2025-01-15T08:00:00Z')))).toEqual([13, 30])
  })

  it('converts US Eastern (-5) to IST', () => {
    expect(hm(convertToIST(new Date('2025-01-15T08:00:00-05:00')))).toEqual([18, 30])
  })

  it('converts US Pacific (-8) to IST', () => {
    expect(hm(convertToIST(new Date('2025-01-15T08:00:00-08:00')))).toEqual([21, 30])
  })

  it('rolls over to the next day past midnight IST', () => {
    const ist = convertToIST(new Date('2025-01-15T20:00:00Z'))
    expect(hm(ist)).toEqual([1, 30])
    expect(ist.getDate()).toBe(16)
  })

  it('returns the same wall-clock time when the input is already IST', () => {
    expect(hm(convertToIST(new Date('2025-01-15T10:15:00+05:30')))).toEqual([10, 15])
  })

  it('has no daylight-saving shift for IST across seasons', () => {
    expect(hm(convertToIST(new Date('2025-07-15T00:00:00Z')))).toEqual([5, 30])
    expect(hm(convertToIST(new Date('2025-01-15T00:00:00Z')))).toEqual([5, 30])
  })

  it('falls back to the original date when conversion throws', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const date = new Date('2025-01-15T08:00:00Z')
    vi.spyOn(date, 'toLocaleString').mockImplementation(() => {
      throw new RangeError('bad timezone')
    })
    expect(convertToIST(date)).toBe(date)
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })
})

describe('getCurrentISTTime', () => {
  afterEach(() => vi.useRealTimers())

  it('returns the IST wall-clock for the current (faked) instant', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-03-01T18:45:00Z'))
    expect(hm(getCurrentISTTime())).toEqual([0, 15])
  })
})

describe('formatTimeWithTimezone', () => {
  it('zero-pads hours and minutes and appends IST by default', () => {
    expect(formatTimeWithTimezone(new Date(2025, 0, 1, 5, 7))).toBe('05:07 IST')
  })

  it('omits the timezone label when showTimezone is false', () => {
    expect(formatTimeWithTimezone(new Date(2025, 0, 1, 23, 59), false)).toBe('23:59')
  })

  it('formats midnight as 00:00', () => {
    expect(formatTimeWithTimezone(new Date(2025, 0, 1, 0, 0), false)).toBe('00:00')
  })
})

describe('getTimezoneInfo', () => {
  it('returns local time, IST time, and the resolved timezone', () => {
    const info = getTimezoneInfo(new Date('2025-01-15T08:00:00Z'))
    expect(info.istTime).toBe('13:30 IST')
    expect(info.localTime).toMatch(/^\d{2}:\d{2}/)
    expect(info.timezone).toBe(Intl.DateTimeFormat().resolvedOptions().timeZone)
  })

  it('formats IST in 24h with zero padding', () => {
    expect(getTimezoneInfo(new Date('2025-01-15T00:00:00Z')).istTime).toBe('05:30 IST')
  })

  it('falls back to Unknown values on error', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const date = new Date('2025-01-15T08:00:00Z')
    vi.spyOn(date, 'toLocaleTimeString')
      .mockImplementationOnce(() => {
        throw new RangeError('bad timezone')
      })
      .mockImplementationOnce(() => '08:00:00')
    const info = getTimezoneInfo(date)
    expect(info).toEqual({ localTime: '08:00:00', istTime: 'Unknown', timezone: 'Unknown' })
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })
})

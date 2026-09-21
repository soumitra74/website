import { describe, expect, it } from 'vitest'
import {
  CAREER_START,
  getYearsOfExperience,
  interpolateYearsOfExperience,
} from './years-of-experience'

describe('getYearsOfExperience', () => {
  it('starts career on August 1, 1996', () => {
    expect(CAREER_START.getFullYear()).toBe(1996)
    expect(CAREER_START.getMonth()).toBe(7)
    expect(CAREER_START.getDate()).toBe(1)
  })

  it('returns 0 on the start date year before the first anniversary', () => {
    expect(getYearsOfExperience(new Date(1996, 7, 1))).toBe(0)
    expect(getYearsOfExperience(new Date(1997, 6, 31))).toBe(0)
  })

  it('counts a full year on the August 1 anniversary', () => {
    expect(getYearsOfExperience(new Date(1997, 7, 1))).toBe(1)
  })

  it('does not count the year the day before the anniversary', () => {
    expect(getYearsOfExperience(new Date(2025, 6, 31))).toBe(28)
  })

  it('counts the year on the anniversary day and after it', () => {
    expect(getYearsOfExperience(new Date(2025, 7, 1))).toBe(29)
    expect(getYearsOfExperience(new Date(2025, 11, 31))).toBe(29)
  })

  it('handles early-year dates before the August anniversary', () => {
    expect(getYearsOfExperience(new Date(2026, 0, 1))).toBe(29)
  })

  it('never returns a negative value for dates before career start', () => {
    expect(getYearsOfExperience(new Date(1990, 0, 1))).toBe(0)
    expect(getYearsOfExperience(new Date(1995, 11, 31))).toBe(0)
  })

  it('defaults to the current date', () => {
    expect(getYearsOfExperience()).toBe(getYearsOfExperience(new Date()))
  })
})

describe('interpolateYearsOfExperience', () => {
  const now = new Date(2025, 7, 1) // 29 years

  it('replaces the placeholder in a string', () => {
    expect(interpolateYearsOfExperience('{{yearsOfExperience}}+ years', now)).toBe('29+ years')
  })

  it('replaces every occurrence in a string', () => {
    expect(
      interpolateYearsOfExperience('{{yearsOfExperience}} and {{yearsOfExperience}}', now)
    ).toBe('29 and 29')
  })

  it('leaves strings without the placeholder untouched', () => {
    expect(interpolateYearsOfExperience('no placeholder', now)).toBe('no placeholder')
  })

  it('walks nested objects and arrays', () => {
    const input = {
      title: 'Leader with {{yearsOfExperience}} years',
      list: ['{{yearsOfExperience}}', 'other', { deep: 'x{{yearsOfExperience}}y' }],
    }
    expect(interpolateYearsOfExperience(input, now)).toEqual({
      title: 'Leader with 29 years',
      list: ['29', 'other', { deep: 'x29y' }],
    })
  })

  it('preserves non-string primitives and null', () => {
    const input = { n: 5, b: true, nil: null, u: undefined }
    expect(interpolateYearsOfExperience(input, now)).toEqual(input)
  })

  it('does not mutate the input', () => {
    const input = { a: ['{{yearsOfExperience}}'] }
    interpolateYearsOfExperience(input, now)
    expect(input.a[0]).toBe('{{yearsOfExperience}}')
  })
})

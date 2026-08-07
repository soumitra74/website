/** Career start: August 1, 1996. Years tick up on each August anniversary. */
export const CAREER_START = new Date(1996, 7, 1)

const PLACEHOLDER = '{{yearsOfExperience}}'

/**
 * Completed years of experience as of `now` (defaults to current date).
 * Counts full years from August 1, 1996.
 */
export function getYearsOfExperience(now: Date = new Date()): number {
  let years = now.getFullYear() - CAREER_START.getFullYear()
  const reachedAnniversary =
    now.getMonth() > CAREER_START.getMonth() ||
    (now.getMonth() === CAREER_START.getMonth() && now.getDate() >= CAREER_START.getDate())

  if (!reachedAnniversary) {
    years -= 1
  }

  return Math.max(0, years)
}

/**
 * Replace `{{yearsOfExperience}}` in all string fields of a JSON-like value.
 * Computed once per call (build-time for static export).
 */
export function interpolateYearsOfExperience<T>(data: T, now: Date = new Date()): T {
  const years = String(getYearsOfExperience(now))
  return walk(data, years) as T
}

function walk(value: unknown, years: string): unknown {
  if (typeof value === 'string') {
    return value.includes(PLACEHOLDER) ? value.split(PLACEHOLDER).join(years) : value
  }
  if (Array.isArray(value)) {
    return value.map((item) => walk(item, years))
  }
  if (value !== null && typeof value === 'object') {
    const result: Record<string, unknown> = {}
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      result[key] = walk(nested, years)
    }
    return result
  }
  return value
}

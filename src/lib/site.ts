const DEFAULT_SITE_URL = 'https://about.soumitraghosh.in'

function resolveSiteUrl(): string {
  const candidate =
    process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_BASE_URL

  // "." is used for relative API fetches on static hosts, not as a metadata base URL.
  if (!candidate || candidate === '.') {
    return DEFAULT_SITE_URL
  }

  try {
    new URL(candidate)
    return candidate
  } catch {
    return DEFAULT_SITE_URL
  }
}

export const siteUrl = resolveSiteUrl()
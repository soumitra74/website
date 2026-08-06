import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/site'

const routes: Array<{
  path: string
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
  priority: number
}> = [
  { path: '/', changeFrequency: 'monthly', priority: 1 },
  { path: '/events', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/career-timeline', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/ask-me', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/spot-me', changeFrequency: 'weekly', priority: 0.6 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return routes.map(({ path, changeFrequency, priority }) => ({
    url: new URL(path, siteUrl).toString(),
    lastModified,
    changeFrequency,
    priority,
  }))
}

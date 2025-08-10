export interface ContentData {
  metadata: {
    title: string
    description: string
    keywords: string
    author: string
  }
  navigation: {
    brand: string
    links: Array<{
      text: string
      href: string
    }>
  }
  hero: {
    initials: string
    title: {
      main: string
      highlight: string
    }
    description: string
    buttons: Array<{
      text: string
      variant: string
      icon: string
      href?: string
    }>
  }
  about: {
    title: string
    subtitle: string
    content: {
      journey: {
        title: string
        paragraphs: string[]
        achievement: {
          text: string
          icon: string
        }
      }
      cards: Array<{
        title: string
        icon: string
        description: string
      }>
    }
  }
  experience: {
    title: string
    subtitle: string
    roles: Array<{
      title: string
      company: string
      duration?: string
      description?: string
      products?: Array<{
        name: string
        description: string
      }>
      companies?: Array<{
        name: string
        description: string
      }>
    }>
  }
  portfolio: {
    title: string
    subtitle: string
    projects: Array<{
      name: string
      type: string
      description: string
      challenge: string
      solution: string
      technologies: string[]
      metrics: {
        [key: string]: string
      }
      achievements: string[]
    }>
    combined_impact: {
      title: string
      description: string
      metrics: Array<{
        value: string
        label: string
      }>
    }
  }
  expertise: {
    title: string
    subtitle: string
    areas: Array<{
      title: string
      icon: string
      description: string
    }>
  }
  contact: {
    title: string
    description: string
    buttons: Array<{
      text: string
      icon: string
      variant: string
      href?: string
    }>
    status: Array<{
      text: string
      icon: string
    }>
  }
  footer: {
    copyright: string
  }
}

// Client-side function for fetching content
export async function getContent(): Promise<ContentData> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/content`, {
      cache: 'no-store' // Ensure fresh data on each request
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch content: ${response.status}`)
    }
    
    const content = await response.json()
    return content
  } catch (error) {
    console.error('Error fetching content:', error)
    throw error
  }
}

// Server-side function for fetching content during build
export async function getContentServer(): Promise<ContentData> {
  try {
    // During build time, read the file directly
    if (process.env.NODE_ENV === 'production' || process.env.NEXT_PHASE === 'phase-production-build') {
      const fs = await import('fs')
      const path = await import('path')
      const filePath = path.join(process.cwd(), 'data', 'content.json')
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      return JSON.parse(fileContent)
    }
    
    // During development, use the API route
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/content`, {
      cache: 'no-store' // Ensure fresh data on each request
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch content: ${response.status}`)
    }
    
    const content = await response.json()
    return content
  } catch (error) {
    console.error('Error fetching content:', error)
    throw error
  }
} 
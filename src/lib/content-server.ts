import { ContentData } from './content'

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

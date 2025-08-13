import { DetailedContentData } from './types'

// Client-side function for fetching detailed content
export async function getDetailedContent(): Promise<DetailedContentData> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/content-detailed`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch detailed content: ${response.status}`)
    }
    
    const content = await response.json()
    return content
  } catch (error) {
    console.error('Error fetching detailed content:', error)
    throw error
  }
}

import { ExperienceWithDatesData } from './types'

// Client-side function for fetching experience with dates
export async function getExperienceWithDates(): Promise<ExperienceWithDatesData> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/experience-dates`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch experience dates: ${response.status}`)
    }
    
    const content = await response.json()
    return content
  } catch (error) {
    console.error('Error fetching experience dates:', error)
    throw error
  }
}

export interface CareerTimelineData {
  metadata: {
    title: string
    description: string
    years: number[]
    delay: number
  }
  projects: {
    [key: string]: {
      title: string
      description: string
      techStack: string[]
      screenshot?: string
      videoUrl?: string
      achievements: string[]
    }
  }
}

export async function getCareerTimelineData(): Promise<CareerTimelineData> {
  try {
    // Construct the proper API URL using URL class
    let apiUrl: string
    if(process.env.NEXT_PUBLIC_BASE_URL === ".") {
      apiUrl = "/api/career-timeline"
    } else {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      apiUrl = new URL('/api/career-timeline', baseUrl).toString()
    }
    
    const response = await fetch(apiUrl, {
      cache: 'no-store' // Ensure fresh data on each request
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch career timeline data: ${response.status}`)
    }
    
    const careerTimeline = await response.json()
    return careerTimeline
  } catch (error) {
    console.error('Error loading career timeline data:', error)
    throw error
  }
}

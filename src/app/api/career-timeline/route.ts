import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    // Read the career-timeline.json file
    const careerTimelinePath = path.join(process.cwd(), 'data', 'career-timeline.json')
    const careerTimelineData = fs.readFileSync(careerTimelinePath, 'utf8')
    const careerTimeline = JSON.parse(careerTimelineData)
    
    return NextResponse.json(careerTimeline)
  } catch (error) {
    console.error('Error loading career timeline:', error)
    return NextResponse.json(
      { error: 'Failed to load career timeline' },
      { status: 500 }
    )
  }
}

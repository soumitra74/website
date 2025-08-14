import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const dailySchedulePath = path.join(process.cwd(), 'data', 'daily_schedule.json')
    const dailyScheduleData = fs.readFileSync(dailySchedulePath, 'utf8')
    const content = JSON.parse(dailyScheduleData)
    
    return NextResponse.json(content)
  } catch (error) {
    console.error('Error reading daily schedule:', error)
    return NextResponse.json({ error: 'Failed to load daily schedule' }, { status: 500 })
  }
}

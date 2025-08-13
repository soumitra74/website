import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const experienceDatesPath = path.join(process.cwd(), 'data', 'soumitra_experience_with_dates.json')
    const experienceDatesData = fs.readFileSync(experienceDatesPath, 'utf8')
    const content = JSON.parse(experienceDatesData)
    
    return NextResponse.json(content)
  } catch (error) {
    console.error('Error reading experience dates:', error)
    return NextResponse.json({ error: 'Failed to load experience dates' }, { status: 500 })
  }
}

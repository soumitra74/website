import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const detailedContentPath = path.join(process.cwd(), 'data', 'soumitra_content_detailed.json')
    const detailedContentData = fs.readFileSync(detailedContentPath, 'utf8')
    const content = JSON.parse(detailedContentData)
    
    return NextResponse.json(content)
  } catch (error) {
    console.error('Error reading detailed content:', error)
    return NextResponse.json({ error: 'Failed to load detailed content' }, { status: 500 })
  }
}

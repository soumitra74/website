import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    // Read the content.json file
    const contentPath = path.join(process.cwd(), 'data', 'content.json')
    const contentData = fs.readFileSync(contentPath, 'utf8')
    const content = JSON.parse(contentData)
    
    return NextResponse.json(content)
  } catch (error) {
    console.error('Error loading content:', error)
    return NextResponse.json(
      { error: 'Failed to load content' },
      { status: 500 }
    )
  }
} 
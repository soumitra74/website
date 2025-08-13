import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const chatbotPath = path.join(process.cwd(), 'data', 'chatbot.json')
    const chatbotData = fs.readFileSync(chatbotPath, 'utf8')
    const content = JSON.parse(chatbotData)

    return NextResponse.json(content)
  } catch (error) {
    console.error('Error loading chatbot content:', error)
    return NextResponse.json(
      { error: 'Failed to load chatbot content' },
      { status: 500 }
    )
  }
} 
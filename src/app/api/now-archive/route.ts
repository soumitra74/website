import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const archivePath = path.join(process.cwd(), 'data', 'now-archive.json')
    const archiveData = fs.readFileSync(archivePath, 'utf8')
    const content = JSON.parse(archiveData)

    return NextResponse.json(content)
  } catch (error) {
    console.error('Error reading now archive:', error)
    return NextResponse.json({ error: 'Failed to load now archive' }, { status: 500 })
  }
}

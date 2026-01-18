import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const menuPath = path.join(process.cwd(), 'data', 'menu.json')

export async function GET() {
  try {
    const data = fs.readFileSync(menuPath, 'utf-8')
    return NextResponse.json(JSON.parse(data))
  } catch (error) {
    console.error('Error reading menu:', error)
    return NextResponse.json({ items: [] })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()

    // Validate structure
    if (!body.items || !Array.isArray(body.items)) {
      return NextResponse.json({ error: 'Invalid menu structure' }, { status: 400 })
    }

    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), 'data')
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    // Write the menu file
    fs.writeFileSync(menuPath, JSON.stringify(body, null, 2))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving menu:', error)
    return NextResponse.json({ error: 'Failed to save menu' }, { status: 500 })
  }
}

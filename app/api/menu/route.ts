import { NextResponse } from 'next/server'
import { getMenu, saveMenu } from '@/lib/contentful-management'

export async function GET() {
  try {
    const menu = await getMenu()
    return NextResponse.json(menu)
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

    const success = await saveMenu(body)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: 'Failed to save menu' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error saving menu:', error)
    return NextResponse.json({ error: 'Failed to save menu' }, { status: 500 })
  }
}

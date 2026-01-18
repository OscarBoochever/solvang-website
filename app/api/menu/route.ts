import { NextResponse } from 'next/server'
import { getMenu, saveMenu } from '@/lib/contentful-management'
import fs from 'fs'
import path from 'path'

// Default menu from file (fallback)
function getDefaultMenu() {
  try {
    const menuPath = path.join(process.cwd(), 'data', 'menu.json')
    const data = fs.readFileSync(menuPath, 'utf-8')
    return JSON.parse(data)
  } catch {
    return { items: [] }
  }
}

export async function GET() {
  try {
    const menu = await getMenu()

    // If Contentful returns empty, seed it with the default menu and return that
    if (!menu.items || menu.items.length === 0) {
      const defaultMenu = getDefaultMenu()

      // Seed Contentful with default menu (async, don't wait)
      saveMenu(defaultMenu).catch(err =>
        console.error('Failed to seed menu to Contentful:', err)
      )

      return NextResponse.json(defaultMenu)
    }

    return NextResponse.json(menu)
  } catch (error) {
    console.error('Error reading menu from Contentful:', error)
    // Fall back to file-based menu
    return NextResponse.json(getDefaultMenu())
  }
}

export async function PUT(request: Request) {
  // Check if management token is configured FIRST before any async operations
  if (!process.env.CONTENTFUL_MANAGEMENT_TOKEN) {
    console.error('CONTENTFUL_MANAGEMENT_TOKEN is not set')
    return NextResponse.json({ error: 'CMS not configured - missing CONTENTFUL_MANAGEMENT_TOKEN' }, { status: 500 })
  }

  try {
    const body = await request.json()

    // Validate structure
    if (!body.items || !Array.isArray(body.items)) {
      return NextResponse.json({ error: 'Invalid menu structure' }, { status: 400 })
    }

    const success = await saveMenu(body)

    if (success) {
      return NextResponse.json({ success: true, saved: body })
    } else {
      return NextResponse.json({ error: 'Failed to save menu to CMS' }, { status: 500 })
    }
  } catch (error: any) {
    console.error('Error saving menu:', error)
    return NextResponse.json({
      error: 'Failed to save menu',
      details: error?.message || String(error) || 'Unknown error'
    }, { status: 500 })
  }
}

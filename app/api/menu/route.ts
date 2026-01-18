import { NextResponse } from 'next/server'
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
    // Dynamic import to avoid crashes at module load time
    const { getMenu, saveMenu } = await import('@/lib/contentful-management')
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
  // Outer wrapper to catch ANY crash
  try {
    // Check if management token is configured FIRST before any async operations
    if (!process.env.CONTENTFUL_MANAGEMENT_TOKEN) {
      return NextResponse.json({ error: 'CMS not configured - missing CONTENTFUL_MANAGEMENT_TOKEN' }, { status: 500 })
    }

    let body
    try {
      body = await request.json()
    } catch (e: any) {
      return NextResponse.json({ error: 'Failed to parse request body', details: e?.message }, { status: 400 })
    }

    // Validate structure
    if (!body.items || !Array.isArray(body.items)) {
      return NextResponse.json({ error: 'Invalid menu structure' }, { status: 400 })
    }

    // Dynamic import
    let saveMenu
    try {
      const mod = await import('@/lib/contentful-management')
      saveMenu = mod.saveMenu
    } catch (e: any) {
      return NextResponse.json({ error: 'Failed to load contentful module', details: e?.message }, { status: 500 })
    }

    // Save to Contentful
    try {
      await saveMenu(body)
      return NextResponse.json({ success: true })
    } catch (e: any) {
      return NextResponse.json({ error: 'Contentful save failed', details: e?.message }, { status: 500 })
    }
  } catch (outerError: any) {
    // This catches anything we missed
    return NextResponse.json({
      error: 'Unexpected server error',
      details: outerError?.message || String(outerError)
    }, { status: 500 })
  }
}

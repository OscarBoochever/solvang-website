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

// Force cache bust v2
export async function PUT() {
  return NextResponse.json({ success: true, test: 'v2' })
}

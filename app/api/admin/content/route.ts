import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getEntries, createEntry, createRichText } from '@/lib/contentful-management'

// Check if authenticated
async function isAuthenticated() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  return session?.value === 'authenticated'
}

// GET - List all entries of a content type
export async function GET(request: NextRequest) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const contentType = request.nextUrl.searchParams.get('type')
  if (!contentType) {
    return NextResponse.json({ error: 'Content type required' }, { status: 400 })
  }

  try {
    const entries = await getEntries(contentType)
    return NextResponse.json({ entries })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Create a new entry
export async function POST(request: NextRequest) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { contentType, fields, richTextFields = [] } = await request.json()

    // Convert specified fields to rich text, skip empty fields
    const processedFields: Record<string, any> = {}
    Object.keys(fields).forEach(key => {
      const value = fields[key]
      // Skip empty/null values entirely
      if (value === '' || value === null || value === undefined) {
        return
      }
      if (richTextFields.includes(key)) {
        processedFields[key] = { 'en-US': createRichText(value) }
      } else {
        processedFields[key] = { 'en-US': value }
      }
    })

    const entry = await createEntry(contentType, processedFields)

    // Auto-publish
    await entry.publish()

    return NextResponse.json({ entry, success: true })
  } catch (error: any) {
    console.error('Create entry error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

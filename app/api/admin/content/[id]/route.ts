import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getEntry, updateEntry, deleteEntry, publishEntry, createRichText } from '@/lib/contentful-management'

// Check if authenticated
async function isAuthenticated() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  return session?.value === 'authenticated'
}

// GET - Get a single entry
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const entry = await getEntry(id)
    return NextResponse.json({ entry })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Update an entry
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const { fields, richTextFields = [] } = await request.json()

    // Convert specified fields to rich text, handle empty values
    const processedFields: Record<string, any> = {}
    Object.keys(fields).forEach(key => {
      const value = fields[key]
      // For rich text fields, skip if empty (can't set empty rich text)
      if (richTextFields.includes(key)) {
        if (value && value.trim()) {
          processedFields[key] = { 'en-US': createRichText(value) }
        }
        // Skip empty rich text fields
      } else {
        // Allow empty values for non-rich-text fields
        processedFields[key] = { 'en-US': value || '' }
      }
    })

    const entry = await updateEntry(id, processedFields)

    // Re-publish after update
    await publishEntry(id)

    return NextResponse.json({ entry, success: true })
  } catch (error: any) {
    console.error('Update entry error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Delete an entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    await deleteEntry(id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete entry error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

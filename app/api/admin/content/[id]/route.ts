import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getEntry, updateEntry, deleteEntry, publishEntry, createRichText } from '@/lib/contentful-management'

// Check if authenticated
async function isAuthenticated() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  if (!session?.value) return false
  // Support both old format ('authenticated') and new JSON format
  if (session.value === 'authenticated') return true
  try {
    JSON.parse(session.value)
    return true
  } catch {
    return false
  }
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

    console.log('API received fields:', JSON.stringify(fields, null, 2))

    // Combine scheduledDate and scheduledTime into scheduledPublish ISO string (for news/events)
    // Only process if scheduledDate was actually provided in the request
    if ('scheduledDate' in fields || 'scheduledTime' in fields) {
      if (fields.scheduledDate && fields.scheduledTime) {
        const dateTimeStr = `${fields.scheduledDate}T${fields.scheduledTime}:00`
        // Parse input as Pacific time and convert to UTC
        const targetDate = new Date(dateTimeStr)
        const pacificTime = new Date(targetDate.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }))
        const offset = targetDate.getTime() - pacificTime.getTime()
        const utcDateTime = new Date(targetDate.getTime() + offset)
        fields.scheduledPublish = utcDateTime.toISOString()
      } else {
        // Clear scheduledPublish if no date is set (use null for Date fields)
        fields.scheduledPublish = null
      }
      // Remove the separate date/time fields
      delete fields.scheduledDate
      delete fields.scheduledTime
    }

    // Handle image asset link
    const imageAssetId = fields.imageAssetId
    delete fields.imageAssetId

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
      } else if (value === null) {
        // Explicitly clear the field if null
        processedFields[key] = { 'en-US': null }
      } else {
        // Allow empty string values for non-rich-text fields
        processedFields[key] = { 'en-US': value }
      }
    })

    // Add or update image link
    if (imageAssetId) {
      processedFields.image = {
        'en-US': {
          sys: {
            type: 'Link',
            linkType: 'Asset',
            id: imageAssetId
          }
        }
      }
    } else if (imageAssetId === null) {
      // Remove image if explicitly set to null
      processedFields.image = { 'en-US': null }
    }

    console.log('Processed fields to save:', JSON.stringify(processedFields, null, 2))

    const entry = await updateEntry(id, processedFields)

    // Always re-publish to Contentful (visibility is controlled by status field)
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

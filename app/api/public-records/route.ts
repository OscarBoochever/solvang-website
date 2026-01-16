import { NextRequest, NextResponse } from 'next/server'

interface PublicRecordsFormData {
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zip?: string
  recordsDescription: string
  dateRangeStart?: string
  dateRangeEnd?: string
  purpose?: string
  preferredFormat: string
}

// Basic email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Generate reference number
function generateReferenceNumber(): string {
  const year = new Date().getFullYear()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `PRA-${year}-${random}`
}

export async function POST(request: NextRequest) {
  try {
    const data: PublicRecordsFormData = await request.json()

    // Validate required fields
    if (!data.name || data.name.trim() === '') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    if (!data.email || data.email.trim() === '') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    if (!isValidEmail(data.email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 })
    }

    if (!data.recordsDescription || data.recordsDescription.trim() === '') {
      return NextResponse.json({ error: 'Description of records requested is required' }, { status: 400 })
    }

    // Generate reference number
    const referenceId = generateReferenceNumber()

    // Sanitize and structure the data
    const sanitizedData = {
      referenceId,
      requestor: {
        name: data.name.trim().slice(0, 200),
        email: data.email.trim().toLowerCase().slice(0, 254),
        phone: data.phone?.trim().slice(0, 20) || null,
        address: data.address?.trim().slice(0, 200) || null,
        city: data.city?.trim().slice(0, 100) || null,
        state: data.state?.trim().slice(0, 2) || null,
        zip: data.zip?.trim().slice(0, 10) || null,
      },
      request: {
        description: data.recordsDescription.trim().slice(0, 10000),
        dateRangeStart: data.dateRangeStart || null,
        dateRangeEnd: data.dateRangeEnd || null,
        purpose: data.purpose?.trim().slice(0, 500) || null,
        preferredFormat: data.preferredFormat || 'electronic',
      },
      metadata: {
        submittedAt: new Date().toISOString(),
        status: 'pending',
        // 10 calendar days from submission per CPRA
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
    }

    // Log the submission (in production, save to database)
    console.log('Public Records Request submission:', {
      referenceId: sanitizedData.referenceId,
      requestor: sanitizedData.requestor.name,
      email: sanitizedData.requestor.email,
      submittedAt: sanitizedData.metadata.submittedAt,
      dueDate: sanitizedData.metadata.dueDate,
      descriptionPreview: sanitizedData.request.description.slice(0, 100) + '...',
    })

    // TODO: In production, integrate with:
    // - Database storage (required for CPRA compliance tracking)
    // - Email service for confirmation to requestor
    // - Email notification to City Clerk
    // - Records management system (e.g., Next Request)
    // - Automated due date tracking and reminders

    return NextResponse.json({
      success: true,
      referenceId,
      message: 'Your public records request has been received.',
      dueDate: sanitizedData.metadata.dueDate,
    })
  } catch (error) {
    console.error('Public records request error:', error)
    return NextResponse.json(
      { error: 'An error occurred while processing your request. Please try again.' },
      { status: 500 }
    )
  }
}

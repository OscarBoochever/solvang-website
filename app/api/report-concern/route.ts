import { NextRequest, NextResponse } from 'next/server'

interface ReportConcernData {
  name?: string
  email?: string
  phone?: string
  category: string
  location: string
  description: string
}

// Basic email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export async function POST(request: NextRequest) {
  try {
    const data: ReportConcernData = await request.json()

    // Validate required fields
    if (!data.category || data.category.trim() === '') {
      return NextResponse.json(
        { error: 'Please select a type of concern' },
        { status: 400 }
      )
    }

    if (!data.location || data.location.trim() === '') {
      return NextResponse.json(
        { error: 'Please provide a location' },
        { status: 400 }
      )
    }

    if (!data.description || data.description.trim() === '') {
      return NextResponse.json(
        { error: 'Please provide a description of the issue' },
        { status: 400 }
      )
    }

    // Validate email format if provided
    if (data.email && data.email.trim() !== '' && !isValidEmail(data.email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Sanitize data (basic XSS prevention)
    const sanitizedData = {
      name: data.name?.trim().slice(0, 200) || 'Anonymous',
      email: data.email?.trim().toLowerCase().slice(0, 254) || '',
      phone: data.phone?.trim().slice(0, 20) || '',
      category: data.category.trim().slice(0, 100),
      location: data.location.trim().slice(0, 500),
      description: data.description.trim().slice(0, 5000),
      submittedAt: new Date().toISOString(),
    }

    // Log the submission (in production, this would send an email or save to database)
    console.log('Report concern submission:', {
      ...sanitizedData,
      description: sanitizedData.description.slice(0, 100) + '...', // Truncate for logging
    })

    // TODO: In production, integrate with:
    // - Email service to notify Public Works
    // - Work order/ticketing system
    // - Database for tracking

    return NextResponse.json({
      success: true,
      message: 'Your report has been received. Public Works will review and address the issue.',
      referenceId: `RPT-${Date.now()}`, // Generate a reference ID
    })
  } catch (error) {
    console.error('Report concern error:', error)
    return NextResponse.json(
      { error: 'An error occurred while processing your report. Please try again.' },
      { status: 500 }
    )
  }
}

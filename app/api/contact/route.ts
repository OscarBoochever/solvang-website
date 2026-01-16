import { NextRequest, NextResponse } from 'next/server'

interface ContactFormData {
  name: string
  email: string
  phone?: string
  department: string
  subject: string
  message: string
}

// Basic email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export async function POST(request: NextRequest) {
  try {
    const data: ContactFormData = await request.json()

    // Validate required fields
    const requiredFields = ['name', 'email', 'department', 'subject', 'message'] as const
    for (const field of requiredFields) {
      if (!data[field] || data[field].trim() === '') {
        return NextResponse.json(
          { error: `${field.charAt(0).toUpperCase() + field.slice(1)} is required` },
          { status: 400 }
        )
      }
    }

    // Validate email format
    if (!isValidEmail(data.email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Sanitize data (basic XSS prevention)
    const sanitizedData = {
      name: data.name.trim().slice(0, 200),
      email: data.email.trim().toLowerCase().slice(0, 254),
      phone: data.phone?.trim().slice(0, 20) || '',
      department: data.department.trim().slice(0, 100),
      subject: data.subject.trim().slice(0, 200),
      message: data.message.trim().slice(0, 5000),
      submittedAt: new Date().toISOString(),
    }

    // Log the submission (in production, this would send an email or save to database)
    console.log('Contact form submission:', {
      ...sanitizedData,
      message: sanitizedData.message.slice(0, 100) + '...', // Truncate for logging
    })

    // TODO: In production, integrate with:
    // - Email service (SendGrid, Mailgun, AWS SES)
    // - Database storage
    // - CRM system
    // - Ticketing system

    // For now, we'll simulate a successful submission
    // In a real implementation, you would:
    // 1. Save to database
    // 2. Send confirmation email to user
    // 3. Send notification to appropriate department

    return NextResponse.json({
      success: true,
      message: 'Your message has been received. We will respond within 2-3 business days.',
      referenceId: `SOL-${Date.now()}`, // Generate a reference ID
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'An error occurred while processing your request. Please try again.' },
      { status: 500 }
    )
  }
}

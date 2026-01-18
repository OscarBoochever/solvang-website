import { NextRequest, NextResponse } from 'next/server'

interface BusinessCertificateData {
  businessName: string
  ownerName: string
  email: string
  phone: string
  businessType: string
  businessAddress: string
  mailingAddress?: string
  startDate: string
  description: string
}

// Basic email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export async function POST(request: NextRequest) {
  try {
    const data: BusinessCertificateData = await request.json()

    // Validate required fields
    if (!data.businessName || data.businessName.trim() === '') {
      return NextResponse.json(
        { error: 'Please enter your business name' },
        { status: 400 }
      )
    }

    if (!data.ownerName || data.ownerName.trim() === '') {
      return NextResponse.json(
        { error: 'Please enter the owner/applicant name' },
        { status: 400 }
      )
    }

    if (!data.email || data.email.trim() === '') {
      return NextResponse.json(
        { error: 'Please enter your email address' },
        { status: 400 }
      )
    }

    if (!isValidEmail(data.email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    if (!data.phone || data.phone.trim() === '') {
      return NextResponse.json(
        { error: 'Please enter your phone number' },
        { status: 400 }
      )
    }

    if (!data.businessType || data.businessType.trim() === '') {
      return NextResponse.json(
        { error: 'Please select a business type' },
        { status: 400 }
      )
    }

    if (!data.businessAddress || data.businessAddress.trim() === '') {
      return NextResponse.json(
        { error: 'Please enter the business address' },
        { status: 400 }
      )
    }

    if (!data.startDate || data.startDate.trim() === '') {
      return NextResponse.json(
        { error: 'Please enter the proposed start date' },
        { status: 400 }
      )
    }

    if (!data.description || data.description.trim() === '') {
      return NextResponse.json(
        { error: 'Please provide a business description' },
        { status: 400 }
      )
    }

    // Sanitize data
    const sanitizedData = {
      businessName: data.businessName.trim().slice(0, 200),
      ownerName: data.ownerName.trim().slice(0, 200),
      email: data.email.trim().toLowerCase().slice(0, 254),
      phone: data.phone.trim().slice(0, 20),
      businessType: data.businessType.trim().slice(0, 100),
      businessAddress: data.businessAddress.trim().slice(0, 500),
      mailingAddress: data.mailingAddress?.trim().slice(0, 500) || '',
      startDate: data.startDate.trim().slice(0, 20),
      description: data.description.trim().slice(0, 2000),
      submittedAt: new Date().toISOString(),
    }

    // Log the submission (in production, this would send an email or save to database)
    console.log('Business certificate application:', {
      ...sanitizedData,
      description: sanitizedData.description.slice(0, 100) + '...',
    })

    // TODO: In production, integrate with:
    // - Email service to notify Finance Department
    // - Application tracking system
    // - Database for record keeping

    return NextResponse.json({
      success: true,
      message: 'Your business certificate application has been received. The Finance Department will contact you within 3-5 business days.',
      referenceId: `BIZ-${Date.now()}`,
    })
  } catch (error) {
    console.error('Business certificate application error:', error)
    return NextResponse.json(
      { error: 'An error occurred while processing your application. Please try again.' },
      { status: 500 }
    )
  }
}

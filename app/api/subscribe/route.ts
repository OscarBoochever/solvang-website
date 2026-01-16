import { NextRequest, NextResponse } from 'next/server'
import { subscriptionCategories, DeliveryMethod } from '@/lib/subscriptions'

interface SubscribeRequest {
  email: string
  phone?: string
  deliveryMethod: DeliveryMethod
  categories: string[]
}

// Basic email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Basic phone validation (US format)
function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\(\)\+]{10,}$/
  return phoneRegex.test(phone)
}

export async function POST(request: NextRequest) {
  try {
    const data: SubscribeRequest = await request.json()

    // Validate email
    if (!data.email || !isValidEmail(data.email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Validate phone if SMS is selected
    if ((data.deliveryMethod === 'sms' || data.deliveryMethod === 'both') && !data.phone) {
      return NextResponse.json(
        { error: 'Phone number is required for SMS notifications' },
        { status: 400 }
      )
    }

    if (data.phone && !isValidPhone(data.phone)) {
      return NextResponse.json(
        { error: 'Please enter a valid phone number' },
        { status: 400 }
      )
    }

    // Validate delivery method
    if (!['email', 'sms', 'both'].includes(data.deliveryMethod)) {
      return NextResponse.json(
        { error: 'Invalid delivery method' },
        { status: 400 }
      )
    }

    // Validate categories
    if (!data.categories || data.categories.length === 0) {
      return NextResponse.json(
        { error: 'Please select at least one notification category' },
        { status: 400 }
      )
    }

    const validCategoryIds = subscriptionCategories.map((c) => c.id)
    const invalidCategories = data.categories.filter((c) => !validCategoryIds.includes(c))
    if (invalidCategories.length > 0) {
      return NextResponse.json(
        { error: 'Invalid notification categories selected' },
        { status: 400 }
      )
    }

    // Sanitize data
    const sanitizedData = {
      email: data.email.trim().toLowerCase(),
      phone: data.phone?.replace(/\D/g, '').slice(0, 15) || null,
      deliveryMethod: data.deliveryMethod,
      categories: data.categories,
      subscribedAt: new Date().toISOString(),
    }

    // Log the subscription (in production, save to database and send confirmation)
    console.log('New subscription:', {
      email: sanitizedData.email,
      deliveryMethod: sanitizedData.deliveryMethod,
      categoriesCount: sanitizedData.categories.length,
      categories: sanitizedData.categories.join(', '),
    })

    // TODO: In production, integrate with:
    // - Database to store subscriptions
    // - Email service (SendGrid, Mailchimp, etc.) for email notifications
    // - SMS service (Twilio, etc.) for SMS notifications
    // - Send confirmation email with unsubscribe link
    // - Generate unique token for managing preferences

    return NextResponse.json({
      success: true,
      message: 'Subscription confirmed',
      email: sanitizedData.email,
      categoriesCount: sanitizedData.categories.length,
    })
  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json(
      { error: 'An error occurred while processing your subscription. Please try again.' },
      { status: 500 }
    )
  }
}

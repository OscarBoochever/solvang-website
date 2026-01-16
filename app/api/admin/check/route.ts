import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SessionData } from '@/lib/auth'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get('admin_session')

    if (!session?.value) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    // Handle legacy session format
    if (session.value === 'authenticated') {
      return NextResponse.json({
        authenticated: true,
        user: {
          name: 'Administrator',
          role: 'super_admin',
          permissions: {
            canCreate: true,
            canEdit: true,
            canDelete: true,
            canPublish: true,
            canManageUsers: true,
            canViewAnalytics: true,
          },
        },
      })
    }

    // Parse new session format
    try {
      const sessionData: SessionData = JSON.parse(session.value)
      return NextResponse.json({
        authenticated: true,
        user: {
          userId: sessionData.userId,
          username: sessionData.username,
          name: sessionData.name,
          email: sessionData.email,
          role: sessionData.role,
          permissions: sessionData.permissions,
        },
      })
    } catch {
      // Invalid session data
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}

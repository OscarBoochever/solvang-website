import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getUserByUsername, verifyPassword, createSessionData } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // Support legacy single-password login for backwards compatibility
    if (!username && password === process.env.ADMIN_PASSWORD) {
      const cookieStore = await cookies()
      cookieStore.set('admin_session', JSON.stringify({
        userId: 'legacy',
        username: 'admin',
        name: 'Administrator',
        email: 'admin@cityofsolvang.com',
        role: 'super_admin',
        permissions: {
          canCreate: true,
          canEdit: true,
          canDelete: true,
          canPublish: true,
          canManageUsers: true,
          canViewAnalytics: true,
        },
      }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
      })

      return NextResponse.json({ success: true })
    }

    // New role-based login
    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 })
    }

    const user = getUserByUsername(username)

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    if (!verifyPassword(user, password)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Create session data
    const sessionData = createSessionData(user)

    // Set session cookie with user data
    const cookieStore = await cookies()
    cookieStore.set('admin_session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
    })

    return NextResponse.json({
      success: true,
      user: {
        name: sessionData.name,
        role: sessionData.role,
        permissions: sessionData.permissions,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}

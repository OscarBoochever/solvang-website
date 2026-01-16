import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getAsset } from '@/lib/contentful-management'

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

// GET - Get asset details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const asset = await getAsset(id)
    return NextResponse.json({
      id: asset.sys.id,
      url: asset.fields.file['en-US'].url,
      fileName: asset.fields.file['en-US'].fileName,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { uploadAsset } from '@/lib/contentful-management'

// Check if authenticated
async function isAuthenticated() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  return session?.value === 'authenticated'
}

// POST - Upload an image
export async function POST(request: NextRequest) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Contentful
    const asset = await uploadAsset(buffer, file.name, file.type)

    // Return the asset info
    return NextResponse.json({
      success: true,
      asset: {
        id: asset.sys.id,
        url: asset.fields.file['en-US'].url,
        fileName: asset.fields.file['en-US'].fileName,
      }
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

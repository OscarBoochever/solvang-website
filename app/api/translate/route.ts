import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { text, targetLang } = await request.json()

    if (!text || !targetLang) {
      return NextResponse.json(
        { error: 'Missing text or targetLang' },
        { status: 400 }
      )
    }

    // Use Google Translate unofficial API endpoint
    const encodedText = encodeURIComponent(text)
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodedText}`
    )

    const data = await response.json()

    // Google returns nested array: [[["translated text", "original text", ...], ...], ...]
    if (data && data[0] && data[0][0] && data[0][0][0]) {
      // Combine all translated segments
      const translatedText = data[0].map((segment: string[]) => segment[0]).join('')
      return NextResponse.json({ translatedText })
    }

    // Fallback: return original text
    return NextResponse.json({ translatedText: text })
  } catch (error) {
    console.error('Translation API error:', error)
    return NextResponse.json(
      { error: 'Translation failed', translatedText: null },
      { status: 500 }
    )
  }
}

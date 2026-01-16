import { NextRequest, NextResponse } from 'next/server'

// Preserve certain words/patterns from translation
function preserveBeforeTranslation(text: string): { processed: string; preserved: Map<string, string> } {
  const preserved = new Map<string, string>()
  let processed = text
  let counter = 0

  // Preserve "Solvang" (case-insensitive match, preserve original case)
  processed = processed.replace(/\bSolvang\b/gi, (match) => {
    const placeholder = `__PRESERVE_${counter}__`
    preserved.set(placeholder, match)
    counter++
    return placeholder
  })

  // Preserve email addresses
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  processed = processed.replace(emailRegex, (match) => {
    const placeholder = `__PRESERVE_${counter}__`
    preserved.set(placeholder, match)
    counter++
    return placeholder
  })

  return { processed, preserved }
}

function restoreAfterTranslation(text: string, preserved: Map<string, string>): string {
  let restored = text
  preserved.forEach((original, placeholder) => {
    restored = restored.replace(placeholder, original)
  })
  return restored
}

export async function POST(request: NextRequest) {
  try {
    const { text, targetLang } = await request.json()

    if (!text || !targetLang) {
      return NextResponse.json(
        { error: 'Missing text or targetLang' },
        { status: 400 }
      )
    }

    // Preserve words that should not be translated
    const { processed, preserved } = preserveBeforeTranslation(text)

    // Use Google Translate unofficial API endpoint
    const encodedText = encodeURIComponent(processed)
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodedText}`
    )

    const data = await response.json()

    // Google returns nested array: [[["translated text", "original text", ...], ...], ...]
    if (data && data[0] && data[0][0] && data[0][0][0]) {
      // Combine all translated segments
      let translatedText = data[0].map((segment: string[]) => segment[0]).join('')
      // Restore preserved words
      translatedText = restoreAfterTranslation(translatedText, preserved)
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

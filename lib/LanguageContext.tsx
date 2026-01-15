'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'zh', name: '中文' },
  { code: 'vi', name: 'Tiếng Việt' },
  { code: 'ko', name: '한국어' },
  { code: 'tl', name: 'Tagalog' },
  { code: 'de', name: 'Deutsch' },
  { code: 'fr', name: 'Français' },
  { code: 'ja', name: '日本語' },
  { code: 'pt', name: 'Português' },
]

interface TranslationCache {
  [key: string]: { [langCode: string]: string }
}

interface LanguageContextType {
  language: string
  setLanguage: (lang: string) => void
  translate: (text: string) => Promise<string>
  isTranslating: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState('en')
  const [cache, setCache] = useState<TranslationCache>({})
  const [isTranslating, setIsTranslating] = useState(false)

  const translate = useCallback(async (text: string): Promise<string> => {
    // If English, return original text
    if (language === 'en') return text

    // Check cache first
    if (cache[text]?.[language]) {
      return cache[text][language]
    }

    try {
      setIsTranslating(true)
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLang: language }),
      })

      const data = await response.json()

      if (data.translatedText) {
        // Update cache
        setCache(prev => ({
          ...prev,
          [text]: {
            ...prev[text],
            [language]: data.translatedText
          }
        }))
        return data.translatedText
      }

      return text
    } catch (error) {
      console.error('Translation error:', error)
      return text
    } finally {
      setIsTranslating(false)
    }
  }, [language, cache])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate, isTranslating }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

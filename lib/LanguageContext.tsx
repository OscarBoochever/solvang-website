'use client'

import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react'

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

// Storage keys for localStorage
const CACHE_KEY = 'solvang-translation-cache'
const LANGUAGE_KEY = 'solvang-language'

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState('en')
  const [cache, setCache] = useState<TranslationCache>({})
  const [isTranslating, setIsTranslating] = useState(false)

  // Track pending requests to avoid duplicate API calls
  const pendingRequests = useRef<Map<string, Promise<string>>>(new Map())

  // Load language and cache from localStorage on mount
  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem(LANGUAGE_KEY)
      if (savedLanguage) {
        setLanguageState(savedLanguage)
      }
      const savedCache = localStorage.getItem(CACHE_KEY)
      if (savedCache) {
        setCache(JSON.parse(savedCache))
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [])

  // Wrapper to save language to localStorage when changed
  const setLanguage = useCallback((lang: string) => {
    setLanguageState(lang)
    try {
      localStorage.setItem(LANGUAGE_KEY, lang)
    } catch {
      // Ignore localStorage errors
    }
  }, [])

  // Save cache to localStorage when it changes
  useEffect(() => {
    if (Object.keys(cache).length > 0) {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
      } catch {
        // Ignore localStorage errors
      }
    }
  }, [cache])

  const translate = useCallback(async (text: string): Promise<string> => {
    // If English, return original text
    if (language === 'en') return text

    // Skip empty strings
    if (!text || !text.trim()) return text

    // Check cache first
    if (cache[text]?.[language]) {
      return cache[text][language]
    }

    // Create a unique key for this request
    const requestKey = `${text}:${language}`

    // Check if there's already a pending request for this text
    if (pendingRequests.current.has(requestKey)) {
      return pendingRequests.current.get(requestKey)!
    }

    // Create the request promise
    const requestPromise = (async () => {
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
        // Remove from pending requests
        pendingRequests.current.delete(requestKey)
      }
    })()

    // Store the pending request
    pendingRequests.current.set(requestKey, requestPromise)

    return requestPromise
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

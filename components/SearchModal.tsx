'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import Translated from '@/components/Translated'

interface SearchResult {
  id: string
  type: 'form' | 'service' | 'department' | 'page' | 'news' | 'event'
  title: string
  description: string
  url: string
}

interface SearchDropdownProps {
  isOpen: boolean
  onClose: () => void
}

const typeLabels: Record<string, { label: string; color: string }> = {
  form: { label: 'Form', color: 'bg-sky-100 text-sky-700' },
  service: { label: 'Service', color: 'bg-emerald-100 text-emerald-700' },
  department: { label: 'Department', color: 'bg-navy-100 text-navy-700' },
  page: { label: 'Page', color: 'bg-gray-100 text-gray-700' },
  news: { label: 'News', color: 'bg-gold-100 text-gold-700' },
  event: { label: 'Event', color: 'bg-burgundy-100 text-burgundy-700' },
}

export default function SearchModal({ isOpen, onClose }: SearchDropdownProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchPlaceholder, setSearchPlaceholder] = useState('Search...')
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()
  const { language, translate } = useLanguage()

  // Translate placeholder
  useEffect(() => {
    if (language === 'en') {
      setSearchPlaceholder('Search...')
      return
    }
    translate('Search...').then(setSearchPlaceholder)
  }, [language, translate])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setQuery('')
      setResults([])
    }
  }, [isOpen])

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  // Debounced search with translation support
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (query.trim().length < 2) {
      setResults([])
      return
    }

    setIsLoading(true)
    debounceRef.current = setTimeout(async () => {
      try {
        // If not English, translate query to English for searching
        let searchQuery = query
        if (language !== 'en') {
          const response = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: query, targetLang: 'en' }),
          })
          const data = await response.json()
          if (data.translatedText) {
            searchQuery = data.translatedText
          }
        }

        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
        const data = await response.json()
        setResults(data.results || [])
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query, language])

  if (!isOpen) return null

  return (
    <div ref={containerRef} className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
      {/* Search Input */}
      <div className="flex items-center gap-2 p-3 border-b">
        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="search"
          placeholder={searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
          className="flex-1 text-sm outline-none placeholder:text-gray-400 bg-transparent"
        />
        {isLoading && (
          <div className="w-4 h-4 border-2 border-navy-600 border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      {/* Results */}
      {query.trim().length >= 2 && (
        <div className="max-h-64 overflow-y-auto">
          {results.length === 0 && !isLoading ? (
            <div className="p-4 text-center text-sm text-gray-500">
              <Translated>No results found</Translated>
            </div>
          ) : (
            <div className="divide-y">
              {results.map((result) => {
                const typeInfo = typeLabels[result.type]
                return (
                  <Link
                    key={result.id}
                    href={result.url}
                    onClick={onClose}
                    className="flex items-center gap-2 p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${typeInfo.color}`}>
                          <Translated>{typeInfo.label}</Translated>
                        </span>
                        <span className="text-sm font-medium text-navy-800 truncate">
                          <Translated>{result.title}</Translated>
                        </span>
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

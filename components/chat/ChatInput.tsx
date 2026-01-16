'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/LanguageContext'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('')
  const [placeholder, setPlaceholder] = useState('Ask about city services...')
  const { language, translate } = useLanguage()

  useEffect(() => {
    if (language === 'en') {
      setPlaceholder('Ask about city services...')
      return
    }
    translate('Ask about city services...').then(setPlaceholder)
  }, [language, translate])

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim())
      setInput('')
    }
  }

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            handleSend()
          }
        }}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 h-12 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
      />
      <button
        onClick={handleSend}
        disabled={disabled || !input.trim()}
        className="flex-shrink-0 w-12 h-12 bg-navy-700 text-white rounded-xl hover:bg-navy-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        aria-label="Send message"
      >
        {disabled ? (
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        )}
      </button>
    </div>
  )
}

'use client'

import React from 'react'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
}

// Parse and format the message content with links, bold, and basic markdown
function formatContent(text: string): React.ReactNode[] {
  const elements: React.ReactNode[] = []
  let keyIndex = 0

  // Split by lines first to handle bullet points
  const lines = text.split('\n')

  // Check if a line is a bullet point
  const isBullet = (line: string) => /^[-•]\s+/.test(line.trim())

  lines.forEach((line, lineIndex) => {
    const trimmedLine = line.trim()

    // Skip empty lines or add spacing for paragraph breaks
    if (trimmedLine === '') {
      if (lineIndex > 0 && lineIndex < lines.length - 1) {
        elements.push(<span key={`space-${keyIndex++}`} className="block h-2" />)
      }
      return
    }

    const prevLine = lineIndex > 0 ? lines[lineIndex - 1].trim() : ''
    const currentIsBullet = isBullet(trimmedLine)
    const prevIsBullet = isBullet(prevLine)

    // Add line break between non-empty lines, but not between consecutive bullets
    if (lineIndex > 0 && prevLine !== '') {
      if (!currentIsBullet || !prevIsBullet) {
        // Normal line break between text lines
        elements.push(<br key={`br-${keyIndex++}`} />)
      }
      // No extra spacing between consecutive bullets - they stack tightly
    }

    // Check if line is a bullet point
    const bulletMatch = trimmedLine.match(/^[-•]\s+(.+)$/)
    if (bulletMatch) {
      elements.push(
        <span key={`bullet-${keyIndex++}`} className="flex items-start gap-1.5 leading-tight">
          <span className="text-navy-400">•</span>
          <span>{processInlineFormatting(bulletMatch[1], keyIndex++)}</span>
        </span>
      )
    } else {
      elements.push(...processInlineFormatting(trimmedLine, keyIndex++))
    }
  })

  return elements
}

// Process inline formatting: URLs and bold text
function processInlineFormatting(text: string, baseKey: number): React.ReactNode[] {
  const elements: React.ReactNode[] = []

  // Combined regex for URLs and bold text (**text**)
  const combinedRegex = /(https?:\/\/[^\s]+|\*\*[^*]+\*\*)/g
  let lastIndex = 0
  let match

  while ((match = combinedRegex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      elements.push(text.slice(lastIndex, match.index))
    }

    const matched = match[0]

    if (matched.startsWith('http')) {
      // URL - remove trailing punctuation
      const cleanUrl = matched.replace(/[.,!?;:)]+$/, '')
      const trailing = matched.slice(cleanUrl.length)
      elements.push(
        <a
          key={`link-${baseKey}-${match.index}`}
          href={cleanUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-navy-600 underline hover:text-navy-800 whitespace-nowrap"
        >
          {cleanUrl}
        </a>
      )
      if (trailing) elements.push(trailing)
    } else if (matched.startsWith('**')) {
      // Bold text
      const boldText = matched.slice(2, -2)
      elements.push(
        <strong key={`bold-${baseKey}-${match.index}`} className="font-semibold">
          {boldText}
        </strong>
      )
    }

    lastIndex = match.index + matched.length
  }

  // Add remaining text
  if (lastIndex < text.length) {
    elements.push(text.slice(lastIndex))
  }

  return elements.length > 0 ? elements : [text]
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
          isUser
            ? 'bg-navy-700 text-white rounded-br-md'
            : 'bg-gray-100 text-gray-800 rounded-bl-md'
        }`}
      >
        {!isUser && (
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 bg-gold-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-navy-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
            <span className="text-xs font-medium text-navy-600">Solvang Assistant</span>
          </div>
        )}
        <div className="text-sm leading-relaxed">{formatContent(content)}</div>
      </div>
    </div>
  )
}

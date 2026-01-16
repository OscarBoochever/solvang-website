'use client'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
}

// Convert URLs in text to clickable links
function linkifyContent(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const parts = text.split(urlRegex)

  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      // Remove trailing punctuation from URL
      const cleanUrl = part.replace(/[.,!?;:]+$/, '')
      const trailing = part.slice(cleanUrl.length)
      return (
        <span key={index}>
          <a
            href={cleanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-navy-600 underline hover:text-navy-800"
          >
            {cleanUrl}
          </a>
          {trailing}
        </span>
      )
    }
    return part
  })
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
        <p className="text-sm whitespace-pre-wrap leading-relaxed">{linkifyContent(content)}</p>
      </div>
    </div>
  )
}

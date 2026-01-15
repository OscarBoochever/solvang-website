'use client'

import { useState, useRef, useEffect } from 'react'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import Translated from '@/components/Translated'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const suggestedQuestions = [
  "How do I pay my water bill?",
  "When is the next City Council meeting?",
  "How do I report a pothole?",
  "What are City Hall hours?",
]

export default function ChatSection() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async (content: string) => {
    const userMessage: Message = { role: 'user', content }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })

      const data = await response.json()

      setMessages([
        ...newMessages,
        { role: 'assistant', content: data.message },
      ])
    } catch (error) {
      console.error('Chat error:', error)
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: "I'm having trouble connecting right now. Please call City Hall at (805) 688-5575 for assistance.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="ask-assistant" className="py-12 bg-gray-50 scroll-mt-20">
      <div className="container-narrow">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-navy-800 mb-2">
              <Translated>Ask Solvang Assistant</Translated>
            </h2>
            <p className="text-gray-600">
              <Translated>Get instant answers about city services, meetings, and more</Translated>
            </p>
          </div>

          {/* Chat Container */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            {/* Messages Area */}
            <div ref={messagesContainerRef} className="h-80 overflow-y-auto p-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 bg-navy-100 rounded-full flex items-center justify-center mb-3">
                    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-navy-600" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 4l5 5M15 15l5 5M20 4l-5 5M9 15l-5 5" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                  <p className="text-gray-600 mb-4">
                    <Translated>Hi! I'm here to help you find information about City of Solvang services.</Translated>
                  </p>
                  <p className="text-sm text-gray-500 mb-4"><Translated>Try asking:</Translated></p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {suggestedQuestions.map((question) => (
                      <button
                        key={question}
                        onClick={() => sendMessage(question)}
                        className="px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-colors"
                      >
                        <Translated>{question}</Translated>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message, index) => (
                    <ChatMessage key={index} role={message.role} content={message.content} />
                  ))}
                  {isLoading && (
                    <div className="flex justify-start mb-3">
                      <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-navy-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-navy-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-navy-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <ChatInput onSend={sendMessage} disabled={isLoading} />
              <p className="text-xs text-gray-500 mt-2 text-center">
                <Translated>AI assistant may make mistakes. For official information, contact City Hall at (805) 688-5575.</Translated>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

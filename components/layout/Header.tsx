'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage, languages } from '@/lib/LanguageContext'
import Translated from '@/components/Translated'
import SearchModal from '@/components/SearchModal'
import ChatModal from '@/components/chat/ChatModal'

interface MenuItem {
  id: string
  label: string
  url: string
  children?: MenuItem[]
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [expandedMobileItem, setExpandedMobileItem] = useState<string | null>(null)
  const [navigation, setNavigation] = useState<MenuItem[]>([])
  const { language, setLanguage } = useLanguage()
  const langMenuRef = useRef<HTMLDivElement>(null)

  const currentLang = languages.find(l => l.code === language) || languages[0]

  // Fetch menu data
  useEffect(() => {
    fetch('/api/menu')
      .then(res => res.json())
      .then(data => setNavigation(data.items || []))
      .catch(() => setNavigation([]))
  }, [])

  // Close language menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      {/* Top bar */}
      <div className="bg-navy-800 text-white text-sm">
        <div className="container-narrow py-2 flex justify-between items-center">
          <span className="hidden sm:inline"><Translated>Welcome to the City of Solvang</Translated></span>
          <div className="flex items-center gap-4 ml-auto">
            {/* Language Dropdown */}
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1 hover:text-gold-400 transition-colors"
                aria-expanded={langMenuOpen}
                aria-haspopup="true"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span>{currentLang.name}</span>
                <svg className={`w-3 h-3 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code)
                        setLangMenuOpen(false)
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-navy-50 transition-colors ${
                        language === lang.code ? 'text-navy-700 font-medium bg-navy-50' : 'text-gray-700'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="text-navy-400">|</span>
            <Link href="/admin" className="hover:text-gold-400 transition-colors">
              <Translated>Employee Portal</Translated>
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container-narrow">
        <nav className="flex items-center justify-between py-4" aria-label="Main navigation">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* Windmill Icon */}
            <div className="w-12 h-12 bg-navy-700 rounded-full flex items-center justify-center group-hover:bg-navy-600 transition-colors">
              <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-white" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 4l5 5M15 15l5 5M20 4l-5 5M9 15l-5 5" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <div>
              <div className="text-xl font-bold text-navy-800 group-hover:text-navy-600 transition-colors">
                <Translated>City of Solvang</Translated>
              </div>
              <div className="text-xs text-gold-700 font-medium">
                <Translated>The Danish Capital of America</Translated>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <div key={item.id} className="relative group">
                <Link
                  href={item.url}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 hover:text-navy-700 hover:bg-navy-50 rounded-lg transition-colors"
                >
                  <Translated>{item.label}</Translated>
                  {item.children && item.children.length > 0 && (
                    <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </Link>

                {/* Dropdown on hover */}
                {item.children && item.children.length > 0 && (
                  <div className="absolute left-0 top-full pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                    <div className="bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-48">
                      {item.children.map((subitem) => (
                        <Link
                          key={subitem.id}
                          href={subitem.url}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-navy-50 hover:text-navy-700 transition-colors"
                        >
                          <Translated>{subitem.label}</Translated>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Chat, Search, and Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Chat Button */}
            <button
              onClick={() => setChatOpen(true)}
              className="p-2 text-gray-600 hover:text-navy-700 hover:bg-navy-50 rounded-lg transition-colors"
              aria-label="Open chat assistant"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>

            {/* Search Button */}
            <div className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-gray-600 hover:text-navy-700 hover:bg-navy-50 rounded-lg transition-colors"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-gray-600 hover:text-navy-700 hover:bg-navy-50 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t animate-fade-in">
            <div className="flex flex-col gap-1">
              {navigation.map((item) => (
                <div key={item.id}>
                  {item.children && item.children.length > 0 ? (
                    <>
                      <button
                        onClick={() => setExpandedMobileItem(expandedMobileItem === item.id ? null : item.id)}
                        className="w-full flex items-center justify-between px-4 py-3 text-base font-medium text-gray-700 hover:text-navy-700 hover:bg-navy-50 rounded-lg transition-colors"
                      >
                        <Translated>{item.label}</Translated>
                        <svg
                          className={`w-4 h-4 transition-transform ${expandedMobileItem === item.id ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {expandedMobileItem === item.id && (
                        <div className="ml-4 border-l-2 border-navy-100 pl-4 py-1">
                          <Link
                            href={item.url}
                            className="block px-4 py-2 text-sm text-navy-600 font-medium hover:bg-navy-50 rounded-lg"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Translated>View All</Translated>
                          </Link>
                          {item.children.map((subitem) => (
                            <Link
                              key={subitem.id}
                              href={subitem.url}
                              className="block px-4 py-2 text-sm text-gray-600 hover:text-navy-700 hover:bg-navy-50 rounded-lg"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <Translated>{subitem.label}</Translated>
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.url}
                      className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-navy-700 hover:bg-navy-50 rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Translated>{item.label}</Translated>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Chat Modal */}
      <ChatModal isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </header>
  )
}

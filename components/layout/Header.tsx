'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage, languages } from '@/lib/LanguageContext'
import Translated from '@/components/Translated'
import SearchModal from '@/components/SearchModal'

interface SubMenuItem {
  name: string
  href: string
}

interface NavItem {
  name: string
  href: string
  submenu?: SubMenuItem[]
}

const navigation: NavItem[] = [
  {
    name: 'How To',
    href: '/how-to',
    submenu: [
      { name: 'Apply for a Permit', href: '/how-to#apply-for' },
      { name: 'Pay Utility Bill', href: '/how-to#make-a-payment' },
      { name: 'Report a Concern', href: '/how-to#submit-a-request' },
      { name: 'Public Records Request', href: '/how-to#submit-a-request' },
      { name: 'Sign Up for Alerts', href: '/how-to#sign-up' },
    ],
  },
  {
    name: 'Residents',
    href: '/residents',
    submenu: [
      { name: 'Utility Services', href: '/residents#utility-services' },
      { name: 'Public Safety', href: '/residents#public-safety' },
      { name: 'Parks & Recreation', href: '/departments/parks-recreation' },
      { name: 'Transit', href: '/residents#transportation' },
      { name: 'Report a Concern', href: '/residents#report-a-concern' },
    ],
  },
  {
    name: 'City Hall',
    href: '/city-council',
    submenu: [
      { name: 'City Council', href: '/city-council' },
      { name: 'Agendas & Minutes', href: '/city-council#agendas--minutes' },
      { name: 'Departments', href: '/departments' },
      { name: 'News & Announcements', href: '/news' },
      { name: 'Events Calendar', href: '/events' },
    ],
  },
  {
    name: 'Business',
    href: '/business',
    submenu: [
      { name: 'Start a Business', href: '/business#starting-a-business' },
      { name: 'Licenses & Permits', href: '/business#licenses--permits' },
      { name: 'Bid Opportunities', href: '/business#bid-opportunities' },
      { name: 'Zoning Info', href: '/business#zoning--land-use' },
    ],
  },
  {
    name: 'Departments',
    href: '/departments',
    submenu: [
      { name: 'Administration', href: '/departments/administration' },
      { name: 'Community Development', href: '/departments/community-development' },
      { name: 'Economic Development', href: '/departments/economic-development' },
      { name: 'Parks & Recreation', href: '/departments/parks-recreation' },
      { name: 'Public Safety', href: '/departments/public-safety' },
      { name: 'Public Works', href: '/departments/public-works' },
      { name: 'Utilities', href: '/departments/utilities' },
    ],
  },
  {
    name: 'Visitors',
    href: '/visitors',
    submenu: [
      { name: 'Things to Do', href: '/visitors#things-to-do' },
      { name: 'Special Events', href: '/visitors#special-events' },
      { name: 'Solvang History', href: '/solvang-history' },
      { name: 'Getting Here', href: '/visitors#getting-here' },
    ],
  },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [expandedMobileItem, setExpandedMobileItem] = useState<string | null>(null)
  const { language, setLanguage } = useLanguage()
  const langMenuRef = useRef<HTMLDivElement>(null)

  const currentLang = languages.find(l => l.code === language) || languages[0]

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
              <Translated>Sign In</Translated>
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
              <div className="text-xs text-gold-600 font-medium">
                <Translated>The Danish Capital of America</Translated>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 hover:text-navy-700 hover:bg-navy-50 rounded-lg transition-colors"
                >
                  <Translated>{item.name}</Translated>
                  {item.submenu && (
                    <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </Link>

                {/* Dropdown on hover */}
                {item.submenu && (
                  <div className="absolute left-0 top-full pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                    <div className="bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-48">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.name}
                          href={subitem.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-navy-50 hover:text-navy-700 transition-colors"
                        >
                          {subitem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Search and Mobile Menu */}
          <div className="flex items-center gap-2">
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
                <div key={item.name}>
                  {item.submenu ? (
                    <>
                      <button
                        onClick={() => setExpandedMobileItem(expandedMobileItem === item.name ? null : item.name)}
                        className="w-full flex items-center justify-between px-4 py-3 text-base font-medium text-gray-700 hover:text-navy-700 hover:bg-navy-50 rounded-lg transition-colors"
                      >
                        <Translated>{item.name}</Translated>
                        <svg
                          className={`w-4 h-4 transition-transform ${expandedMobileItem === item.name ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {expandedMobileItem === item.name && (
                        <div className="ml-4 border-l-2 border-navy-100 pl-4 py-1">
                          <Link
                            href={item.href}
                            className="block px-4 py-2 text-sm text-navy-600 font-medium hover:bg-navy-50 rounded-lg"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            View All
                          </Link>
                          {item.submenu.map((subitem) => (
                            <Link
                              key={subitem.name}
                              href={subitem.href}
                              className="block px-4 py-2 text-sm text-gray-600 hover:text-navy-700 hover:bg-navy-50 rounded-lg"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {subitem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-navy-700 hover:bg-navy-50 rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Translated>{item.name}</Translated>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

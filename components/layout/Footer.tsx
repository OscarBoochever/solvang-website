'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Translated from '@/components/Translated'
import { useLanguage } from '@/lib/LanguageContext'

const quickLinks: { name: string; href: string; external?: boolean }[] = [
  { name: 'Home', href: '/' },
  { name: 'Contact Us', href: '/contact' },
  { name: 'Find My Voting District', href: 'https://districtsolvang.org', external: true },
  { name: 'Accessibility', href: '/accessibility' },
  { name: 'Privacy Policy', href: '/privacy' },
]

const departments = [
  { name: 'Administration', href: '/departments/administration' },
  { name: 'Community Development', href: '/departments/community-development' },
  { name: 'Parks & Recreation', href: '/departments/parks-recreation' },
  { name: 'Public Safety', href: '/departments/public-safety' },
  { name: 'Public Works', href: '/departments/public-works' },
  { name: 'Utilities', href: '/departments/utilities' },
  { name: 'Economic Development', href: '/departments/economic-development' },
]

export default function Footer() {
  const { language, translate } = useLanguage()
  const [emailPlaceholder, setEmailPlaceholder] = useState('Your email address')

  useEffect(() => {
    if (language === 'en') {
      setEmailPlaceholder('Your email address')
      return
    }
    translate('Your email address').then(setEmailPlaceholder)
  }, [language, translate])

  return (
    <footer className="bg-gray-100 border-t">
      <div className="container-narrow py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and tagline */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-navy-700 rounded-full flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 4l5 5M15 15l5 5M20 4l-5 5M9 15l-5 5" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <div>
                <div className="font-bold text-navy-800"><Translated>City of Solvang</Translated></div>
                <div className="text-xs text-gold-600"><Translated>The Danish Capital of America</Translated></div>
              </div>
            </Link>

            {/* Social Links */}
            <div className="flex gap-3 mt-4">
              <a
                href="https://www.facebook.com/cityofsolvang"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-navy-700 hover:bg-navy-600 text-white rounded-full flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.77,7.46H14.5v-1.9c0-.9.6-1.1,1-1.1h3V.5L14.17.5C10.24.5,9.25,3.11,9.25,5.16V7.46H6v4h3.25V22h5.25V11.46h3.54l.53-4Z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/cityofsolvang/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-navy-700 hover:bg-navy-600 text-white rounded-full flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,2.16c3.2,0,3.58.01,4.85.07,1.17.05,1.8.25,2.23.41.56.22.96.48,1.38.9s.68.82.9,1.38c.16.42.36,1.06.41,2.23.06,1.27.07,1.65.07,4.85s-.01,3.58-.07,4.85c-.05,1.17-.25,1.8-.41,2.23-.22.56-.48.96-.9,1.38s-.82.68-1.38.9c-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9s-.68-.82-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38s.82-.68,1.38-.9c.42-.16,1.06-.36,2.23-.41,1.27-.06,1.65-.07,4.85-.07M12,0C8.74,0,8.33.01,7.05.07,5.78.13,4.9.33,4.14.63c-.78.3-1.45.71-2.11,1.37S.93,3.36.63,4.14C.33,4.9.13,5.78.07,7.05.01,8.33,0,8.74,0,12s.01,3.67.07,4.95c.06,1.27.26,2.15.56,2.91.3.78.71,1.45,1.37,2.11s1.33,1.07,2.11,1.37c.76.3,1.64.5,2.91.56,1.28.06,1.69.07,4.95.07s3.67-.01,4.95-.07c1.27-.06,2.15-.26,2.91-.56.78-.3,1.45-.71,2.11-1.37s1.07-1.33,1.37-2.11c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.3-.78-.71-1.45-1.37-2.11s-1.33-1.07-2.11-1.37c-.76-.3-1.64-.5-2.91-.56C15.67.01,15.26,0,12,0Z" />
                  <path d="M12,5.84A6.16,6.16,0,1,0,18.16,12,6.16,6.16,0,0,0,12,5.84ZM12,16a4,4,0,1,1,4-4A4,4,0,0,1,12,16Z" />
                  <circle cx="18.41" cy="5.59" r="1.44" />
                </svg>
              </a>
              <a
                href="https://twitter.com/cityofsolvang"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-navy-700 hover:bg-navy-600 text-white rounded-full flex items-center justify-center transition-colors"
                aria-label="X (Twitter)"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@CityofSolvang1"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-navy-700 hover:bg-navy-600 text-white rounded-full flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.5,6.19a3,3,0,0,0-2.12-2.12C19.54,3.5,12,3.5,12,3.5s-7.54,0-9.38.57A3,3,0,0,0,.5,6.19,31.24,31.24,0,0,0,0,12a31.24,31.24,0,0,0,.5,5.81,3,3,0,0,0,2.12,2.12c1.84.57,9.38.57,9.38.57s7.54,0,9.38-.57a3,3,0,0,0,2.12-2.12A31.24,31.24,0,0,0,24,12,31.24,31.24,0,0,0,23.5,6.19ZM9.55,15.57V8.43L15.82,12Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-navy-800 mb-4"><Translated>Contact Us</Translated></h3>
            <address className="not-italic text-sm text-gray-600 space-y-2">
              <p><Translated>City of Solvang</Translated></p>
              <p>1644 Oak Street</p>
              <p>Solvang, CA 93463</p>
              <p className="pt-2">
                <strong><Translated>Phone</Translated>:</strong>{' '}
                <a href="tel:805-688-5575" className="text-navy-600 hover:text-navy-800">
                  (805) 688-5575
                </a>
              </p>
              <p>
                <strong><Translated>Hours</Translated>:</strong> <Translated>Mon-Fri 8am-5pm</Translated>
              </p>
            </address>
          </div>

          {/* Departments */}
          <div>
            <h3 className="font-semibold text-navy-800 mb-4"><Translated>Departments</Translated></h3>
            <ul className="space-y-2">
              {departments.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-navy-700 transition-colors"
                  >
                    <Translated>{link.name}</Translated>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="font-semibold text-navy-800 mb-4"><Translated>Sign Up for E-News</Translated></h3>
            <p className="text-sm text-gray-600 mb-3">
              <Translated>Get city news and alerts delivered to your inbox.</Translated>
            </p>
            <form className="flex gap-2">
              <label htmlFor="email-signup" className="sr-only">
                <Translated>Email address</Translated>
              </label>
              <input
                type="email"
                id="email-signup"
                placeholder={emailPlaceholder}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-burgundy-600 text-white text-sm font-medium rounded-lg hover:bg-burgundy-500 transition-colors focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:ring-offset-2"
              >
                <Translated>Sign Up</Translated>
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <nav aria-label="Footer navigation">
              <ul className="flex flex-wrap justify-center gap-4 text-sm">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-navy-700 transition-colors"
                      >
                        <Translated>{link.name}</Translated>
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-gray-600 hover:text-navy-700 transition-colors"
                      >
                        <Translated>{link.name}</Translated>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} <Translated>City of Solvang. All rights reserved.</Translated>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

// Revalidate layout data (including alerts) every 60 seconds
export const revalidate = 60

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Providers from '@/components/Providers'
import AccessibilityToolbar from '@/components/AccessibilityToolbar'
import AlertBanner from '@/components/AlertBanner'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import A11yScanner from '@/components/A11yScanner'

export const metadata: Metadata = {
  title: 'City of Solvang - The Danish Capital of America',
  description: 'Official website of the City of Solvang, California. Access city services, pay bills, find meeting agendas, and connect with your local government.',
  keywords: ['Solvang', 'California', 'Danish', 'City Hall', 'Municipal', 'Government'],
  openGraph: {
    title: 'City of Solvang',
    description: 'The Danish Capital of America - Official City Website',
    siteName: 'City of Solvang',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'City of Solvang',
    description: 'The Danish Capital of America - Official City Website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://images.ctfassets.net" />
        <link rel="dns-prefetch" href="https://images.ctfassets.net" />
        {/* RSS Feed Auto-Discovery */}
        <link rel="alternate" type="application/rss+xml" title="City of Solvang - All Updates" href="/feed.xml" />
        <link rel="alternate" type="application/rss+xml" title="City of Solvang - News" href="/feed/news" />
        <link rel="alternate" type="application/rss+xml" title="City of Solvang - Events" href="/feed/events" />
      </head>
      <GoogleAnalytics />
      <body className="min-h-screen flex flex-col">
        <Providers>
          {/* Skip to main content - accessibility */}
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>

          {/* Site-wide alerts */}
          <AlertBanner />

          <Header />

          <main id="main-content" className="flex-grow">
            {children}
          </main>

          <Footer />

          {/* Accessibility Toolbar - WCAG 2.2 AA Compliance */}
          <AccessibilityToolbar />

          {/* Automated A11y Scanner - Dev Mode Only */}
          <A11yScanner />
        </Providers>
      </body>
    </html>
  )
}

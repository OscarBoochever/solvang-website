import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Providers from '@/components/Providers'
import AccessibilityToolbar from '@/components/AccessibilityToolbar'

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
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Providers>
          {/* Skip to main content - accessibility */}
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>

          <Header />

          <main id="main-content" className="flex-grow">
            {children}
          </main>

          <Footer />

          {/* Accessibility Toolbar - WCAG 2.2 AA Compliance */}
          <AccessibilityToolbar />
        </Providers>
      </body>
    </html>
  )
}

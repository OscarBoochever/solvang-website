'use client'

import { useEffect } from 'react'

export default function A11yScanner() {
  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== 'development') return

    const initAxe = async () => {
      const React = await import('react')
      const ReactDOM = await import('react-dom')
      const axe = await import('@axe-core/react')

      axe.default(React.default, ReactDOM.default, 1000)
      console.log('%c🔍 Accessibility Scanner Active', 'color: #22c55e; font-weight: bold; font-size: 14px;')
      console.log('%cViolations will appear below. Check the browser console for a11y issues.', 'color: #6b7280;')
    }

    initAxe()
  }, [])

  // Don't render anything in production
  if (process.env.NODE_ENV !== 'development') return null

  return null
}

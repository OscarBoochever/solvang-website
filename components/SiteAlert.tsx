'use client'

import { useState, useEffect } from 'react'
import Translated from '@/components/Translated'

export interface Alert {
  id: string
  title: string
  message: string
  severity: 'info' | 'warning' | 'critical'
  link?: string
  linkText?: string
  dismissible?: boolean
  expiresAt?: string
}

interface SiteAlertProps {
  alerts: Alert[]
}

const severityStyles = {
  info: {
    bg: 'bg-navy-600',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  warning: {
    bg: 'bg-gold-600',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  critical: {
    bg: 'bg-red-600',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
}

export default function SiteAlert({ alerts }: SiteAlertProps) {
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set())

  // Load dismissed alerts from sessionStorage on mount (session-only, not persistent)
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('dismissedAlerts')
      if (stored) {
        const parsed = JSON.parse(stored)
        setDismissedAlerts(new Set(parsed))
      }
    } catch {
      // Ignore storage errors
    }
  }, [])

  const dismissAlert = (id: string) => {
    const newDismissed = new Set(dismissedAlerts)
    newDismissed.add(id)
    setDismissedAlerts(newDismissed)

    try {
      sessionStorage.setItem('dismissedAlerts', JSON.stringify(Array.from(newDismissed)))
    } catch {
      // Ignore storage errors
    }
  }

  // Clear dismissals for non-dismissible alerts (so they must be re-dismissed if made dismissible again)
  useEffect(() => {
    const nonDismissibleIds = alerts
      .filter(alert => alert.dismissible === false)
      .map(alert => alert.id)

    if (nonDismissibleIds.length > 0 && dismissedAlerts.size > 0) {
      const hasOverlap = nonDismissibleIds.some(id => dismissedAlerts.has(id))
      if (hasOverlap) {
        const newDismissed = new Set(dismissedAlerts)
        nonDismissibleIds.forEach(id => newDismissed.delete(id))
        setDismissedAlerts(newDismissed)
        try {
          sessionStorage.setItem('dismissedAlerts', JSON.stringify(Array.from(newDismissed)))
        } catch {
          // Ignore storage errors
        }
      }
    }
  }, [alerts, dismissedAlerts])

  // Filter out dismissed and expired alerts
  // Only honor dismissals for alerts that are actually dismissible
  const activeAlerts = alerts.filter((alert) => {
    if (alert.dismissible !== false && dismissedAlerts.has(alert.id)) return false
    if (alert.expiresAt && new Date(alert.expiresAt) < new Date()) return false
    return true
  })

  if (activeAlerts.length === 0) return null

  // Sort by severity (critical first, then warning, then info)
  const sortedAlerts = [...activeAlerts].sort((a, b) => {
    const order = { critical: 0, warning: 1, info: 2 }
    return order[a.severity] - order[b.severity]
  })

  return (
    <div className="site-alerts">
      {sortedAlerts.map((alert) => {
        const styles = severityStyles[alert.severity]

        return (
          <div
            key={alert.id}
            className={`${styles.bg} text-white`}
            role="alert"
            aria-live={alert.severity === 'critical' ? 'assertive' : 'polite'}
          >
            <div className="container-narrow py-3">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 mt-0.5" aria-hidden="true">
                  {styles.icon}
                </span>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold">
                    <Translated>{alert.title}</Translated>
                  </p>
                  <p className="text-sm text-white/90 mt-0.5">
                    <Translated>{alert.message}</Translated>
                  </p>
                  {alert.link && (
                    <a
                      href={alert.link}
                      className="inline-flex items-center gap-1 text-sm font-medium mt-2 underline hover:no-underline"
                    >
                      <Translated>{alert.linkText || 'Learn more'}</Translated>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  )}
                </div>

                {alert.dismissible !== false && (
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="flex-shrink-0 p-1 hover:bg-white/20 rounded transition-colors"
                    aria-label="Dismiss alert"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

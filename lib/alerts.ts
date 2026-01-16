import type { Alert } from '@/components/SiteAlert'

// Site-wide alerts configuration
// In production, these could come from Contentful CMS or an API
export const siteAlerts: Alert[] = [
  // Example alerts - comment out to hide
  {
    id: 'city-hall-closure-mlk',
    title: 'City Hall Closure',
    message: 'City Hall will be closed Monday, January 20th for Martin Luther King Jr. Day.',
    severity: 'info',
    dismissible: true,
    expiresAt: '2026-01-21T00:00:00',
  },
  // Uncomment below for testing other severity levels:
  // {
  //   id: 'winter-storm-2025',
  //   title: 'Winter Storm Warning',
  //   message: 'A winter storm is expected this weekend. City offices may have modified hours.',
  //   severity: 'warning',
  //   link: '/news',
  //   linkText: 'View details',
  //   dismissible: true,
  // },
  // {
  //   id: 'emergency-evacuation',
  //   title: 'Emergency Evacuation Order',
  //   message: 'Mandatory evacuation order in effect for Zone A. Seek shelter immediately.',
  //   severity: 'critical',
  //   link: '/emergency',
  //   linkText: 'Emergency information',
  //   dismissible: false,
  // },
]

export function getActiveAlerts(): Alert[] {
  const now = new Date()
  return siteAlerts.filter((alert) => {
    if (alert.expiresAt && new Date(alert.expiresAt) < now) {
      return false
    }
    return true
  })
}

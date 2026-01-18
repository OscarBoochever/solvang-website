import { unstable_noStore as noStore } from 'next/cache'
import SiteAlert, { Alert } from './SiteAlert'
import { getActiveAlerts } from '@/lib/contentful'

export default async function AlertBanner() {
  // Disable caching for alerts - they should always be fresh
  noStore()
  let alerts: Alert[] = []

  try {
    const contentfulAlerts = await getActiveAlerts()
    alerts = contentfulAlerts.map((item: any) => ({
      id: item.sys.id,
      title: item.fields.title,
      message: item.fields.message,
      severity: item.fields.severity,
      link: item.fields.link,
      linkText: item.fields.linkText,
      dismissible: item.fields.dismissible ?? true,
      expiresAt: item.fields.expiresAt,
    }))
  } catch (error) {
    console.error('Failed to fetch alerts:', error)
    // Return empty alerts on error
  }

  if (alerts.length === 0) return null

  return <SiteAlert alerts={alerts} />
}

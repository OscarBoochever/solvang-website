import SiteAlert from './SiteAlert'
import { getActiveAlerts } from '@/lib/alerts'

export default function AlertBanner() {
  const alerts = getActiveAlerts()

  if (alerts.length === 0) return null

  return <SiteAlert alerts={alerts} />
}

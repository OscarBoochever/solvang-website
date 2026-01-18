import { getEvents } from '@/lib/contentful'
import { richTextToPlainText } from '@/lib/richTextUtils'
import CalendarView from './CalendarView'
import Translated from '@/components/Translated'
import Breadcrumb from '@/components/Breadcrumb'

export const revalidate = 60

export default async function EventsPage() {
  const events = await getEvents()

  // Transform events for the calendar component
  const calendarEvents = events.map((event: any) => {
    const fields = event.fields
    return {
      id: event.sys.id,
      title: fields.title,
      date: fields.date,
      time: fields.time || '',
      location: fields.location || '',
      description: richTextToPlainText(fields.description),
      eventType: fields.eventType || 'meeting',
    }
  })

  return (
    <main className="py-12">
      <div className="container-narrow">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Events Calendar' },
          ]}
        />
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-800 mb-2"><Translated>Events Calendar</Translated></h1>
          <p className="text-gray-600">
            <Translated>View upcoming city meetings, events, and important dates.</Translated>
          </p>
        </div>

        <CalendarView events={calendarEvents} />
      </div>
    </main>
  )
}

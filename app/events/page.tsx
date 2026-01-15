import { getEvents } from '@/lib/contentful'
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer'
import CalendarView from './CalendarView'

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
      description: fields.description
        ? documentToPlainTextString(fields.description)
        : '',
      eventType: fields.eventType || 'meeting',
    }
  })

  return (
    <main className="py-12">
      <div className="container-narrow">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-800 mb-2">Events Calendar</h1>
          <p className="text-gray-600">
            View upcoming city meetings, events, and important dates.
          </p>
        </div>

        <CalendarView events={calendarEvents} />
      </div>
    </main>
  )
}

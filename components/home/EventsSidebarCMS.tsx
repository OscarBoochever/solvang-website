import Link from 'next/link'
import { getUpcomingEvents } from '@/lib/contentful'
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer'
import Translated from '@/components/Translated'

function formatEventDate(dateString: string) {
  const date = new Date(dateString)
  return {
    month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    day: date.getDate(),
    weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
  }
}

export default async function EventsSidebarCMS() {
  const events = await getUpcomingEvents(5)

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-navy-700 text-white px-4 py-3">
        <h2 className="font-semibold flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <Translated>Upcoming Events</Translated>
        </h2>
      </div>

      {/* Events List */}
      <div className="divide-y">
        {events.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <Translated>No upcoming events</Translated>
          </div>
        ) : (
          events.map((event: any) => {
            const fields = event.fields
            const { month, day, weekday } = formatEventDate(fields.date)
            const description = fields.description
              ? documentToPlainTextString(fields.description)
              : null

            return (
              <div
                key={event.sys.id}
                className="flex gap-3 p-3 hover:bg-gray-50 transition-colors group relative"
              >
                {/* Date badge */}
                <div className="flex-shrink-0 w-14 text-center">
                  <div className="bg-navy-700 text-white text-xs font-medium py-1 rounded-t">
                    {month}
                  </div>
                  <div className="bg-white border border-t-0 border-gray-200 rounded-b py-1">
                    <div className="text-xl font-bold text-navy-800">{day}</div>
                    <div className="text-xs text-gray-500">{weekday}</div>
                  </div>
                </div>

                {/* Event details */}
                <div className="flex-grow min-w-0">
                  <h3 className="font-medium text-navy-800 group-hover:text-navy-600 transition-colors text-sm line-clamp-1">
                    <Translated>{fields.title}</Translated>
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {fields.time} • <Translated>{fields.location}</Translated>
                  </p>
                  {fields.eventType === 'event' && (
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 rounded">
                      <Translated>Special Event</Translated>
                    </span>
                  )}
                </div>

                {/* Hover tooltip */}
                {description && (
                  <div className="absolute left-full top-0 ml-2 w-64 p-3 bg-navy-800 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                    <div className="font-semibold mb-1"><Translated>{fields.title}</Translated></div>
                    <div className="text-white/80 mb-2">{fields.time} <Translated>at</Translated> <Translated>{fields.location}</Translated></div>
                    <div className="text-white/70 line-clamp-4"><Translated>{description}</Translated></div>
                    <div className="absolute left-0 top-4 -translate-x-full border-8 border-transparent border-r-navy-800" />
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* View All Link */}
      <div className="p-3 bg-gray-50 border-t">
        <Link
          href="/events"
          className="block text-center text-sm font-medium text-navy-600 hover:text-navy-800 transition-colors"
        >
          <Translated>View Full Calendar</Translated> →
        </Link>
      </div>
    </div>
  )
}

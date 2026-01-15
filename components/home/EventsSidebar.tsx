'use client'

import Link from 'next/link'
import Translated from '@/components/Translated'

// Sample events data - in production this would come from Strapi
const upcomingEvents = [
  {
    id: 1,
    title: 'City Council Meeting',
    date: '2026-01-13',
    time: '6:30 PM',
    location: 'Council Chambers',
    type: 'meeting',
  },
  {
    id: 2,
    title: 'Planning Commission',
    date: '2026-01-15',
    time: '6:00 PM',
    location: 'Council Chambers',
    type: 'meeting',
  },
  {
    id: 3,
    title: 'Parks & Rec Commission',
    date: '2026-01-20',
    time: '5:30 PM',
    location: 'City Hall',
    type: 'meeting',
  },
  {
    id: 4,
    title: 'City Council Meeting',
    date: '2026-01-27',
    time: '6:30 PM',
    location: 'Council Chambers',
    type: 'meeting',
  },
  {
    id: 5,
    title: 'Polar Bear Plunge',
    date: '2026-02-01',
    time: '10:00 AM',
    location: 'Lake Santa Ynez',
    type: 'event',
  },
]

function formatEventDate(dateString: string) {
  const date = new Date(dateString)
  return {
    month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    day: date.getDate(),
    weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
  }
}

export default function EventsSidebar() {
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

      {/* Tabs */}
      <div className="flex border-b">
        <button className="flex-1 px-4 py-2 text-sm font-medium text-navy-700 border-b-2 border-gold-500 bg-gold-50">
          <Translated>Meetings</Translated>
        </button>
        <button className="flex-1 px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
          <Translated>Events</Translated>
        </button>
      </div>

      {/* Events List */}
      <div className="divide-y">
        {upcomingEvents.map((event) => {
          const { month, day, weekday } = formatEventDate(event.date)

          return (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="flex gap-3 p-3 hover:bg-gray-50 transition-colors group"
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
                  <Translated>{event.title}</Translated>
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {event.time} • <Translated>{event.location}</Translated>
                </p>
                {event.type === 'event' && (
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 rounded">
                    <Translated>Special Event</Translated>
                  </span>
                )}
              </div>
            </Link>
          )
        })}
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

'use client'

import { useState } from 'react'
import Translated from '@/components/Translated'

interface CalendarEvent {
  id: string
  title: string
  date: string
  time: string
  location: string
  description: string
  eventType: string
}

interface CalendarViewProps {
  events: CalendarEvent[]
}

export default function CalendarView({ events }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Get month name
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  // Navigate months
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  // Get events for a specific day
  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return events.filter(event => event.date === dateStr)
  }

  // Check if a day is today
  const isToday = (day: number) => {
    const today = new Date()
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
  }

  // Build calendar grid
  const days = []
  for (let i = 0; i < firstDay; i++) {
    days.push(null) // Empty cells before first day
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Calendar */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Calendar Header */}
          <div className="bg-navy-700 text-white px-6 py-4 flex items-center justify-between">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Previous month"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="text-center">
              <h2 className="text-xl font-semibold">{monthName}</h2>
            </div>

            <button
              onClick={nextMonth}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Next month"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 bg-gray-50 border-b">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="py-3 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7">
            {days.map((day, index) => {
              const dayEvents = day ? getEventsForDay(day) : []
              const hasEvents = dayEvents.length > 0

              return (
                <div
                  key={index}
                  className={`min-h-24 border-b border-r p-2 ${
                    day === null ? 'bg-gray-50' : 'hover:bg-gray-50'
                  } ${isToday(day || 0) ? 'bg-gold-50' : ''}`}
                >
                  {day && (
                    <>
                      <div className={`text-sm font-medium mb-1 ${
                        isToday(day) ? 'text-gold-600' : 'text-gray-700'
                      }`}>
                        {day}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map(event => (
                          <button
                            key={event.id}
                            onClick={() => setSelectedEvent(event)}
                            className={`w-full text-left text-xs px-2 py-1 rounded truncate transition-colors ${
                              event.eventType === 'event'
                                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                : 'bg-navy-100 text-navy-700 hover:bg-navy-200'
                            }`}
                          >
                            {event.title}
                          </button>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-gray-500 px-2">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-navy-100 rounded" />
            <span><Translated>Meeting</Translated></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-100 rounded" />
            <span><Translated>Special Event</Translated></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gold-50 border border-gold-200 rounded" />
            <span><Translated>Today</Translated></span>
          </div>
        </div>
      </div>

      {/* Event Details Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
          {selectedEvent ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  selectedEvent.eventType === 'event'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-navy-100 text-navy-700'
                }`}>
                  {selectedEvent.eventType === 'event' ? <Translated>Special Event</Translated> : <Translated>Meeting</Translated>}
                </span>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <h3 className="text-xl font-semibold text-navy-800 mb-4">
                <Translated>{selectedEvent.title}</Translated>
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <div className="font-medium text-gray-700"><Translated>Date</Translated></div>
                    <div className="text-gray-600">
                      {new Date(selectedEvent.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>

                {selectedEvent.time && (
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <div className="font-medium text-gray-700"><Translated>Time</Translated></div>
                      <div className="text-gray-600">{selectedEvent.time}</div>
                    </div>
                  </div>
                )}

                {selectedEvent.location && (
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <div className="font-medium text-gray-700"><Translated>Location</Translated></div>
                      <div className="text-gray-600"><Translated>{selectedEvent.location}</Translated></div>
                    </div>
                  </div>
                )}

                {selectedEvent.description && (
                  <div className="pt-3 border-t">
                    <div className="font-medium text-gray-700 mb-2"><Translated>Details</Translated></div>
                    <p className="text-gray-600"><Translated>{selectedEvent.description}</Translated></p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p><Translated>Click an event to see details</Translated></p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

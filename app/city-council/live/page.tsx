import Translated from '@/components/Translated'
import Breadcrumb from '@/components/Breadcrumb'
import Link from 'next/link'

export const metadata = {
  title: 'Stream Live - City Council | City of Solvang',
  description: 'Watch live City Council meetings in real-time. Stream ongoing meetings and stay informed about city decisions.',
}

export default function StreamLivePage() {
  return (
    <main className="py-12">
      <div className="container-narrow">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'City Council', href: '/city-council' },
            { label: 'Stream Live' },
          ]}
        />

        <h1 className="text-3xl font-bold text-navy-800 mb-4">
          <Translated>Stream Live - City Council Meetings</Translated>
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          <Translated>
            Watch ongoing City Council meetings in real-time. Meetings are typically held on the second and fourth Monday of each month at 6:30 PM.
          </Translated>
        </p>

        {/* Vimeo Embed */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="bg-gray-900 rounded-xl overflow-hidden">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src="https://player.vimeo.com/video/cityofsolvang?autoplay=0&title=0&byline=0&portrait=0"
                className="absolute top-0 left-0 w-full h-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title="City of Solvang Live Stream"
              />
            </div>
          </div>
        </div>

        {/* Fallback & Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-navy-50 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-navy-800 mb-3">
              <Translated>No Active Stream?</Translated>
            </h2>
            <p className="text-gray-600 mb-4">
              <Translated>
                If there is no live stream currently active, the meeting may not be in session. Check our events calendar for the next scheduled meeting.
              </Translated>
            </p>
            <Link
              href="/events"
              className="inline-flex items-center text-navy-600 hover:text-navy-800 font-medium"
            >
              <Translated>View Events Calendar</Translated>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-navy-800 mb-3">
              <Translated>Watch Past Meetings</Translated>
            </h2>
            <p className="text-gray-600 mb-4">
              <Translated>
                Missed a meeting? View recordings of past City Council meetings on our official channels.
              </Translated>
            </p>
            <div className="flex flex-col gap-2">
              <a
                href="https://vimeo.com/cityofsolvang"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-navy-600 hover:text-navy-800 font-medium"
              >
                <Translated>Vimeo Channel</Translated>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@CityofSolvang1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-navy-600 hover:text-navy-800 font-medium"
              >
                <Translated>YouTube Channel</Translated>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Meeting Info */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-navy-800 mb-4">
            <Translated>Meeting Information</Translated>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-medium text-gray-700 mb-1"><Translated>Schedule</Translated></div>
              <p className="text-gray-600">
                <Translated>2nd & 4th Monday of each month</Translated>
              </p>
            </div>
            <div>
              <div className="font-medium text-gray-700 mb-1"><Translated>Time</Translated></div>
              <p className="text-gray-600">6:30 PM</p>
            </div>
            <div>
              <div className="font-medium text-gray-700 mb-1"><Translated>Location</Translated></div>
              <p className="text-gray-600">
                <Translated>Solvang City Hall, Council Chambers</Translated>
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-500">
              <Translated>
                Public comment is welcome on agenda items. Attend in person or submit written comments to cityclerk@cityofsolvang.com by noon on the day of the meeting.
              </Translated>
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-8">
          <Link
            href="/city-council"
            className="inline-flex items-center text-navy-600 hover:text-navy-800 font-medium"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <Translated>Back to City Council</Translated>
          </Link>
        </div>
      </div>
    </main>
  )
}

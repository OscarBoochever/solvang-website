import { Metadata } from 'next'
import Translated from '@/components/Translated'
import Breadcrumb from '@/components/Breadcrumb'
import SubscriptionForm from '@/components/forms/SubscriptionForm'

export const metadata: Metadata = {
  title: 'Email & SMS Notifications | City of Solvang',
  description: 'Subscribe to receive email and SMS notifications from the City of Solvang for news, alerts, meetings, and more.',
}

export default function SubscribePage() {
  return (
    <main className="py-12">
      <div className="container-narrow">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Subscribe to Notifications' },
          ]}
        />

        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold text-navy-800 mb-2">
            <Translated>Email & SMS Notifications</Translated>
          </h1>
          <p className="text-gray-600 mb-8">
            <Translated>
              Stay informed about what&apos;s happening in Solvang. Choose the topics that matter to you
              and receive notifications via email, SMS, or both.
            </Translated>
          </p>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <SubscriptionForm />
          </div>

          {/* RSS Feeds Section */}
          <div className="mt-8 bg-orange-50 rounded-xl p-6 border border-orange-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.18,15.64a2.18,2.18,0,1,1,0,4.36,2.18,2.18,0,0,1,0-4.36M4,4.44A1.5,1.5,0,0,1,4,7.44,12.56,12.56,0,0,0,16.56,20a1.5,1.5,0,0,1,3,0A15.56,15.56,0,0,1,4,4.44Zm0,5.66a1.5,1.5,0,0,1,0,3A6.9,6.9,0,0,0,10.9,20a1.5,1.5,0,0,1,3,0A9.9,9.9,0,0,1,4,10.1Z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  <Translated>Prefer RSS?</Translated>
                </h3>
                <p className="text-sm text-gray-600">
                  <Translated>Subscribe to updates using your favorite RSS reader</Translated>
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href="/feed.xml"
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-orange-200 text-sm text-gray-700 hover:bg-orange-100 transition-colors"
              >
                <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.18,15.64a2.18,2.18,0,1,1,0,4.36,2.18,2.18,0,0,1,0-4.36M4,4.44A1.5,1.5,0,0,1,4,7.44,12.56,12.56,0,0,0,16.56,20a1.5,1.5,0,0,1,3,0A15.56,15.56,0,0,1,4,4.44Zm0,5.66a1.5,1.5,0,0,1,0,3A6.9,6.9,0,0,0,10.9,20a1.5,1.5,0,0,1,3,0A9.9,9.9,0,0,1,4,10.1Z" />
                </svg>
                <Translated>All Updates</Translated>
              </a>
              <a
                href="/feed/news"
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-orange-200 text-sm text-gray-700 hover:bg-orange-100 transition-colors"
              >
                <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.18,15.64a2.18,2.18,0,1,1,0,4.36,2.18,2.18,0,0,1,0-4.36M4,4.44A1.5,1.5,0,0,1,4,7.44,12.56,12.56,0,0,0,16.56,20a1.5,1.5,0,0,1,3,0A15.56,15.56,0,0,1,4,4.44Zm0,5.66a1.5,1.5,0,0,1,0,3A6.9,6.9,0,0,0,10.9,20a1.5,1.5,0,0,1,3,0A9.9,9.9,0,0,1,4,10.1Z" />
                </svg>
                <Translated>News Only</Translated>
              </a>
              <a
                href="/feed/events"
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-orange-200 text-sm text-gray-700 hover:bg-orange-100 transition-colors"
              >
                <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.18,15.64a2.18,2.18,0,1,1,0,4.36,2.18,2.18,0,0,1,0-4.36M4,4.44A1.5,1.5,0,0,1,4,7.44,12.56,12.56,0,0,0,16.56,20a1.5,1.5,0,0,1,3,0A15.56,15.56,0,0,1,4,4.44Zm0,5.66a1.5,1.5,0,0,1,0,3A6.9,6.9,0,0,0,10.9,20a1.5,1.5,0,0,1,3,0A9.9,9.9,0,0,1,4,10.1Z" />
                </svg>
                <Translated>Events & Meetings</Translated>
              </a>
              <a
                href="/feed/departments/city-hall"
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-orange-200 text-sm text-gray-700 hover:bg-orange-100 transition-colors"
              >
                <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.18,15.64a2.18,2.18,0,1,1,0,4.36,2.18,2.18,0,0,1,0-4.36M4,4.44A1.5,1.5,0,0,1,4,7.44,12.56,12.56,0,0,0,16.56,20a1.5,1.5,0,0,1,3,0A15.56,15.56,0,0,1,4,4.44Zm0,5.66a1.5,1.5,0,0,1,0,3A6.9,6.9,0,0,0,10.9,20a1.5,1.5,0,0,1,3,0A9.9,9.9,0,0,1,4,10.1Z" />
                </svg>
                <Translated>By Department</Translated>
              </a>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              <Translated>RSS feeds are available for each department at /feed/departments/[department-slug]</Translated>
            </p>
          </div>

          {/* Privacy Notice */}
          <div className="mt-6 text-sm text-gray-500">
            <h3 className="font-medium text-gray-700 mb-2">
              <Translated>Privacy Notice</Translated>
            </h3>
            <p>
              <Translated>
                Your contact information will only be used to send you the notifications you select.
                We will never share your information with third parties. You can update your preferences
                or unsubscribe at any time by clicking the link in any notification email.
              </Translated>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

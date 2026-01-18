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
          <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-navy-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-navy-600" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="6.18" cy="17.82" r="2.18"/>
                  <path d="M4 4.44v3c6.59.01 11.95 5.37 11.96 11.96h3C18.95 11.19 12.81 5.05 4 4.44z"/>
                  <path d="M4 10.1v3c3.29.01 5.96 2.68 5.97 5.97h3C12.96 13.84 9.16 10.11 4 10.1z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  <Translated>Prefer RSS?</Translated>
                </h3>
                <p className="text-sm text-gray-600">
                  <Translated>Subscribe using your favorite feed reader</Translated>
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a
                href="/feed.xml"
                className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-lg border border-gray-200 text-sm text-gray-700 hover:border-navy-300 hover:bg-navy-50 transition-colors"
              >
                <svg className="w-4 h-4 text-navy-600" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="6.18" cy="17.82" r="2.18"/>
                  <path d="M4 4.44v3c6.59.01 11.95 5.37 11.96 11.96h3C18.95 11.19 12.81 5.05 4 4.44z"/>
                  <path d="M4 10.1v3c3.29.01 5.96 2.68 5.97 5.97h3C12.96 13.84 9.16 10.11 4 10.1z"/>
                </svg>
                <Translated>All Updates</Translated>
              </a>
              <a
                href="/feed/news"
                className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-lg border border-gray-200 text-sm text-gray-700 hover:border-navy-300 hover:bg-navy-50 transition-colors"
              >
                <svg className="w-4 h-4 text-navy-600" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="6.18" cy="17.82" r="2.18"/>
                  <path d="M4 4.44v3c6.59.01 11.95 5.37 11.96 11.96h3C18.95 11.19 12.81 5.05 4 4.44z"/>
                  <path d="M4 10.1v3c3.29.01 5.96 2.68 5.97 5.97h3C12.96 13.84 9.16 10.11 4 10.1z"/>
                </svg>
                <Translated>News</Translated>
              </a>
              <a
                href="/feed/events"
                className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-lg border border-gray-200 text-sm text-gray-700 hover:border-navy-300 hover:bg-navy-50 transition-colors"
              >
                <svg className="w-4 h-4 text-navy-600" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="6.18" cy="17.82" r="2.18"/>
                  <path d="M4 4.44v3c6.59.01 11.95 5.37 11.96 11.96h3C18.95 11.19 12.81 5.05 4 4.44z"/>
                  <path d="M4 10.1v3c3.29.01 5.96 2.68 5.97 5.97h3C12.96 13.84 9.16 10.11 4 10.1z"/>
                </svg>
                <Translated>Events</Translated>
              </a>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              <Translated>Department-specific feeds are available on each department page.</Translated>
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

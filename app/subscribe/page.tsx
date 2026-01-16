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

import { Metadata } from 'next'
import Translated from '@/components/Translated'
import Breadcrumb from '@/components/Breadcrumb'
import ReportConcernForm from '@/components/forms/ReportConcernForm'

export const metadata: Metadata = {
  title: 'Report a Concern | City of Solvang',
  description: 'Report potholes, streetlight outages, water leaks, code violations, and other issues to the City of Solvang.',
}

export default function ReportConcernPage() {
  return (
    <main className="py-12">
      <div className="container-narrow">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'How To', href: '/how-to' },
            { label: 'Report a Concern' },
          ]}
        />

        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold text-navy-800 mb-2">
            <Translated>Report a Concern</Translated>
          </h1>
          <p className="text-gray-600 mb-8">
            <Translated>
              Help us keep Solvang safe and well-maintained. Report potholes, streetlight outages, water leaks, code violations, and other issues.
            </Translated>
          </p>

          {/* Info Box */}
          <div className="bg-burgundy-50 border border-burgundy-200 rounded-lg p-4 mb-8">
            <h2 className="font-semibold text-burgundy-800 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <Translated>For Emergencies</Translated>
            </h2>
            <ul className="text-sm text-burgundy-700 space-y-1 ml-7">
              <li>
                <Translated>For emergencies, always dial 911.</Translated>
              </li>
              <li>
                <Translated>For urgent water or sewer emergencies after hours, call (805) 588-8119.</Translated>
              </li>
              <li>
                <Translated>For non-emergency police matters, call (805) 686-5000.</Translated>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <ReportConcernForm />
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-sm text-gray-600 space-y-4">
            <h3 className="font-semibold text-gray-800">
              <Translated>What Happens Next</Translated>
            </h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>
                <Translated>
                  Your report is sent directly to the Public Works Department.
                </Translated>
              </li>
              <li>
                <Translated>
                  Staff will assess the issue and prioritize based on safety and urgency.
                </Translated>
              </li>
              <li>
                <Translated>
                  If you provided contact information, we may follow up with questions or updates.
                </Translated>
              </li>
              <li>
                <Translated>
                  Most non-emergency issues are addressed within 3-5 business days.
                </Translated>
              </li>
            </ol>

            <h3 className="font-semibold text-gray-800 pt-4">
              <Translated>Contact Public Works Directly</Translated>
            </h3>
            <p>
              <Translated>Phone:</Translated>{' '}
              <a href="tel:8056885575" className="text-navy-600 hover:text-navy-800">
                (805) 688-5575 ext. 225
              </a>
            </p>
            <p>
              <Translated>Email:</Translated>{' '}
              <a href="mailto:publicworks@cityofsolvang.com" className="text-navy-600 hover:text-navy-800">
                publicworks@cityofsolvang.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

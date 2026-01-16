import { Metadata } from 'next'
import Translated from '@/components/Translated'
import Breadcrumb from '@/components/Breadcrumb'
import PublicRecordsForm from '@/components/forms/PublicRecordsForm'

export const metadata: Metadata = {
  title: 'Public Records Request | City of Solvang',
  description: 'Submit a public records request to the City of Solvang under the California Public Records Act (CPRA).',
}

export default function PublicRecordsPage() {
  return (
    <main className="py-12">
      <div className="container-narrow">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Public Records Request' },
          ]}
        />

        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold text-navy-800 mb-2">
            <Translated>Public Records Request</Translated>
          </h1>
          <p className="text-gray-600 mb-8">
            <Translated>
              Submit a request for public records under the California Public Records Act (Government Code Section 6250 et seq.).
            </Translated>
          </p>

          {/* Info Box */}
          <div className="bg-navy-50 border border-navy-200 rounded-lg p-4 mb-8">
            <h2 className="font-semibold text-navy-800 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <Translated>Before You Submit</Translated>
            </h2>
            <ul className="text-sm text-navy-700 space-y-1 ml-7">
              <li>
                <Translated>Many City documents are already available online. Check our website first.</Translated>
              </li>
              <li>
                <Translated>Meeting agendas and minutes are available on our Events Calendar.</Translated>
              </li>
              <li>
                <Translated>The City Clerk can answer questions about available records at (805) 688-5575.</Translated>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <PublicRecordsForm />
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-sm text-gray-600 space-y-4">
            <h3 className="font-semibold text-gray-800">
              <Translated>What to Expect</Translated>
            </h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>
                <Translated>
                  You will receive a confirmation email with your reference number.
                </Translated>
              </li>
              <li>
                <Translated>
                  The City will respond within 10 calendar days as required by law.
                </Translated>
              </li>
              <li>
                <Translated>
                  If additional time is needed, we will notify you of the extension.
                </Translated>
              </li>
              <li>
                <Translated>
                  Fees may apply for copying or extensive search time.
                </Translated>
              </li>
            </ol>

            <h3 className="font-semibold text-gray-800 pt-4">
              <Translated>Contact</Translated>
            </h3>
            <p>
              <Translated>For questions about your request, contact the City Clerk:</Translated>
            </p>
            <p>
              <Translated>Phone:</Translated>{' '}
              <a href="tel:8056885575" className="text-navy-600 hover:text-navy-800">
                (805) 688-5575
              </a>
            </p>
            <p>
              <Translated>Email:</Translated>{' '}
              <a href="mailto:cityclerk@cityofsolvang.com" className="text-navy-600 hover:text-navy-800">
                cityclerk@cityofsolvang.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

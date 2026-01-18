import { Metadata } from 'next'
import Translated from '@/components/Translated'
import Breadcrumb from '@/components/Breadcrumb'
import BusinessCertificateForm from '@/components/forms/BusinessCertificateForm'

export const metadata: Metadata = {
  title: 'Business Certificate Application | City of Solvang',
  description: 'Apply for a business certificate to operate your business in the City of Solvang, California.',
}

export default function BusinessCertificatePage() {
  return (
    <main className="py-12">
      <div className="container-narrow">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Business', href: '/business' },
            { label: 'Business Certificate' },
          ]}
        />

        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold text-navy-800 mb-2">
            <Translated>Business Certificate Application</Translated>
          </h1>
          <p className="text-gray-600 mb-8">
            <Translated>
              All businesses operating within the City of Solvang are required to obtain a business certificate. Complete this application to start the process.
            </Translated>
          </p>

          {/* Info Box */}
          <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 mb-8">
            <h2 className="font-semibold text-sky-800 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <Translated>Before You Apply</Translated>
            </h2>
            <ul className="text-sm text-sky-700 space-y-1 ml-7">
              <li>
                <Translated>Business certificates are renewed annually and fees vary by business type.</Translated>
              </li>
              <li>
                <Translated>Home-based businesses may have additional requirements.</Translated>
              </li>
              <li>
                <Translated>Some business types require additional permits (food service, alcohol, etc.).</Translated>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <BusinessCertificateForm />
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-sm text-gray-600 space-y-4">
            <h3 className="font-semibold text-gray-800">
              <Translated>What Happens Next</Translated>
            </h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>
                <Translated>
                  Your application is reviewed by the Finance Department.
                </Translated>
              </li>
              <li>
                <Translated>
                  Staff will contact you regarding any additional requirements or permits needed.
                </Translated>
              </li>
              <li>
                <Translated>
                  Once approved, you&apos;ll receive information about fees and payment options.
                </Translated>
              </li>
              <li>
                <Translated>
                  Your business certificate will be issued after payment is received.
                </Translated>
              </li>
            </ol>

            <h3 className="font-semibold text-gray-800 pt-4">
              <Translated>Contact Finance Department</Translated>
            </h3>
            <p>
              <Translated>Phone:</Translated>{' '}
              <a href="tel:8056885575" className="text-navy-600 hover:text-navy-800">
                (805) 688-5575
              </a>
            </p>
            <p>
              <Translated>Email:</Translated>{' '}
              <a href="mailto:finance@cityofsolvang.com" className="text-navy-600 hover:text-navy-800">
                finance@cityofsolvang.com
              </a>
            </p>
            <p>
              <Translated>Hours:</Translated> Monday – Friday, 8:00 AM – 5:00 PM
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

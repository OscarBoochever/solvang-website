import { Metadata } from 'next'
import Translated from '@/components/Translated'
import Breadcrumb from '@/components/Breadcrumb'
import ContactForm from '@/components/forms/ContactForm'

export const metadata: Metadata = {
  title: 'Contact Us | City of Solvang',
  description: 'Contact the City of Solvang. Send us a message, find department phone numbers, or visit us at City Hall.',
}

export default function ContactPage() {
  return (
    <main className="py-12">
      <div className="container-narrow">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'How To', href: '/how-to' },
            { label: 'Contact Us' },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Form */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-navy-800 mb-2">
              <Translated>Contact Us</Translated>
            </h1>
            <p className="text-gray-600 mb-8">
              <Translated>
                Have a question or need assistance? Fill out the form below and we&apos;ll get back to you within 2-3 business days.
              </Translated>
            </p>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <ContactForm />
            </div>
          </div>

          {/* Sidebar - Contact Info */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
              <h2 className="font-semibold text-navy-800 mb-4">
                <Translated>City Hall</Translated>
              </h2>

              <div className="space-y-4 text-sm">
                <div>
                  <div className="font-medium text-gray-700 mb-1">
                    <Translated>Address</Translated>
                  </div>
                  <p className="text-gray-600">
                    1644 Oak Street<br />
                    Solvang, CA 93463
                  </p>
                </div>

                <div>
                  <div className="font-medium text-gray-700 mb-1">
                    <Translated>Phone</Translated>
                  </div>
                  <a
                    href="tel:8056885575"
                    className="text-navy-600 hover:text-navy-800"
                  >
                    (805) 688-5575
                  </a>
                </div>

                <div>
                  <div className="font-medium text-gray-700 mb-1">
                    <Translated>Fax</Translated>
                  </div>
                  <p className="text-gray-600">(805) 686-2529</p>
                </div>

                <div>
                  <div className="font-medium text-gray-700 mb-1">
                    <Translated>Email</Translated>
                  </div>
                  <a
                    href="mailto:info@cityofsolvang.com"
                    className="text-navy-600 hover:text-navy-800 break-all"
                  >
                    info@cityofsolvang.com
                  </a>
                </div>

                <div className="pt-4 border-t">
                  <div className="font-medium text-gray-700 mb-1">
                    <Translated>Office Hours</Translated>
                  </div>
                  <p className="text-gray-600">
                    <Translated>Monday - Friday</Translated>
                  </p>
                  <p className="text-gray-600">8:00 AM - 5:00 PM</p>
                </div>
              </div>

              {/* Quick Links */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium text-gray-700 mb-3">
                  <Translated>Quick Links</Translated>
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="/departments" className="text-navy-600 hover:text-navy-800 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <Translated>City Departments</Translated>
                    </a>
                  </li>
                  <li>
                    <a href="/public-records" className="text-navy-600 hover:text-navy-800 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <Translated>Public Records Request</Translated>
                    </a>
                  </li>
                  <li>
                    <a href="/events" className="text-navy-600 hover:text-navy-800 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <Translated>City Calendar</Translated>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

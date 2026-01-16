import Translated from '@/components/Translated'
import Breadcrumb from '@/components/Breadcrumb'

export const metadata = {
  title: 'Accessibility Statement | City of Solvang',
  description: 'The City of Solvang is committed to ensuring digital accessibility for all users. Learn about our accessibility features and how to contact us with concerns.',
}

export default function AccessibilityPage() {
  return (
    <main className="py-12">
      <div className="container-narrow">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Accessibility Statement' },
          ]}
        />
        <h1 className="text-3xl font-bold text-navy-800 mb-2">
          <Translated>Accessibility Statement</Translated>
        </h1>
        <p className="text-gray-600 mb-8">
          <Translated>Our commitment to making Solvang&apos;s digital services accessible to everyone.</Translated>
        </p>

        <div className="prose prose-navy max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-navy-800 mb-4">
              <Translated>Our Commitment</Translated>
            </h2>
            <p className="text-gray-700 mb-4">
              <Translated>
                The City of Solvang is committed to ensuring that our website is accessible to all users,
                including those with disabilities. We strive to meet or exceed the Web Content Accessibility
                Guidelines (WCAG) 2.2 Level AA standards, as required by Section 508 of the Rehabilitation Act
                and the Americans with Disabilities Act (ADA).
              </Translated>
            </p>
            <p className="text-gray-700">
              <Translated>
                We believe that all residents, visitors, and community members should have equal access to
                city information and services, regardless of ability.
              </Translated>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-navy-800 mb-4">
              <Translated>Accessibility Features</Translated>
            </h2>
            <p className="text-gray-700 mb-4">
              <Translated>
                Our website includes several accessibility features that you can customize using the
                accessibility toolbar located in the bottom-right corner of every page:
              </Translated>
            </p>

            <div className="grid gap-4 md:grid-cols-2 mb-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-navy-800 mb-2">
                  <Translated>Text Size Adjustment</Translated>
                </h3>
                <p className="text-sm text-gray-600">
                  <Translated>
                    Increase or decrease the font size across the entire website to improve readability
                    according to your preferences.
                  </Translated>
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-navy-800 mb-2">
                  <Translated>High Contrast Mode</Translated>
                </h3>
                <p className="text-sm text-gray-600">
                  <Translated>
                    Enable high contrast mode for improved visibility with enhanced color contrast
                    between text and backgrounds.
                  </Translated>
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-navy-800 mb-2">
                  <Translated>Dyslexia-Friendly Font</Translated>
                </h3>
                <p className="text-sm text-gray-600">
                  <Translated>
                    Switch to OpenDyslexic, a typeface designed to increase readability for
                    readers with dyslexia.
                  </Translated>
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-navy-800 mb-2">
                  <Translated>Reduce Motion</Translated>
                </h3>
                <p className="text-sm text-gray-600">
                  <Translated>
                    Minimize animations and transitions for users who are sensitive to motion
                    or prefer a calmer browsing experience.
                  </Translated>
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-navy-800 mb-4">
              <Translated>Additional Accessibility Features</Translated>
            </h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                <Translated>Keyboard navigation support throughout the website</Translated>
              </li>
              <li>
                <Translated>Descriptive alt text for images</Translated>
              </li>
              <li>
                <Translated>Consistent and predictable navigation structure</Translated>
              </li>
              <li>
                <Translated>Clear heading hierarchy for screen reader users</Translated>
              </li>
              <li>
                <Translated>Focus indicators for keyboard navigation</Translated>
              </li>
              <li>
                <Translated>Multi-language support with translation capabilities</Translated>
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-navy-800 mb-4">
              <Translated>Browser and Assistive Technology Compatibility</Translated>
            </h2>
            <p className="text-gray-700 mb-4">
              <Translated>
                This website is designed to be compatible with the following:
              </Translated>
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                <Translated>Modern web browsers (Chrome, Firefox, Safari, Edge)</Translated>
              </li>
              <li>
                <Translated>Screen readers (NVDA, JAWS, VoiceOver)</Translated>
              </li>
              <li>
                <Translated>Voice recognition software</Translated>
              </li>
              <li>
                <Translated>Screen magnification tools</Translated>
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-navy-800 mb-4">
              <Translated>Feedback and Contact Information</Translated>
            </h2>
            <p className="text-gray-700 mb-4">
              <Translated>
                We are continuously working to improve the accessibility of our website. If you experience
                any difficulty accessing any part of this website, or if you have suggestions for improving
                accessibility, please contact us:
              </Translated>
            </p>

            <div className="bg-navy-50 p-6 rounded-lg border border-navy-200">
              <p className="text-gray-700 mb-2">
                <strong><Translated>City of Solvang</Translated></strong>
              </p>
              <p className="text-gray-700 mb-1">
                <Translated>1644 Oak Street</Translated>
              </p>
              <p className="text-gray-700 mb-3">
                <Translated>Solvang, CA 93463</Translated>
              </p>
              <p className="text-gray-700 mb-1">
                <strong><Translated>Phone:</Translated></strong> (805) 688-5575
              </p>
              <p className="text-gray-700 mb-1">
                <strong><Translated>Email:</Translated></strong>{' '}
                <a href="mailto:accessibility@cityofsolvang.com" className="text-navy-600 hover:text-navy-800 underline">
                  accessibility@cityofsolvang.com
                </a>
              </p>
            </div>

            <p className="text-gray-700 mt-4">
              <Translated>
                When reporting an accessibility issue, please include:
              </Translated>
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
              <li>
                <Translated>The web page URL where you encountered the issue</Translated>
              </li>
              <li>
                <Translated>A description of the problem</Translated>
              </li>
              <li>
                <Translated>The assistive technology you were using (if applicable)</Translated>
              </li>
              <li>
                <Translated>Your contact information so we can follow up</Translated>
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-navy-800 mb-4">
              <Translated>Ongoing Efforts</Translated>
            </h2>
            <p className="text-gray-700">
              <Translated>
                The City of Solvang is committed to ongoing accessibility improvements. We regularly
                review our website, train our staff on accessibility best practices, and incorporate
                user feedback to enhance the experience for all visitors.
              </Translated>
            </p>
          </section>

          <section className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-500">
              <Translated>Last updated: January 2025</Translated>
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}

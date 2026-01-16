import Link from 'next/link'
import { getDepartments } from '@/lib/contentful'
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer'
import Translated from '@/components/Translated'
import Breadcrumb from '@/components/Breadcrumb'

export const revalidate = 60 // Revalidate every 60 seconds

export default async function DepartmentsPage() {
  const departments = await getDepartments()

  return (
    <main className="py-12">
      <div className="container-narrow">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'City Departments' },
          ]}
        />
        <h1 className="text-3xl font-bold text-navy-800 mb-2"><Translated>City Departments</Translated></h1>
        <p className="text-gray-600 mb-8">
          <Translated>Find information about Solvang&apos;s city departments and services.</Translated>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {departments.map((dept: any) => {
            const fields = dept.fields
            const description = fields.description
              ? documentToPlainTextString(fields.description)
              : ''

            return (
              <Link
                key={dept.sys.id}
                href={`/departments/${fields.slug}`}
                className="card p-6 hover:shadow-lg transition-shadow group"
              >
                <h2 className="text-xl font-semibold text-navy-800 group-hover:text-navy-600 transition-colors mb-2">
                  <Translated>{fields.name}</Translated>
                </h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  <Translated>{description}</Translated>
                </p>
                <div className="text-sm text-gray-500 space-y-1">
                  {fields.phone && (
                    <p>
                      <span className="font-medium"><Translated>Phone</Translated>:</span> {fields.phone}
                    </p>
                  )}
                  {fields.email && (
                    <p>
                      <span className="font-medium"><Translated>Email</Translated>:</span> {fields.email}
                    </p>
                  )}
                </div>
                <span className="inline-flex items-center text-navy-600 text-sm font-medium mt-4 group-hover:gap-2 transition-all">
                  <Translated>Learn more</Translated>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}

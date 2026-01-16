import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getDepartmentBySlug, getDepartments } from '@/lib/contentful'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS } from '@contentful/rich-text-types'
import Translated from '@/components/Translated'

export const revalidate = 60

// Generate static params for all departments
export async function generateStaticParams() {
  const departments = await getDepartments()
  return departments.map((dept: any) => ({
    slug: dept.fields.slug,
  }))
}

// Rich text rendering options with translation support
const richTextOptions = {
  renderText: (text: string) => <Translated>{text}</Translated>,
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node: any, children: any) => (
      <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>
    ),
    [BLOCKS.HEADING_2]: (node: any, children: any) => (
      <h2 className="text-2xl font-bold text-navy-800 mt-8 mb-4">{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (node: any, children: any) => (
      <h3 className="text-xl font-semibold text-navy-800 mt-6 mb-3">{children}</h3>
    ),
    [BLOCKS.UL_LIST]: (node: any, children: any) => (
      <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (node: any, children: any) => (
      <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700">{children}</ol>
    ),
  },
}

export default async function DepartmentPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const department = await getDepartmentBySlug(slug)

  if (!department) {
    notFound()
  }

  const fields = department.fields as any

  return (
    <main className="py-12">
      <div className="container-narrow">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6">
          <ol className="flex items-center gap-2 text-gray-500">
            <li>
              <Link href="/" className="hover:text-navy-600"><Translated>Home</Translated></Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/departments" className="hover:text-navy-600"><Translated>Departments</Translated></Link>
            </li>
            <li>/</li>
            <li className="text-navy-800 font-medium"><Translated>{fields.name}</Translated></li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-navy-800 mb-4"><Translated>{fields.name}</Translated></h1>

            {fields.description && (
              <div className="text-lg text-gray-600 mb-6 pb-6 border-b">
                {documentToReactComponents(fields.description, richTextOptions)}
              </div>
            )}

            {fields.content && (
              <div className="prose prose-navy max-w-none">
                {documentToReactComponents(fields.content, richTextOptions)}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
              <h2 className="font-semibold text-navy-800 mb-4"><Translated>Contact Information</Translated></h2>

              <div className="space-y-4 text-sm">
                {fields.address && (
                  <div>
                    <div className="font-medium text-gray-700 mb-1"><Translated>Address</Translated></div>
                    <p className="text-gray-600"><Translated>{fields.address}</Translated></p>
                  </div>
                )}

                {fields.phone && (
                  <div>
                    <div className="font-medium text-gray-700 mb-1"><Translated>Phone</Translated></div>
                    <a
                      href={`tel:${fields.phone.replace(/\D/g, '')}`}
                      className="text-navy-600 hover:text-navy-800"
                    >
                      {fields.phone}
                    </a>
                  </div>
                )}

                {fields.email && (
                  <div>
                    <div className="font-medium text-gray-700 mb-1"><Translated>Email</Translated></div>
                    <a
                      href={`mailto:${fields.email}`}
                      className="text-navy-600 hover:text-navy-800 break-all"
                    >
                      {fields.email}
                    </a>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <div className="font-medium text-gray-700 mb-1"><Translated>Hours</Translated></div>
                  <p className="text-gray-600"><Translated>Monday - Friday</Translated></p>
                  <p className="text-gray-600">8:00 AM - 5:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

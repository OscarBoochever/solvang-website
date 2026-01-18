import React from 'react'
import { notFound } from 'next/navigation'
import { getDepartmentBySlug, getDepartments } from '@/lib/contentful'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types'
import Translated from '@/components/Translated'
import Breadcrumb from '@/components/Breadcrumb'

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
  renderMark: {
    [MARKS.BOLD]: (text: React.ReactNode) => <strong className="font-semibold">{text}</strong>,
    [MARKS.ITALIC]: (text: React.ReactNode) => <em>{text}</em>,
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node: any, children: any) => (
      <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>
    ),
    [BLOCKS.HEADING_2]: (node: any, children: any) => (
      <h2 className="text-2xl font-bold text-navy-800 mt-8 mb-4">{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (node: any, children: any) => (
      <h2 className="text-xl font-semibold text-navy-800 mt-6 mb-3">{children}</h2>
    ),
    [BLOCKS.HEADING_4]: (node: any, children: any) => (
      <h3 className="text-lg font-semibold text-navy-800 mt-4 mb-2">{children}</h3>
    ),
    [BLOCKS.UL_LIST]: (node: any, children: any) => (
      <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (node: any, children: any) => (
      <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700">{children}</ol>
    ),
    [INLINES.HYPERLINK]: (node: any, children: any) => (
      <a
        href={node.data.uri}
        className="text-navy-600 hover:text-navy-800 underline"
        target={node.data.uri.startsWith('http') ? '_blank' : undefined}
        rel={node.data.uri.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
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
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Departments', href: '/departments' },
            { label: fields.name },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-navy-800 mb-4"><Translated>{fields.name}</Translated></h1>

            {fields.description && (
              <div className="text-lg text-gray-600 mb-6 pb-6 border-b">
                {fields.description.data?.isHtml ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: fields.description.content?.[0]?.content?.[0]?.value || ''
                    }}
                    className="rich-text-content"
                  />
                ) : (
                  documentToReactComponents(fields.description, richTextOptions)
                )}
              </div>
            )}

            {fields.content && (
              <div className="prose prose-navy max-w-none">
                {fields.content.data?.isHtml ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: fields.content.content?.[0]?.content?.[0]?.value || ''
                    }}
                    className="rich-text-content"
                  />
                ) : (
                  documentToReactComponents(fields.content, richTextOptions)
                )}
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

                {/* RSS Feed */}
                <div className="pt-4 border-t">
                  <a
                    href={`/feed/departments/${slug}`}
                    className="inline-flex items-center gap-2 text-sm text-navy-600 hover:text-navy-800"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="6.18" cy="17.82" r="2.18"/>
                      <path d="M4 4.44v3c6.59.01 11.95 5.37 11.96 11.96h3C18.95 11.19 12.81 5.05 4 4.44z"/>
                      <path d="M4 10.1v3c3.29.01 5.96 2.68 5.97 5.97h3C12.96 13.84 9.16 10.11 4 10.1z"/>
                    </svg>
                    <Translated>Subscribe via RSS</Translated>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

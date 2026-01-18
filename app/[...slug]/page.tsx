import React from 'react'
import { notFound } from 'next/navigation'
import { getPageBySlug, getPages } from '@/lib/contentful'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types'
import Link from 'next/link'
import Translated from '@/components/Translated'
import Breadcrumb, { BreadcrumbItem } from '@/components/Breadcrumb'

export const revalidate = 60

// Generate static params for all pages
export async function generateStaticParams() {
  const pages = await getPages()
  return pages.map((page: any) => ({
    // Split slug by '/' to support nested paths like 'how-to/testing'
    slug: page.fields.slug.split('/'),
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
    [INLINES.HYPERLINK]: (node: any, children: any) => {
      const uri = node.data.uri
      const isInternal = uri.startsWith('/')
      if (isInternal) {
        return (
          <Link href={uri} className="text-navy-600 hover:text-navy-800 underline">
            {children}
          </Link>
        )
      }
      return (
        <a href={uri} className="text-navy-600 hover:text-navy-800 underline" target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      )
    },
  },
}

export default async function GenericPage({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  // Join the slug array to get the full path (e.g., ['how-to', 'testing'] -> 'how-to/testing')
  const fullSlug = slug.join('/')
  const page = await getPageBySlug(fullSlug)

  if (!page) {
    notFound()
  }

  const fields = page.fields as any

  // Build breadcrumb items from the slug path
  const breadcrumbItems: BreadcrumbItem[] = [{ label: 'Home', href: '/' }]

  // Add intermediate paths if nested
  if (slug.length > 1) {
    let path = ''
    for (let i = 0; i < slug.length - 1; i++) {
      path += '/' + slug[i]
      // Capitalize and format the segment for display
      const label = slug[i].split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
      breadcrumbItems.push({ label, href: path })
    }
  }

  // Add current page (no href for current page)
  breadcrumbItems.push({ label: fields.title })

  return (
    <main className="py-12">
      <div className="container-narrow">
        <Breadcrumb items={breadcrumbItems} />

        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold text-navy-800 mb-6"><Translated>{fields.title}</Translated></h1>

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
      </div>
    </main>
  )
}

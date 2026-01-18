import React from 'react'
import { notFound } from 'next/navigation'
import { getNewsBySlug, getNews } from '@/lib/contentful'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types'
import Translated from '@/components/Translated'
import Breadcrumb from '@/components/Breadcrumb'
import Image from 'next/image'
import Link from 'next/link'

export const revalidate = 60

// Generate static params for all news articles
export async function generateStaticParams() {
  const news = await getNews()
  return news.map((article: any) => ({
    slug: article.fields.slug,
  }))
}

// Rich text rendering options
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
      <h3 className="text-xl font-semibold text-navy-800 mt-6 mb-3">{children}</h3>
    ),
    [BLOCKS.HEADING_4]: (node: any, children: any) => (
      <h4 className="text-lg font-semibold text-navy-800 mt-4 mb-2">{children}</h4>
    ),
    [BLOCKS.UL_LIST]: (node: any, children: any) => (
      <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700 ml-4">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (node: any, children: any) => (
      <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700 ml-4">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (node: any, children: any) => (
      <li>{children}</li>
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

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = await getNewsBySlug(slug)

  if (!article) {
    notFound()
  }

  const fields = article.fields as any
  const publishDate = fields.publishDate ? new Date(fields.publishDate) : null

  return (
    <main className="py-12">
      <div className="container-narrow">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'News', href: '/news' },
            { label: fields.title },
          ]}
        />

        <article className="max-w-3xl">
          {/* Header */}
          <header className="mb-8">
            {fields.category && (
              <span className="inline-block px-3 py-1 text-sm font-medium text-navy-700 bg-navy-100 rounded-full mb-4">
                <Translated>{fields.category}</Translated>
              </span>
            )}

            <h1 className="text-3xl md:text-4xl font-bold text-navy-800 mb-4">
              <Translated>{fields.title}</Translated>
            </h1>

            {publishDate && (
              <time className="text-gray-500" dateTime={fields.publishDate}>
                {publishDate.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            )}
          </header>

          {/* Featured Image */}
          {fields.image && (
            <div className="relative w-full h-64 md:h-96 mb-8 rounded-xl overflow-hidden">
              <Image
                src={`https:${fields.image.fields.file.url}`}
                alt={fields.image.fields.title || fields.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Excerpt */}
          {fields.excerpt && (
            <p className="text-xl text-gray-600 mb-8 pb-8 border-b">
              <Translated>{fields.excerpt}</Translated>
            </p>
          )}

          {/* Content */}
          {fields.content && (
            <div className="prose prose-navy max-w-none">
              {fields.content.data?.isHtml ? (
                // Render HTML content directly
                <div
                  dangerouslySetInnerHTML={{
                    __html: fields.content.content?.[0]?.content?.[0]?.value || ''
                  }}
                  className="rich-text-content"
                />
              ) : (
                // Render Contentful rich text
                documentToReactComponents(fields.content, richTextOptions)
              )}
            </div>
          )}

          {/* Back to News */}
          <div className="mt-12 pt-8 border-t">
            <Link
              href="/news"
              className="inline-flex items-center text-navy-600 hover:text-navy-800 font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <Translated>Back to News</Translated>
            </Link>
          </div>
        </article>
      </div>
    </main>
  )
}

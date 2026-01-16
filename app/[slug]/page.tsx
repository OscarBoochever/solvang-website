import { notFound } from 'next/navigation'
import { getPageBySlug, getPages } from '@/lib/contentful'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS } from '@contentful/rich-text-types'
import Translated from '@/components/Translated'
import Breadcrumb from '@/components/Breadcrumb'

export const revalidate = 60

// Generate static params for all pages
export async function generateStaticParams() {
  const pages = await getPages()
  return pages.map((page: any) => ({
    slug: page.fields.slug,
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
  },
}

export default async function GenericPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = await getPageBySlug(slug)

  if (!page) {
    notFound()
  }

  const fields = page.fields as any

  return (
    <main className="py-12">
      <div className="container-narrow">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: fields.title },
          ]}
        />

        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold text-navy-800 mb-6"><Translated>{fields.title}</Translated></h1>

          {fields.content && (
            <div className="prose prose-navy max-w-none">
              {documentToReactComponents(fields.content, richTextOptions)}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

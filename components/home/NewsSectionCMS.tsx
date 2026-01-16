import Link from 'next/link'
import Image from 'next/image'
import { getNews } from '@/lib/contentful'
import Translated from '@/components/Translated'

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function getCategoryColor(category: string) {
  switch (category) {
    case 'Announcement':
      return 'bg-gold-100 text-gold-700'
    case 'Update':
      return 'bg-navy-100 text-navy-700'
    case 'Event':
      return 'bg-emerald-100 text-emerald-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

// Logo placeholder component for news without images
function LogoPlaceholder() {
  return (
    <div className="h-40 bg-white flex items-center justify-center">
      <div className="w-16 h-16 bg-navy-100 rounded-full flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 text-navy-600" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 4l5 5M15 15l5 5M20 4l-5 5M9 15l-5 5" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </div>
    </div>
  )
}

function getImageUrl(item: any): string | null {
  // Use uploaded image if available
  const image = item.fields?.image
  if (image?.fields?.file?.url) {
    return `https:${image.fields.file.url}`
  }
  return null
}

export default async function NewsSectionCMS() {
  const news = await getNews(3)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-navy-800">
          <Translated>Latest News</Translated>
        </h2>
        <Link
          href="/news"
          className="text-navy-600 hover:text-navy-800 font-medium text-sm flex items-center gap-1 transition-colors"
        >
          <Translated>View All</Translated>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {news.map((item: any) => {
          const fields = item.fields
          const imageUrl = getImageUrl(item)

          return (
            <article key={item.sys.id} className="card group overflow-hidden">
              {imageUrl ? (
                <div className="h-40 relative">
                  <Image
                    src={imageUrl}
                    alt={fields.title || 'News image'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <LogoPlaceholder />
              )}

              <div className="p-4">
                {fields.category && (
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getCategoryColor(fields.category)} mb-2`}>
                    <Translated>{fields.category}</Translated>
                  </span>
                )}

                <h3 className="font-semibold text-navy-800 group-hover:text-navy-600 transition-colors mb-2 line-clamp-2">
                  <Link href={`/news/${fields.slug}`}>
                    <Translated>{fields.title}</Translated>
                  </Link>
                </h3>

                {fields.excerpt && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    <Translated>{fields.excerpt}</Translated>
                  </p>
                )}

                {fields.publishDate && (
                  <time className="text-xs text-gray-500" dateTime={fields.publishDate}>
                    {formatDate(fields.publishDate)}
                  </time>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

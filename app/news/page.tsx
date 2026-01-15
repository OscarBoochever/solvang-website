import Link from 'next/link'
import Image from 'next/image'
import { getNews } from '@/lib/contentful'

export const revalidate = 60

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

// Unique images for each news item by slug
const newsImages: Record<string, string> = {
  'christmas-decoration-winners-2025': 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=800&q=80',
  'nyborg-estates-water-project-update': 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80',
  'winter-spring-recreation-2026': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
  'human-services-grants-2026': 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80',
  'tmac-applications-2026': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
  'polar-bear-plunge-2026': 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&q=80',
  'water-conservation-reminder': 'https://images.unsplash.com/photo-1468421870903-4df1664ac249?w=800&q=80',
  'grant-funding-extended': 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80',
}

const fallbackImages = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
  'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=800&q=80',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
]

function getNewsImage(slug: string, index: number = 0): string {
  return newsImages[slug] || fallbackImages[index % fallbackImages.length]
}

export default async function NewsPage() {
  const news = await getNews()

  return (
    <main className="py-12">
      <div className="container-narrow">
        <h1 className="text-3xl font-bold text-navy-800 mb-2">News & Announcements</h1>
        <p className="text-gray-600 mb-8">
          Stay informed about what&apos;s happening in Solvang.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item: any, index: number) => {
            const fields = item.fields

            return (
              <article key={item.sys.id} className="card group overflow-hidden">
                <div className="h-40 relative">
                  <Image
                    src={getNewsImage(fields.slug || '', index)}
                    alt={fields.title || 'News image'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-4">
                  {fields.category && (
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getCategoryColor(fields.category)} mb-2`}>
                      {fields.category}
                    </span>
                  )}

                  <h2 className="font-semibold text-navy-800 group-hover:text-navy-600 transition-colors mb-2 line-clamp-2">
                    <Link href={`/news/${fields.slug}`}>
                      {fields.title}
                    </Link>
                  </h2>

                  {fields.excerpt && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {fields.excerpt}
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
    </main>
  )
}

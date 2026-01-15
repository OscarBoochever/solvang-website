import Link from 'next/link'
import Image from 'next/image'
import { getNews } from '@/lib/contentful'

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
  'christmas-decoration-winners-2025': 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=800&q=80', // Christmas decorations
  'nyborg-estates-water-project-update': 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80', // Construction/pipes
  'winter-spring-recreation-2026': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80', // Fitness/recreation
  'human-services-grants-2026': 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80', // Helping hands
  'tmac-applications-2026': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80', // Committee meeting
  'polar-bear-plunge-2026': 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&q=80', // Swimming/lake
  'water-conservation-reminder': 'https://images.unsplash.com/photo-1468421870903-4df1664ac249?w=800&q=80', // Water droplet
  'grant-funding-extended': 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80', // Documents/paperwork
}

// Fallback images for items not in the map
const fallbackImages = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
  'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=800&q=80',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
]

function getNewsImage(slug: string, index: number = 0): string {
  return newsImages[slug] || fallbackImages[index % fallbackImages.length]
}

export default async function NewsSectionCMS() {
  const news = await getNews(3)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-navy-800">Latest News</h2>
        <Link
          href="/news"
          className="text-navy-600 hover:text-navy-800 font-medium text-sm flex items-center gap-1 transition-colors"
        >
          View All
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

                <h3 className="font-semibold text-navy-800 group-hover:text-navy-600 transition-colors mb-2 line-clamp-2">
                  <Link href={`/news/${fields.slug}`}>
                    {fields.title}
                  </Link>
                </h3>

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
  )
}

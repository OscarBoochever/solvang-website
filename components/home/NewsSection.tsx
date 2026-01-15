'use client'

import Link from 'next/link'
import Translated from '@/components/Translated'

// Sample news data - in production this would come from Strapi
const newsItems = [
  {
    id: 1,
    title: 'Human Services Grant Funding Application Period Extended',
    excerpt: 'The City of Solvang has extended the application deadline for community human services grants. Non-profit organizations serving Solvang residents are encouraged to apply.',
    date: '2026-01-10',
    category: 'Announcement',
    image: null,
    slug: 'grant-funding-extended',
  },
  {
    id: 2,
    title: 'Water Conservation Reminder During Storm Season',
    excerpt: 'With the recent rainfall, this is a great opportunity to pause or shut off irrigation systems. Conserving water helps our community and reduces runoff.',
    date: '2026-01-08',
    category: 'Update',
    image: null,
    slug: 'water-conservation-reminder',
  },
  {
    id: 3,
    title: 'Annual Polar Bear Plunge Returns February 1st',
    excerpt: 'Join us for the 4th Annual Polar Bear Plunge at Lake Santa Ynez! Take a quick dip in the refreshing water and support local charities.',
    date: '2026-01-05',
    category: 'Event',
    image: null,
    slug: 'polar-bear-plunge-2026',
  },
]

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

export default function NewsSection() {
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
        {newsItems.map((item) => (
          <article key={item.id} className="card group">
            {/* Image placeholder */}
            <div className="h-40 bg-gradient-to-br from-navy-100 to-navy-200 flex items-center justify-center">
              <svg className="w-12 h-12 text-navy-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>

            <div className="p-4">
              {/* Category badge */}
              <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getCategoryColor(item.category)} mb-2`}>
                <Translated>{item.category}</Translated>
              </span>

              {/* Title */}
              <h3 className="font-semibold text-navy-800 group-hover:text-navy-600 transition-colors mb-2 line-clamp-2">
                <Link href={`/news/${item.slug}`}>
                  <Translated>{item.title}</Translated>
                </Link>
              </h3>

              {/* Excerpt */}
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                <Translated>{item.excerpt}</Translated>
              </p>

              {/* Date */}
              <time className="text-xs text-gray-500" dateTime={item.date}>
                {formatDate(item.date)}
              </time>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

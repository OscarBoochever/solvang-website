import Link from 'next/link'
import Translated from '@/components/Translated'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  // Build JSON-LD structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href ? `https://solvang-website.vercel.app${item.href}` : undefined,
    })),
  }

  return (
    <>
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Visible breadcrumb navigation */}
      <nav aria-label="Breadcrumb" className="text-sm mb-6">
        <ol className="flex items-center gap-2 text-gray-500">
          {items.map((item, index) => {
            const isLast = index === items.length - 1

            return (
              <li key={index} className="flex items-center gap-2">
                {index > 0 && (
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}

                {isLast ? (
                  <span
                    className="text-navy-800 font-medium"
                    aria-current="page"
                  >
                    <Translated>{item.label}</Translated>
                  </span>
                ) : (
                  <Link
                    href={item.href || '/'}
                    className="hover:text-navy-600 transition-colors"
                  >
                    <Translated>{item.label}</Translated>
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}

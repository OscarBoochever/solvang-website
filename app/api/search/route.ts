import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'contentful'

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
})

// Static pages and forms that aren't in Contentful
const staticContent = [
  {
    id: 'form-public-records',
    type: 'form',
    title: 'Public Records Request',
    keywords: ['public records', 'records request', 'cpra', 'california public records act', 'documents', 'foia'],
    description: 'Request city documents under the California Public Records Act',
    url: '/public-records',
  },
  {
    id: 'form-report-concern',
    type: 'form',
    title: 'Report a Concern',
    keywords: ['report', 'concern', 'pothole', 'streetlight', 'graffiti', 'water leak', 'code violation', 'complaint', 'issue', 'problem'],
    description: 'Report potholes, streetlights, water leaks, graffiti, and other issues',
    url: '/report-concern',
  },
  {
    id: 'form-contact',
    type: 'form',
    title: 'Contact Us',
    keywords: ['contact', 'email', 'message', 'question', 'inquiry', 'reach', 'help'],
    description: 'Send a message to city staff',
    url: '/contact',
  },
  {
    id: 'form-business-certificate',
    type: 'form',
    title: 'Business Certificate Application',
    keywords: ['business certificate', 'business license', 'start business', 'new business', 'license application', 'permit'],
    description: 'Apply for a business certificate to operate in Solvang',
    url: '/business/business-certificate',
  },
  {
    id: 'form-subscribe',
    type: 'form',
    title: 'Subscribe to City Updates',
    keywords: ['subscribe', 'newsletter', 'alerts', 'notifications', 'email updates', 'news', 'signup', 'sign up'],
    description: 'Subscribe to city news, alerts, and updates',
    url: '/subscribe',
  },
  {
    id: 'page-events-calendar',
    type: 'page',
    title: 'Events Calendar',
    keywords: ['events', 'calendar', 'meetings', 'schedule', 'upcoming', 'city council meeting', 'planning commission'],
    description: 'View upcoming city meetings and community events',
    url: '/events',
  },
  {
    id: 'page-departments',
    type: 'page',
    title: 'City Departments',
    keywords: ['departments', 'city hall', 'public works', 'utilities', 'planning', 'parks', 'recreation'],
    description: 'Browse all city departments and services',
    url: '/departments',
  },
  {
    id: 'page-news',
    type: 'page',
    title: 'News & Announcements',
    keywords: ['news', 'announcements', 'press', 'releases', 'updates', 'city news'],
    description: 'Latest news and announcements from the City of Solvang',
    url: '/news',
  },
  {
    id: 'service-utility-payment',
    type: 'service',
    title: 'Pay Utility Bill',
    keywords: ['pay bill', 'utility', 'water bill', 'sewer bill', 'payment', 'bills'],
    description: 'Pay your water and sewer bills',
    url: '/how-to#pay-a-bill',
  },
  {
    id: 'service-agendas',
    type: 'service',
    title: 'Meeting Agendas & Minutes',
    keywords: ['agendas', 'minutes', 'city council', 'meeting', 'video', 'recordings', 'youtube'],
    description: 'View City Council meeting agendas, minutes, and video recordings',
    url: '/city-council#agendas--minutes',
  },
  {
    id: 'service-voting-district',
    type: 'service',
    title: 'Find My Voting District',
    keywords: ['voting', 'district', 'election', 'vote', 'council district', 'representative'],
    description: 'Look up your City Council voting district',
    url: 'https://districtsolvang.org',
  },
  {
    id: 'service-emergency-alerts',
    type: 'service',
    title: 'Emergency Alerts',
    keywords: ['emergency', 'alerts', 'readysbc', 'notifications', 'disaster', 'warning'],
    description: 'Sign up for emergency notifications',
    url: 'https://www.readysbc.org',
  },
]

function searchStaticContent(query: string) {
  const lowerQuery = query.toLowerCase()
  const queryWords = lowerQuery.split(/\s+/)

  return staticContent.filter(item => {
    // Check title
    if (item.title.toLowerCase().includes(lowerQuery)) return true

    // Check keywords
    for (const keyword of item.keywords) {
      if (keyword.includes(lowerQuery)) return true
      // Check if all query words appear in the keyword
      if (queryWords.every(word => keyword.includes(word))) return true
    }

    // Check description
    if (item.description.toLowerCase().includes(lowerQuery)) return true

    // Check if all query words appear somewhere
    const allText = `${item.title} ${item.keywords.join(' ')} ${item.description}`.toLowerCase()
    if (queryWords.every(word => allText.includes(word))) return true

    return false
  }).map(item => ({
    id: item.id,
    type: item.type,
    title: item.title,
    description: item.description,
    url: item.url,
  }))
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ results: [] })
  }

  try {
    // Search static content first (forms, services)
    const staticResults = searchStaticContent(query)

    // Search across all content types using Contentful's full-text search
    const [departments, pages, news, events] = await Promise.all([
      client.getEntries({
        content_type: 'department',
        query: query,
        limit: 5,
      }),
      client.getEntries({
        content_type: 'page',
        query: query,
        limit: 5,
      }),
      client.getEntries({
        content_type: 'news',
        query: query,
        limit: 5,
      }),
      client.getEntries({
        content_type: 'event',
        query: query,
        limit: 5,
      }),
    ])

    const contentfulResults = [
      ...departments.items.map((item: any) => ({
        id: item.sys.id,
        type: 'department',
        title: item.fields.name,
        description: item.fields.description || '',
        url: `/departments/${item.fields.slug}`,
      })),
      ...pages.items.map((item: any) => ({
        id: item.sys.id,
        type: 'page',
        title: item.fields.title,
        description: item.fields.metaDescription || '',
        url: `/${item.fields.slug}`,
      })),
      ...news.items.map((item: any) => ({
        id: item.sys.id,
        type: 'news',
        title: item.fields.title,
        description: item.fields.excerpt || '',
        url: `/news/${item.fields.slug}`,
      })),
      ...events.items.map((item: any) => ({
        id: item.sys.id,
        type: 'event',
        title: item.fields.title,
        description: `${item.fields.date}${item.fields.location ? ` at ${item.fields.location}` : ''}`,
        url: '/events',
      })),
    ]

    // Combine results: static first (forms are more actionable), then Contentful
    // Remove duplicates by URL
    const seenUrls = new Set<string>()
    const results = [...staticResults, ...contentfulResults].filter(item => {
      if (seenUrls.has(item.url)) return false
      seenUrls.add(item.url)
      return true
    })

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ results: [], error: 'Search failed' }, { status: 500 })
  }
}

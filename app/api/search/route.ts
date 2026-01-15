import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'contentful'

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
})

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ results: [] })
  }

  try {
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

    const results = [
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

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ results: [], error: 'Search failed' }, { status: 500 })
  }
}

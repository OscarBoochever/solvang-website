import { getNews, getEvents, getDepartments } from '@/lib/contentful'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.cityofsolvang.gov'

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  // Fetch all content types
  const [news, events, departments] = await Promise.all([
    getNews(20),
    getEvents(),
    getDepartments(),
  ])

  // Build items from all content types with category tags
  const allItems: { date: Date; xml: string }[] = []

  // News items
  news.forEach((item: any) => {
    const pubDate = new Date(item.fields.publishDate || item.sys.createdAt)
    allItems.push({
      date: pubDate,
      xml: `
    <item>
      <title>${escapeXml(item.fields.title)}</title>
      <link>${SITE_URL}/news/${item.fields.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/news/${item.fields.slug}</guid>
      <pubDate>${pubDate.toUTCString()}</pubDate>
      <category>News</category>
      <description>${escapeXml(item.fields.excerpt || '')}</description>
    </item>`,
    })
  })

  // Event items
  events.slice(0, 20).forEach((item: any) => {
    const pubDate = new Date(item.fields.date || item.sys.createdAt)
    const description = item.fields.location
      ? `${item.fields.date} at ${item.fields.location}`
      : item.fields.date
    allItems.push({
      date: pubDate,
      xml: `
    <item>
      <title>${escapeXml(item.fields.title)}</title>
      <link>${SITE_URL}/events</link>
      <guid isPermaLink="false">${item.sys.id}</guid>
      <pubDate>${pubDate.toUTCString()}</pubDate>
      <category>Events</category>
      <description>${escapeXml(description || '')}</description>
    </item>`,
    })
  })

  // Department items (when updated)
  departments.forEach((item: any) => {
    const pubDate = new Date(item.sys.updatedAt)
    const description = item.fields.description?.content?.[0]?.content?.[0]?.value ||
      `Information from the ${item.fields.name} department.`
    allItems.push({
      date: pubDate,
      xml: `
    <item>
      <title>${escapeXml(item.fields.name)} Department Update</title>
      <link>${SITE_URL}/departments/${item.fields.slug}</link>
      <guid isPermaLink="false">dept-${item.sys.id}-${item.sys.updatedAt}</guid>
      <pubDate>${pubDate.toUTCString()}</pubDate>
      <category>Departments</category>
      <description>${escapeXml(description)}</description>
    </item>`,
    })
  })

  // Sort all items by date (newest first) and take top 50
  const sortedItems = allItems
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 50)
    .map((item) => item.xml)
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>City of Solvang - All Updates</title>
    <link>${SITE_URL}</link>
    <description>All updates from the City of Solvang - news, events, and department information</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${sortedItems}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}

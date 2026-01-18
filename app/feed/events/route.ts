import { getEvents } from '@/lib/contentful'

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
  const allEvents = await getEvents()
  const events = allEvents.slice(0, 20)

  const items = events
    .map((item: any) => {
      const pubDate = new Date(item.fields.date || item.sys.createdAt).toUTCString()
      const description = item.fields.location
        ? `${item.fields.date} at ${item.fields.location}`
        : item.fields.date
      return `
    <item>
      <title>${escapeXml(item.fields.title)}</title>
      <link>${SITE_URL}/events</link>
      <guid isPermaLink="false">${item.sys.id}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(description || '')}</description>
    </item>`
    })
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>City of Solvang - Events &amp; Meetings</title>
    <link>${SITE_URL}/events</link>
    <description>Upcoming events and meetings from the City of Solvang</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed/events" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}

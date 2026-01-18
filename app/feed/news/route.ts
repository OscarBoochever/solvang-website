import { getNews } from '@/lib/contentful'

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
  const news = await getNews(20)

  const items = news
    .map((item: any) => {
      const pubDate = new Date(item.fields.publishDate || item.sys.createdAt).toUTCString()
      return `
    <item>
      <title>${escapeXml(item.fields.title)}</title>
      <link>${SITE_URL}/news/${item.fields.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/news/${item.fields.slug}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(item.fields.excerpt || '')}</description>
    </item>`
    })
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>City of Solvang - News</title>
    <link>${SITE_URL}/news</link>
    <description>News and press releases from the City of Solvang</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed/news" rel="self" type="application/rss+xml"/>
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

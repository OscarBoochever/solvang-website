import { createClient } from 'contentful'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.cityofsolvang.gov'

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
})

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  // Get department info
  const departmentResponse = await client.getEntries({
    content_type: 'department',
    'fields.slug': slug,
    limit: 1,
  })

  if (departmentResponse.items.length === 0) {
    return new Response('Department not found', { status: 404 })
  }

  const department = departmentResponse.items[0] as any
  const departmentName = department.fields.name

  // Get news items that might be related to this department
  // In a real implementation, news would have a department field
  const newsResponse = await client.getEntries({
    content_type: 'news',
    limit: 20,
    order: ['-sys.createdAt'],
  })

  const items = newsResponse.items
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
    <title>City of Solvang - ${escapeXml(departmentName)}</title>
    <link>${SITE_URL}/departments/${slug}</link>
    <description>Updates from the ${escapeXml(departmentName)} department of the City of Solvang</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed/departments/${slug}" rel="self" type="application/rss+xml"/>
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

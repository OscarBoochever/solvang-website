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
  const departmentUpdated = new Date(department.sys.updatedAt).toUTCString()

  // Department feed contains the department's own information
  // This provides a feed item when the department page is updated
  const description = department.fields.description?.content?.[0]?.content?.[0]?.value ||
    `Information and services from the ${departmentName} department.`

  const items = `
    <item>
      <title>${escapeXml(departmentName)} - Department Information</title>
      <link>${SITE_URL}/departments/${slug}</link>
      <guid isPermaLink="true">${SITE_URL}/departments/${slug}</guid>
      <pubDate>${departmentUpdated}</pubDate>
      <description>${escapeXml(description)}</description>
    </item>`

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

import * as contentful from 'contentful-management'
import * as fs from 'fs'
import * as path from 'path'

const envPath = path.join(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf-8')
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=')
  if (key && valueParts.length) {
    process.env[key.trim()] = valueParts.join('=').trim()
  }
})

const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN!,
})

async function main() {
  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID!)
  const environment = await space.getEnvironment('master')

  console.log('Fetching all news items...')
  const allNews = await environment.getEntries({ content_type: 'news', limit: 100 })

  console.log(`Found ${allNews.items.length} news items total`)

  // Group by slug to find duplicates
  const bySlug: Record<string, any[]> = {}
  for (const item of allNews.items) {
    const slug = item.fields.slug?.['en-US'] || item.fields.slug
    if (!bySlug[slug]) bySlug[slug] = []
    bySlug[slug].push(item)
  }

  // Delete duplicates (keep the first one of each)
  let deleted = 0
  for (const [slug, items] of Object.entries(bySlug)) {
    if (items.length > 1) {
      console.log(`  Found ${items.length} items with slug "${slug}" - deleting ${items.length - 1} duplicates`)
      for (let i = 1; i < items.length; i++) {
        try {
          if (items[i].isPublished()) {
            await items[i].unpublish()
          }
          await items[i].delete()
          deleted++
        } catch (err: any) {
          console.error(`    Error deleting duplicate: ${err.message}`)
        }
      }
    }
  }

  console.log(`\nDeleted ${deleted} duplicate news items`)
  console.log(`Remaining unique news items: ${Object.keys(bySlug).length}`)

  // List remaining items
  console.log('\nRemaining news items:')
  for (const slug of Object.keys(bySlug)) {
    const item = bySlug[slug][0]
    const title = item.fields.title?.['en-US'] || item.fields.title
    console.log(`  - ${title} (${slug})`)
  }
}

main().catch(console.error)

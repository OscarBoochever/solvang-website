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

  const entries = await environment.getEntries({
    content_type: 'department',
    'fields.slug': 'city-hall',
  })

  if (entries.items.length > 0) {
    const entry = entries.items[0]
    if (entry.isPublished()) {
      await entry.unpublish()
    }
    await entry.delete()
    console.log('Deleted City Hall department')
  } else {
    console.log('City Hall department not found')
  }
}

main().catch(console.error)

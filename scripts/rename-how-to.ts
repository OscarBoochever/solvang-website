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

  console.log('Updating "How Do I..." page to "How To"...')

  const entries = await environment.getEntries({
    content_type: 'page',
    'fields.slug': 'how-do-i',
  })

  if (entries.items.length > 0) {
    let entry = entries.items[0]
    entry.fields.title = { 'en-US': 'How To' }
    entry.fields.slug = { 'en-US': 'how-to' }
    entry = await entry.update()
    await entry.publish()
    console.log('  Updated: slug changed to "how-to", title changed to "How To"')
  } else {
    console.log('  Page not found with slug "how-do-i"')
  }

  console.log('\nDone!')
}

main().catch(console.error)

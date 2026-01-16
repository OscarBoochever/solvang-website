// Script to add image field to news content type
// Run with: npx tsx scripts/add-image-field.ts

import * as contentful from 'contentful-management'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function addImageField() {
  const client = contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN!,
  })

  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID!)
  const environment = await space.getEnvironment('master')

  try {
    console.log('Processing content type: news')

    let contentType = await environment.getContentType('news')

    // Check if image field exists
    const hasImage = contentType.fields.some(f => f.id === 'image')
    if (!hasImage) {
      console.log('  Adding "image" field...')
      contentType.fields.push({
        id: 'image',
        name: 'Featured Image',
        type: 'Link',
        linkType: 'Asset',
        required: false,
        localized: false,
        validations: [
          {
            linkMimetypeGroup: ['image']
          }
        ],
      })

      // Update and publish the content type
      contentType = await contentType.update()
      await contentType.publish()
      console.log('  Content type news updated and published!')
    } else {
      console.log('  "image" field already exists')
    }

  } catch (error: any) {
    console.error('  Error:', error.message)
  }

  console.log('\nDone!')
}

addImageField().catch(console.error)

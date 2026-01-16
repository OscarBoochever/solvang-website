// Script to add status and scheduledPublish fields to Contentful content types
// Run with: npx ts-node scripts/add-scheduling-fields.ts

import * as contentful from 'contentful-management'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function addSchedulingFields() {
  const client = contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN!,
  })

  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID!)
  const environment = await space.getEnvironment('master')

  const contentTypes = ['news', 'event', 'page']

  for (const contentTypeId of contentTypes) {
    try {
      console.log(`\nProcessing content type: ${contentTypeId}`)

      let contentType = await environment.getContentType(contentTypeId)
      let needsUpdate = false

      // Check if status field exists
      const hasStatus = contentType.fields.some(f => f.id === 'status')
      if (!hasStatus) {
        console.log(`  Adding 'status' field...`)
        contentType.fields.push({
          id: 'status',
          name: 'Status',
          type: 'Symbol',
          required: false,
          localized: false,
          validations: [
            {
              in: ['draft', 'scheduled', 'published']
            }
          ],
        })
        needsUpdate = true
      } else {
        console.log(`  'status' field already exists`)
      }

      // Check if scheduledPublish field exists
      const hasScheduledPublish = contentType.fields.some(f => f.id === 'scheduledPublish')
      if (!hasScheduledPublish) {
        console.log(`  Adding 'scheduledPublish' field...`)
        contentType.fields.push({
          id: 'scheduledPublish',
          name: 'Scheduled Publish Date',
          type: 'Date',
          required: false,
          localized: false,
        })
        needsUpdate = true
      } else {
        console.log(`  'scheduledPublish' field already exists`)
      }

      if (needsUpdate) {
        // Update and publish the content type
        contentType = await contentType.update()
        await contentType.publish()
        console.log(`  Content type ${contentTypeId} updated and published!`)
      } else {
        console.log(`  No changes needed for ${contentTypeId}`)
      }

    } catch (error: any) {
      console.error(`  Error processing ${contentTypeId}:`, error.message)
    }
  }

  console.log('\nDone!')
}

addSchedulingFields().catch(console.error)

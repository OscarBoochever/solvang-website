import * as contentful from 'contentful-management'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function addFocalPointFields() {
  const client = contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN!,
  })

  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID!)
  const environment = await space.getEnvironment('master')

  console.log('Adding focal point fields to news content type...')

  try {
    const contentType = await environment.getContentType('news')

    // Check if fields already exist
    const hasX = contentType.fields.some(f => f.id === 'focalPointX')
    const hasY = contentType.fields.some(f => f.id === 'focalPointY')

    if (hasX && hasY) {
      console.log('Focal point fields already exist!')
      return
    }

    // Add the new fields
    if (!hasX) {
      contentType.fields.push({
        id: 'focalPointX',
        name: 'Focal Point X',
        type: 'Integer',
        required: false,
        localized: false,
        validations: [
          {
            range: { min: 0, max: 100 },
          },
        ],
      })
    }

    if (!hasY) {
      contentType.fields.push({
        id: 'focalPointY',
        name: 'Focal Point Y',
        type: 'Integer',
        required: false,
        localized: false,
        validations: [
          {
            range: { min: 0, max: 100 },
          },
        ],
      })
    }

    const updatedContentType = await contentType.update()
    await updatedContentType.publish()

    console.log('Focal point fields added and published!')
  } catch (error) {
    console.error('Error:', error)
  }
}

addFocalPointFields()

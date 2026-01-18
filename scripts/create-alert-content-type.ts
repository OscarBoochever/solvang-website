import * as contentful from 'contentful-management'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function createAlertContentType() {
  const client = contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN!,
  })

  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID!)
  const environment = await space.getEnvironment('master')

  console.log('Creating alert content type...')

  const fields = [
    {
      id: 'title',
      name: 'Title',
      type: 'Symbol',
      required: true,
      localized: false,
    },
    {
      id: 'message',
      name: 'Message',
      type: 'Text',
      required: true,
      localized: false,
    },
    {
      id: 'severity',
      name: 'Severity',
      type: 'Symbol',
      required: true,
      localized: false,
      validations: [
        {
          in: ['info', 'warning', 'critical'],
        },
      ],
    },
    {
      id: 'link',
      name: 'Link URL',
      type: 'Symbol',
      required: false,
      localized: false,
    },
    {
      id: 'linkText',
      name: 'Link Text',
      type: 'Symbol',
      required: false,
      localized: false,
    },
    {
      id: 'dismissible',
      name: 'Dismissible',
      type: 'Boolean',
      required: true,
      localized: false,
    },
    {
      id: 'active',
      name: 'Active',
      type: 'Boolean',
      required: true,
      localized: false,
    },
    {
      id: 'startsAt',
      name: 'Starts At',
      type: 'Date',
      required: false,
      localized: false,
    },
    {
      id: 'expiresAt',
      name: 'Expires At',
      type: 'Date',
      required: false,
      localized: false,
    },
    {
      id: 'priority',
      name: 'Priority',
      type: 'Integer',
      required: false,
      localized: false,
    },
  ]

  try {
    // Check if content type already exists
    let contentType
    try {
      contentType = await environment.getContentType('alert')
      console.log('Alert content type already exists, updating...')
      contentType.name = 'Alert'
      contentType.description = 'Site-wide alerts and notifications'
      contentType.displayField = 'title'
      contentType.fields = fields as any
      contentType = await contentType.update()
    } catch (e: any) {
      if (e.name !== 'NotFound') throw e
      // Create new content type
      contentType = await environment.createContentTypeWithId('alert', {
        name: 'Alert',
        description: 'Site-wide alerts and notifications',
        displayField: 'title',
        fields: fields as any,
      })
    }

    await contentType.publish()
    console.log('Alert content type created/updated and published!')

    // Create the MLK Day alert as initial content
    console.log('Creating initial MLK Day alert...')
    const entry = await environment.createEntry('alert', {
      fields: {
        title: { 'en-US': 'City Hall Closure' },
        message: { 'en-US': 'City Hall will be closed Monday, January 20th for Martin Luther King Jr. Day.' },
        severity: { 'en-US': 'info' },
        dismissible: { 'en-US': true },
        active: { 'en-US': true },
        expiresAt: { 'en-US': '2026-01-21T00:00:00Z' },
        priority: { 'en-US': 10 },
      },
    })
    await entry.publish()
    console.log('MLK Day alert created!')

  } catch (error) {
    console.error('Error:', error)
  }
}

createAlertContentType()

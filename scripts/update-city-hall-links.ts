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

  if (entries.items.length === 0) {
    console.log('City Hall department not found')
    return
  }

  let entry = entries.items[0]

  entry.fields.content = {
    'en-US': {
      nodeType: 'document',
      data: {},
      content: [
        {
          nodeType: 'heading-3',
          data: {},
          content: [{ nodeType: 'text', value: 'City Leadership', marks: [], data: {} }],
        },
        {
          nodeType: 'paragraph',
          data: {},
          content: [
            { nodeType: 'text', value: 'City Manager', marks: [{ type: 'bold' }], data: {} },
            { nodeType: 'text', value: ' - Oversees daily municipal operations, implements City Council policies, and manages city staff and services.', marks: [], data: {} },
          ],
        },
        {
          nodeType: 'paragraph',
          data: {},
          content: [
            { nodeType: 'text', value: 'City Clerk', marks: [{ type: 'bold' }], data: {} },
            { nodeType: 'text', value: ' - Manages elections, official records, Council meeting agendas, and public records requests.', marks: [], data: {} },
          ],
        },
        {
          nodeType: 'paragraph',
          data: {},
          content: [
            { nodeType: 'text', value: 'Finance', marks: [{ type: 'bold' }], data: {} },
            { nodeType: 'text', value: ' - Handles city budgeting, accounting, utility billing, and financial reporting.', marks: [], data: {} },
          ],
        },
        {
          nodeType: 'heading-3',
          data: {},
          content: [{ nodeType: 'text', value: 'Services for Residents', marks: [], data: {} }],
        },
        {
          nodeType: 'paragraph',
          data: {},
          content: [
            { nodeType: 'text', value: 'Business Certificates', marks: [{ type: 'bold' }], data: {} },
            { nodeType: 'text', value: ' - Required for all businesses operating in Solvang. ', marks: [], data: {} },
            {
              nodeType: 'hyperlink',
              data: { uri: '/business/business-certificate' },
              content: [{ nodeType: 'text', value: 'Apply for a business certificate', marks: [], data: {} }],
            },
            { nodeType: 'text', value: ' or renew existing ones.', marks: [], data: {} },
          ],
        },
        {
          nodeType: 'paragraph',
          data: {},
          content: [
            { nodeType: 'text', value: 'Permits', marks: [{ type: 'bold' }], data: {} },
            { nodeType: 'text', value: ' - Submit applications and pick up approved permits for building, signage, encroachment, and special events.', marks: [], data: {} },
          ],
        },
        {
          nodeType: 'paragraph',
          data: {},
          content: [
            { nodeType: 'text', value: 'Public Records', marks: [{ type: 'bold' }], data: {} },
            { nodeType: 'text', value: ' - ', marks: [], data: {} },
            {
              nodeType: 'hyperlink',
              data: { uri: '/public-records' },
              content: [{ nodeType: 'text', value: 'Request city documents', marks: [], data: {} }],
            },
            { nodeType: 'text', value: ' under the California Public Records Act.', marks: [], data: {} },
          ],
        },
        {
          nodeType: 'paragraph',
          data: {},
          content: [
            { nodeType: 'text', value: 'Payments', marks: [{ type: 'bold' }], data: {} },
            { nodeType: 'text', value: ' - Pay utility bills, permit fees, and other city charges in person, by mail, or by phone.', marks: [], data: {} },
          ],
        },
        {
          nodeType: 'paragraph',
          data: {},
          content: [
            { nodeType: 'text', value: 'Notary Services', marks: [{ type: 'bold' }], data: {} },
            { nodeType: 'text', value: ' - Free notary services for Solvang residents during business hours.', marks: [], data: {} },
          ],
        },
        {
          nodeType: 'heading-3',
          data: {},
          content: [{ nodeType: 'text', value: 'Visit Us', marks: [], data: {} }],
        },
        {
          nodeType: 'paragraph',
          data: {},
          content: [
            { nodeType: 'text', value: '1644 Oak Street, Solvang, CA 93463', marks: [], data: {} },
          ],
        },
        {
          nodeType: 'paragraph',
          data: {},
          content: [
            { nodeType: 'text', value: 'Monday - Friday, 8:00 AM - 5:00 PM', marks: [], data: {} },
          ],
        },
        {
          nodeType: 'paragraph',
          data: {},
          content: [
            { nodeType: 'text', value: 'Free parking available in the lot behind the building and on surrounding streets.', marks: [], data: {} },
          ],
        },
      ],
    },
  }

  entry = await entry.update()
  await entry.publish()
  console.log('Updated City Hall with hyperlinks')
}

main().catch(console.error)

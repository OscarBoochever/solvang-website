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

  // Update the description
  entry.fields.description = {
    'en-US': {
      nodeType: 'document',
      data: {},
      content: [
        {
          nodeType: 'paragraph',
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'City Hall serves as the administrative hub of Solvang\'s municipal government. Our staff assists residents and businesses with permits, licenses, public records, and general city services.',
              marks: [],
              data: {},
            },
          ],
        },
      ],
    },
  }

  // Update the content
  entry.fields.content = {
    'en-US': {
      nodeType: 'document',
      data: {},
      content: [
        {
          nodeType: 'heading-3',
          data: {},
          content: [{ nodeType: 'text', value: 'City Clerk Services', marks: [], data: {} }],
        },
        {
          nodeType: 'paragraph',
          data: {},
          content: [
            { nodeType: 'text', value: 'Elections & Voting', marks: [{ type: 'bold' }], data: {} },
            { nodeType: 'text', value: ' - Voter registration, candidate filing, and election information. Find your voting district at ', marks: [], data: {} },
            {
              nodeType: 'hyperlink',
              data: { uri: 'https://districtsolvang.org' },
              content: [{ nodeType: 'text', value: 'districtsolvang.org', marks: [], data: {} }],
            },
            { nodeType: 'text', value: '.', marks: [], data: {} },
          ],
        },
        {
          nodeType: 'paragraph',
          data: {},
          content: [
            { nodeType: 'text', value: 'Official Records', marks: [{ type: 'bold' }], data: {} },
            { nodeType: 'text', value: ' - Municipal code, resolutions, ordinances, and historical city documents.', marks: [], data: {} },
          ],
        },
        {
          nodeType: 'paragraph',
          data: {},
          content: [
            { nodeType: 'text', value: 'Public Records Requests', marks: [{ type: 'bold' }], data: {} },
            { nodeType: 'text', value: ' - Submit requests under the California Public Records Act.', marks: [], data: {} },
          ],
        },
        {
          nodeType: 'paragraph',
          data: {},
          content: [
            { nodeType: 'text', value: 'Notary Services', marks: [{ type: 'bold' }], data: {} },
            { nodeType: 'text', value: ' - Free notary services available for Solvang residents during business hours.', marks: [], data: {} },
          ],
        },
        {
          nodeType: 'heading-3',
          data: {},
          content: [{ nodeType: 'text', value: 'Business & Permits', marks: [], data: {} }],
        },
        {
          nodeType: 'paragraph',
          data: {},
          content: [
            { nodeType: 'text', value: 'Business Certificates', marks: [{ type: 'bold' }], data: {} },
            { nodeType: 'text', value: ' - Required for all businesses operating in Solvang. Apply for new certificates or renew existing ones.', marks: [], data: {} },
          ],
        },
        {
          nodeType: 'paragraph',
          data: {},
          content: [
            { nodeType: 'text', value: 'Permit Counter', marks: [{ type: 'bold' }], data: {} },
            { nodeType: 'text', value: ' - Submit applications and pick up approved permits for building, signage, and special events.', marks: [], data: {} },
          ],
        },
        {
          nodeType: 'paragraph',
          data: {},
          content: [
            { nodeType: 'text', value: 'Encroachment Permits', marks: [{ type: 'bold' }], data: {} },
            { nodeType: 'text', value: ' - Required for work within the public right-of-way (sidewalks, streets, utilities).', marks: [], data: {} },
          ],
        },
        {
          nodeType: 'heading-3',
          data: {},
          content: [{ nodeType: 'text', value: 'Payments & Billing', marks: [], data: {} }],
        },
        {
          nodeType: 'paragraph',
          data: {},
          content: [
            { nodeType: 'text', value: 'Pay utility bills (water/sewer), permit fees, and other city charges in person, by mail, or by phone. For utility account questions, contact the ', marks: [], data: {} },
            {
              nodeType: 'hyperlink',
              data: { uri: '/departments/utilities' },
              content: [{ nodeType: 'text', value: 'Utilities Department', marks: [], data: {} }],
            },
            { nodeType: 'text', value: '.', marks: [], data: {} },
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
            { nodeType: 'text', value: 'City Hall is located at 1644 Oak Street in downtown Solvang, open Monday through Friday, 8:00 AM to 5:00 PM. Free parking is available in the lot behind the building and on surrounding streets.', marks: [], data: {} },
          ],
        },
      ],
    },
  }

  entry = await entry.update()
  await entry.publish()
  console.log('Updated City Hall department')
}

main().catch(console.error)

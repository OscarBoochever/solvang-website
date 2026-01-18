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

  // Check if City Hall already exists
  const existing = await environment.getEntries({
    content_type: 'department',
    'fields.slug': 'city-hall',
  })

  if (existing.items.length > 0) {
    console.log('City Hall department already exists')
    return
  }

  // Create City Hall department
  const entry = await environment.createEntry('department', {
    fields: {
      name: { 'en-US': 'City Hall' },
      slug: { 'en-US': 'city-hall' },
      description: {
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
                  value: 'City Hall is the center of municipal government for the City of Solvang. Visit us for general inquiries, utility payments, permits, licenses, and public records.',
                  marks: [],
                  data: {},
                },
              ],
            },
          ],
        },
      },
      phone: { 'en-US': '(805) 688-5575' },
      email: { 'en-US': 'info@cityofsolvang.com' },
      address: { 'en-US': '1644 Oak Street, Solvang, CA 93463' },
      content: {
        'en-US': {
          nodeType: 'document',
          data: {},
          content: [
            {
              nodeType: 'heading-3',
              data: {},
              content: [{ nodeType: 'text', value: 'Services Available', marks: [], data: {} }],
            },
            {
              nodeType: 'paragraph',
              data: {},
              content: [
                { nodeType: 'text', value: 'Utility Billing', marks: [{ type: 'bold' }], data: {} },
                { nodeType: 'text', value: ' - Pay water and sewer bills, start or stop service, update account information.', marks: [], data: {} },
              ],
            },
            {
              nodeType: 'paragraph',
              data: {},
              content: [
                { nodeType: 'text', value: 'Business Certificates', marks: [{ type: 'bold' }], data: {} },
                { nodeType: 'text', value: ' - Apply for or renew business certificates for operating in Solvang.', marks: [], data: {} },
              ],
            },
            {
              nodeType: 'paragraph',
              data: {},
              content: [
                { nodeType: 'text', value: 'Permits & Licenses', marks: [{ type: 'bold' }], data: {} },
                { nodeType: 'text', value: ' - Building permits, encroachment permits, special event permits.', marks: [], data: {} },
              ],
            },
            {
              nodeType: 'paragraph',
              data: {},
              content: [
                { nodeType: 'text', value: 'Public Records', marks: [{ type: 'bold' }], data: {} },
                { nodeType: 'text', value: ' - Submit requests for public documents under the California Public Records Act.', marks: [], data: {} },
              ],
            },
            {
              nodeType: 'paragraph',
              data: {},
              content: [
                { nodeType: 'text', value: 'City Clerk', marks: [{ type: 'bold' }], data: {} },
                { nodeType: 'text', value: ' - Elections, official records, council meeting support, and notary services.', marks: [], data: {} },
              ],
            },
            {
              nodeType: 'heading-3',
              data: {},
              content: [{ nodeType: 'text', value: 'Location & Parking', marks: [], data: {} }],
            },
            {
              nodeType: 'paragraph',
              data: {},
              content: [
                { nodeType: 'text', value: 'City Hall is located at 1644 Oak Street in downtown Solvang. Free parking is available in the lot behind the building and on surrounding streets.', marks: [], data: {} },
              ],
            },
          ],
        },
      },
    },
  })

  await entry.publish()
  console.log('Created and published City Hall department')
}

main().catch(console.error)

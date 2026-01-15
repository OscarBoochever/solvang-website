import * as contentful from 'contentful-management'
import * as fs from 'fs'
import * as path from 'path'

// Load env vars from .env.local
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

function createRichText(text: string) {
  if (!text) return null
  return {
    nodeType: 'document',
    data: {},
    content: [{
      nodeType: 'paragraph',
      data: {},
      content: [{
        nodeType: 'text',
        value: text,
        marks: [],
        data: {},
      }],
    }],
  }
}

function createRichTextWithHeadings(sections: { heading?: string; content: string }[]) {
  const nodes: any[] = []
  for (const section of sections) {
    if (section.heading) {
      nodes.push({
        nodeType: 'heading-3',
        data: {},
        content: [{
          nodeType: 'text',
          value: section.heading,
          marks: [],
          data: {},
        }],
      })
    }
    const paragraphs = section.content.split('\n\n').filter(p => p.trim())
    for (const p of paragraphs) {
      nodes.push({
        nodeType: 'paragraph',
        data: {},
        content: [{
          nodeType: 'text',
          value: p.replace(/\n/g, ' '),
          marks: [],
          data: {},
        }],
      })
    }
  }
  return { nodeType: 'document', data: {}, content: nodes }
}

async function main() {
  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID!)
  const environment = await space.getEnvironment('master')

  const departments = [
    {
      name: 'Administration',
      slug: 'administration',
      description: 'The Administration Department oversees day-to-day municipal operations including the City Manager, City Clerk, Human Resources, Finance, and Contract Services.',
      phone: '(805) 688-5575',
      email: 'cityclerk@cityofsolvang.com',
      address: '1644 Oak Street, Solvang, CA 93463',
      content: [
        { heading: 'City Manager', content: 'Randy Murphy serves as City Manager, the appointed administrative head responsible for efficient city operations and personnel management.' },
        { heading: 'City Clerk', content: 'Annamarie Porter, CMC, manages elections, public records, legislative functions, and Brown Act compliance. Contact: cityclerk@cityofsolvang.com' },
        { heading: 'Finance', content: 'Administrative Services Director Wendy Berry oversees accounts payable/receivable, utility billing, and treasury operations.' },
        { heading: 'Hours', content: 'Monday through Friday, 8:00 AM to 5:00 PM' },
      ],
    },
    {
      name: 'Community Development',
      slug: 'community-development',
      description: 'Our main goal is to enhance and preserve Solvang\'s character through high quality customer service while supporting business and community development.',
      phone: '(805) 688-5575',
      email: 'planningdept@cityofsolvang.com',
      address: '411 Second Street, Solvang, CA 93463',
      content: [
        { heading: 'Planning Division', content: 'Oversees physical development and land use, balancing economic growth with quality of life. Contact: planningdept@cityofsolvang.com. Hours: Mon-Fri, 8am-5pm.' },
        { heading: 'Building Division', content: 'Ensures structures meet California Building Code standards through permitting and inspections. Contact: buildingdept@cityofsolvang.com. Hours: Mon-Fri, 8:30am-12pm, 1pm-4pm.' },
        { heading: 'Code Compliance', content: 'Maintains community standards through education and enforcement. Contact: codecompliance@cityofsolvang.com. Hours: Wed-Fri, 8am-3pm.' },
        { heading: 'Services', content: 'Planning applications, building permits, home occupation permits, temporary use permits, short-term rental permits, and code complaint submissions.' },
      ],
    },
    {
      name: 'Utilities',
      slug: 'utilities',
      description: 'The Utilities Department manages water and wastewater services for Solvang residents, ensuring clean water delivery and proper sewage treatment.',
      phone: '(805) 688-5575',
      email: 'utilities@cityofsolvang.com',
      address: '1644 Oak Street, Solvang, CA 93463',
      content: [
        { heading: 'Water Services', content: 'The Water Division manages the municipal water supply and distribution system, ensuring safe and reliable water for all residents and businesses.' },
        { heading: 'Wastewater Services', content: 'The Wastewater Division handles sewage collection and treatment, protecting public health and the environment.' },
        { heading: 'Billing & Payments', content: 'Multiple payment options are available for utility bills. Visit City Hall or use online payment services.' },
        { heading: 'Water Conservation', content: 'Solvang encourages water conservation. Please pause irrigation systems during rainy weather to prevent runoff and water waste.' },
      ],
    },
    {
      name: 'Public Safety',
      slug: 'public-safety',
      description: 'Public safety services in Solvang are provided through contracts with Santa Barbara County for both fire and law enforcement protection.',
      phone: '(805) 686-5000',
      email: 'info@cityofsolvang.com',
      address: '1644 Oak Street, Solvang, CA 93463',
      content: [
        { heading: 'Police Services', content: 'Law enforcement is provided through the Santa Barbara County Sheriff\'s Office. Non-emergency line: (805) 686-5000. The local substation is at 1745 Mission Drive.' },
        { heading: 'Fire Services', content: 'Fire protection is provided by the Santa Barbara County Fire District. Station #30 is located at 1644 Oak Street, co-located with City Hall.' },
        { heading: 'Emergency', content: 'For all emergencies, dial 911.' },
        { heading: 'Coverage Area', content: 'Services cover Solvang and surrounding unincorporated areas including Los Olivos, Lake Cachuma, Santa Ynez, and Los Alamos.' },
      ],
    },
    {
      name: 'Economic Development',
      slug: 'economic-development',
      description: 'Supporting local businesses, attracting new investment, and creating opportunities that enhance quality of life for residents and visitors.',
      phone: '(805) 688-5575',
      email: 'info@cityofsolvang.com',
      address: '1644 Oak Street, Solvang, CA 93463',
      content: [
        { heading: 'Our Mission', content: 'The City of Solvang\'s economic development strategy focuses on preserving Danish heritage while promoting business growth and innovation.' },
        { heading: 'Business Support', content: 'We provide guidance, streamlined permitting, and resources to help entrepreneurs establish and expand operations in Solvang.' },
        { heading: 'Tourism & Hospitality', content: 'Solvang leverages its unique cultural destination status through conferences, cultural events, and regional partnerships.' },
        { heading: 'Regional Partnerships', content: 'We collaborate with the Chamber of Commerce, Small Business Development Center, and Allan Hancock College to provide resources for business owners.' },
      ],
    },
  ]

  console.log('Adding departments with RichText description...')
  for (const dept of departments) {
    try {
      const existing = await environment.getEntries({
        content_type: 'department',
        'fields.slug': dept.slug,
      })
      if (existing.items.length > 0) {
        console.log(`  Skipping ${dept.name} (already exists)`)
        continue
      }

      const entry = await environment.createEntry('department', {
        fields: {
          name: { 'en-US': dept.name },
          slug: { 'en-US': dept.slug },
          description: { 'en-US': createRichText(dept.description) },
          phone: { 'en-US': dept.phone },
          email: { 'en-US': dept.email },
          address: { 'en-US': dept.address },
          content: { 'en-US': createRichTextWithHeadings(dept.content) },
        },
      })
      await entry.publish()
      console.log(`  Added: ${dept.name}`)
    } catch (error: any) {
      console.error(`  Error adding ${dept.name}:`, error.message)
    }
  }

  console.log('\nDone!')
}

main().catch(console.error)

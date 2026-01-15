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

function createRichTextWithHeadings(sections: { heading?: string; content: string }[]) {
  const nodes: any[] = []
  for (const section of sections) {
    if (section.heading) {
      nodes.push({
        nodeType: 'heading-3',
        data: {},
        content: [{ nodeType: 'text', value: section.heading, marks: [], data: {} }],
      })
    }
    const paragraphs = section.content.split('\n\n').filter(p => p.trim())
    for (const p of paragraphs) {
      nodes.push({
        nodeType: 'paragraph',
        data: {},
        content: [{ nodeType: 'text', value: p.replace(/\n/g, ' '), marks: [], data: {} }],
      })
    }
  }
  return { nodeType: 'document', data: {}, content: nodes }
}

async function main() {
  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID!)
  const environment = await space.getEnvironment('master')

  console.log('Updating How To page content...')

  const entries = await environment.getEntries({
    content_type: 'page',
    'fields.slug': 'how-to',
  })

  if (entries.items.length > 0) {
    let entry = entries.items[0]
    entry.fields.content = {
      'en-US': createRichTextWithHeadings([
        { heading: 'Apply for a Permit', content: 'Building Permit - Contact Building Division at (805) 688-5575 ext. 218 or buildingdept@cityofsolvang.com.\n\nBusiness Certificate - Required for all businesses operating in Solvang. Apply at City Hall.\n\nSign Permit - Required for new business signage. Contact Planning at planningdept@cityofsolvang.com.\n\nSpecial Event Permit - Planning a public event? Contact the City Clerk for permit requirements.' },
        { heading: 'Make a Payment', content: 'Utility Bills - Pay water and sewer bills online, by mail, or in person at City Hall (1644 Oak Street). Phone: (805) 688-5575.' },
        { heading: 'Submit a Request', content: 'Report a Concern - Potholes, streetlight outages, code violations, or other issues: publicworks@cityofsolvang.com or (805) 688-5575.\n\nPublic Records Request - Submit requests to the City Clerk at cityclerk@cityofsolvang.com.\n\nStreet/Utilities Maintenance - Report water leaks, street damage, or other maintenance needs to Public Works.' },
        { heading: 'Find Information', content: 'Agendas & Minutes - City Council and commission meeting documents available on the city website.\n\nMunicipal Code - Solvang\'s laws and regulations are available online.\n\nFee Schedule - Current permit and service fees available at City Hall or online.\n\nFind My Voting District - Look up your City Council district at districtssolvang.org.' },
        { heading: 'Sign Up', content: 'Emergency Alerts - Register at ReadySBC.org for emergency notifications.\n\nHej Solvang Newsletter - Subscribe to the city\'s resident newsletter for news and updates.\n\nRecreation Programs - Register for Parks & Recreation activities at secure.rec1.com or call (805) 688-7529.' },
      ]),
    }
    entry = await entry.update()
    await entry.publish()
    console.log('  Updated How To page')
  } else {
    console.log('  Page not found')
  }

  console.log('\nDone!')
}

main().catch(console.error)

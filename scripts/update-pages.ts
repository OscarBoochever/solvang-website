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

  // Updated pages with streamlined content from the actual site
  const pageUpdates = [
    {
      slug: 'how-do-i',
      title: 'How Do I...',
      metaDescription: 'Quick links to common City of Solvang services - apply for permits, make payments, submit requests, and more.',
      content: [
        { heading: 'Apply For', content: 'Building Permit - Contact Building Division at (805) 688-5575 ext. 218 or buildingdept@cityofsolvang.com.\n\nBusiness Certificate - Required for all businesses operating in Solvang. Apply at City Hall.\n\nWater & Sewer Service - New service connections through the Utilities Department.\n\nSign Permit - Required for new business signage. Contact Planning at planningdept@cityofsolvang.com.\n\nSpecial Event Permit - Planning a public event? Contact the City Clerk for permit requirements.' },
        { heading: 'Make a Payment', content: 'Utility Bills - Pay water and sewer bills online, by mail, or in person at City Hall (1644 Oak Street). Phone: (805) 688-5575.' },
        { heading: 'Submit a Request', content: 'Report a Concern - Potholes, streetlight outages, code violations, or other issues: publicworks@cityofsolvang.com or (805) 688-5575.\n\nPublic Records Request - Submit requests to the City Clerk at cityclerk@cityofsolvang.com.\n\nStreet/Utilities Maintenance - Report water leaks, street damage, or other maintenance needs to Public Works.' },
        { heading: 'Find Information', content: 'Agendas & Minutes - City Council and commission meeting documents available on the city website.\n\nMunicipal Code - Solvang\'s laws and regulations are available online.\n\nFee Schedule - Current permit and service fees available at City Hall or online.' },
        { heading: 'Sign Up', content: 'Emergency Alerts - Register at ReadySBC.org for emergency notifications.\n\nHej Solvang Newsletter - Subscribe to the city\'s resident newsletter for news and updates.\n\nRecreation Programs - Register for Parks & Recreation activities at secure.rec1.com or call (805) 688-7529.' },
      ],
    },
    {
      slug: 'residents',
      title: 'Residents',
      metaDescription: 'Resources and services for City of Solvang residents - utilities, public safety, transit, and community information.',
      content: [
        { heading: 'Utility Services', content: 'Water & Sewer - City-provided service. Pay bills at City Hall, by mail, or online. Report leaks to (805) 688-5575.\n\nElectrical & Gas - Provided by Pacific Gas & Electric (PG&E). Contact: 1-800-743-5000.\n\nSolid Waste & Recycling - Provided by Waste Management. For missed pickups or service questions, contact Waste Management directly.' },
        { heading: 'Public Safety', content: 'Police - Santa Barbara County Sheriff\'s Office. Non-emergency: (805) 686-5000. Substation: 1745 Mission Drive.\n\nFire - Santa Barbara County Fire District. Station #30 at City Hall.\n\nEmergency - Always dial 911 for emergencies.' },
        { heading: 'Transportation', content: 'Santa Ynez Valley Transit (SYVT) provides public bus service throughout the valley. Services include fixed routes and Dial-A-Ride for seniors and disabled residents. Plan trips at syvt.com or call (805) 688-5452.' },
        { heading: 'Parks & Recreation', content: 'Enjoy Solvang\'s parks, facilities, and recreation programs. Reserve Veterans Memorial Hall for events. Register for classes and activities at (805) 688-7529 or secure.rec1.com.' },
        { heading: 'Stay Informed', content: 'Hej Solvang Newsletter - City news delivered to your inbox.\n\nEmergency Alerts - Sign up at ReadySBC.org.\n\nCity Council Meetings - 2nd & 4th Mondays at 6:30 PM. Attend in person or watch on YouTube.' },
        { heading: 'Report a Concern', content: 'Report potholes, streetlight outages, code violations, graffiti, or other issues to Public Works at publicworks@cityofsolvang.com or (805) 688-5575 ext. 225.' },
      ],
    },
    {
      slug: 'business',
      title: 'Business',
      metaDescription: 'Start and grow your business in Solvang - permits, licenses, bid opportunities, and business resources.',
      content: [
        { heading: 'Starting a Business', content: 'Welcome to Solvang! Our Community Development Department offers streamlined permitting to help you open your business. Start with a business certificate application at City Hall or contact planningdept@cityofsolvang.com.' },
        { heading: 'Licenses & Permits', content: 'Business Certificate - Required for all businesses. Renewals due annually.\n\nBuilding Permits - For tenant improvements, new construction, or modifications. Contact: buildingdept@cityofsolvang.com.\n\nSign Permits - All new signage requires approval to maintain Solvang\'s Danish village character.' },
        { heading: 'Bid Opportunities', content: 'The City posts Requests for Proposals (RFPs) and bid opportunities for goods and services. Check the City website for active RFPs and Bids, or contact City Hall.' },
        { heading: 'Zoning & Land Use', content: 'Review zoning maps and city limits before selecting a business location. The Planning Division can help determine permitted uses for specific properties. Contact: planningdept@cityofsolvang.com.' },
        { heading: 'Resources', content: 'Solvang Chamber of Commerce - Networking, promotion, and business advocacy.\n\nSmall Business Development Center - Free business consulting and workshops.\n\nALLAN HANCOCK COLLEGE - Workforce training and education programs.' },
      ],
    },
    {
      slug: 'visitors',
      title: 'Visitors',
      metaDescription: 'Plan your visit to Solvang, California - The Danish Capital of America. Discover Danish heritage, wine tasting, and small-town charm.',
      content: [
        { heading: 'Welcome to Solvang', content: 'Solvang ("sunny field" in Danish) was founded in 1911 by Danish immigrants seeking to establish a Danish colony in the American West. Today, our charming village welcomes over a million visitors annually to experience authentic Danish culture, world-class wine tasting, and warm small-town hospitality.' },
        { heading: 'Things to Do', content: 'Explore Danish Architecture - Stroll through the village and admire half-timbered buildings, windmills, and Danish flags.\n\nWine Tasting - The Santa Ynez Valley is home to over 120 wineries. Many tasting rooms are walking distance from downtown.\n\nDanish Treats - Try aebleskiver (Danish pancakes), fresh pastries, and traditional Danish cuisine.\n\nMuseums - Visit the Elverhoj Museum of History and Art to learn about Solvang\'s Danish heritage.' },
        { heading: 'Special Events', content: 'Danish Days - September celebration of Danish culture with parades, folk dancing, and traditional foods.\n\nJulefest - December holiday festivities with candlelight tours, caroling, and Scandinavian traditions.\n\nTaste of Solvang - March food and wine festival showcasing local restaurants and wineries.\n\nFourth of July - Patriotic parade and community celebration.' },
        { heading: 'Getting Here', content: 'Solvang is located in the Santa Ynez Valley, approximately 45 minutes north of Santa Barbara. From Highway 101, take Highway 246 east directly into Solvang. Free parking is available throughout the village.' },
        { heading: 'Visitor Information', content: 'For tourism information, dining guides, and accommodations, visit solvangusa.com. The Solvang Visitors Center is located in the heart of the village. Follow @SolvangUSA on social media.' },
      ],
    },
    {
      slug: 'solvang-history',
      title: 'Solvang History',
      metaDescription: 'Learn about the history of Solvang, California - from Danish settlement in 1911 to the charming village today.',
      content: [
        { heading: 'The Danish Settlement', content: 'In 1911, a group of Danish-American educators from the Midwest purchased 9,000 acres in the Santa Ynez Valley to establish a Danish colony where they could preserve their cultural heritage. They named their settlement Solvang, meaning "sunny field" in Danish.' },
        { heading: 'Early Years', content: 'The founders built Atterdag College (a Danish folk school), established farms, and created a tight-knit Danish community. The town remained a quiet agricultural village for decades, with residents speaking Danish and maintaining traditional customs.' },
        { heading: 'Becoming a Destination', content: 'In the 1940s, Solvang began transforming into a tourist destination. Local merchants rebuilt their storefronts in Danish Provincial style, complete with half-timbered facades, thatched roofs, and windmills. The charming architecture attracted visitors seeking a taste of Denmark in California.' },
        { heading: 'Solvang Today', content: 'Incorporated as a city in 1985, Solvang now welcomes over one million visitors annually. The village features Danish bakeries, restaurants, shops, and the Elverhoj Museum of History and Art. Solvang proudly maintains its Danish heritage while serving as a gateway to Santa Ynez Valley wine country.' },
        { heading: 'Population', content: 'Solvang is home to approximately 6,100 residents within its 2.4 square miles. The city provides full municipal services including water, wastewater, parks, and public works, while contracting with Santa Barbara County for police and fire protection.' },
      ],
    },
  ]

  console.log('Updating pages with streamlined content...')
  for (const page of pageUpdates) {
    try {
      const existing = await environment.getEntries({
        content_type: 'page',
        'fields.slug': page.slug,
      })

      if (existing.items.length > 0) {
        // Update existing
        let entry = existing.items[0]
        entry.fields.title = { 'en-US': page.title }
        entry.fields.metaDescription = { 'en-US': page.metaDescription }
        entry.fields.content = { 'en-US': createRichTextWithHeadings(page.content) }
        entry = await entry.update()
        await entry.publish()
        console.log(`  Updated: ${page.title}`)
      } else {
        // Create new
        const entry = await environment.createEntry('page', {
          fields: {
            title: { 'en-US': page.title },
            slug: { 'en-US': page.slug },
            metaDescription: { 'en-US': page.metaDescription },
            content: { 'en-US': createRichTextWithHeadings(page.content) },
          },
        })
        await entry.publish()
        console.log(`  Created: ${page.title}`)
      }
    } catch (error: any) {
      console.error(`  Error with ${page.title}:`, error.message)
    }
  }

  console.log('\nDone!')
}

main().catch(console.error)

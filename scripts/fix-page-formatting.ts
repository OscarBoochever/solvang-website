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

// Content part can be text, bold text, a link, or a bold link
type ContentPart =
  | { text: string }
  | { bold: string }
  | { link: { text: string; url: string } }
  | { boldLink: { text: string; url: string } }

type Section = {
  heading?: string
  subheading?: string
  paragraphs: (string | ContentPart[])[]
}

function createRichText(sections: Section[]) {
  const nodes: any[] = []

  for (const section of sections) {
    // Add heading if present
    if (section.heading) {
      nodes.push({
        nodeType: 'heading-3',
        data: {},
        content: [{ nodeType: 'text', value: section.heading, marks: [], data: {} }],
      })
    }

    // Add subheading if present (smaller heading)
    if (section.subheading) {
      nodes.push({
        nodeType: 'heading-4',
        data: {},
        content: [{ nodeType: 'text', value: section.subheading, marks: [], data: {} }],
      })
    }

    // Add paragraphs
    for (const para of section.paragraphs) {
      if (typeof para === 'string') {
        // Simple string paragraph
        nodes.push({
          nodeType: 'paragraph',
          data: {},
          content: [{ nodeType: 'text', value: para, marks: [], data: {} }],
        })
      } else {
        // Complex paragraph with mixed content
        const content: any[] = []
        for (const part of para) {
          if ('text' in part) {
            content.push({ nodeType: 'text', value: part.text, marks: [], data: {} })
          } else if ('bold' in part) {
            content.push({ nodeType: 'text', value: part.bold, marks: [{ type: 'bold' }], data: {} })
          } else if ('link' in part) {
            content.push({
              nodeType: 'hyperlink',
              data: { uri: part.link.url },
              content: [{ nodeType: 'text', value: part.link.text, marks: [], data: {} }],
            })
          } else if ('boldLink' in part) {
            content.push({
              nodeType: 'hyperlink',
              data: { uri: part.boldLink.url },
              content: [{ nodeType: 'text', value: part.boldLink.text, marks: [{ type: 'bold' }], data: {} }],
            })
          }
        }
        nodes.push({ nodeType: 'paragraph', data: {}, content })
      }
    }
  }

  return { nodeType: 'document', data: {}, content: nodes }
}

async function main() {
  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID!)
  const environment = await space.getEnvironment('master')

  const pageUpdates: { slug: string; title: string; content: Section[] }[] = [
    {
      slug: 'city-council',
      title: 'City Council',
      content: [
        {
          heading: 'Current Council Members',
          paragraphs: [
            [
              { bold: 'Mayor David Brown' },
              { text: ' - At Large (term ends December 2026)' },
            ],
            [
              { bold: 'Mark Infanti' },
              { text: ' - District 1' },
            ],
            [
              { bold: 'Claudia Orona' },
              { text: ' - District 2' },
            ],
            [
              { bold: 'Robert Clarke' },
              { text: ' - District 3' },
            ],
            [
              { bold: 'Elizabeth Orona' },
              { text: ' - District 4' },
            ],
          ],
        },
        {
          heading: 'City Council Meetings',
          paragraphs: [],
        },
        {
          subheading: 'Schedule',
          paragraphs: [
            'City Council meets at 6:30 PM on the 2nd and 4th Monday of each month at the Council Chamber, 1644 Oak Street. Virtual attendance options are available.',
          ],
        },
        {
          subheading: 'How to Participate',
          paragraphs: [
            'Attend meetings in person or virtually. Public comment is welcome on agenda items and during general public comment.',
            [
              { text: 'Submit written comments to ' },
              { link: { text: 'cityclerk@cityofsolvang.com', url: 'mailto:cityclerk@cityofsolvang.com' } },
              { text: ' by noon on the day of the meeting.' },
            ],
          ],
        },
        {
          subheading: 'Agendas & Minutes',
          paragraphs: [
            'Meeting agendas are posted 72 hours in advance. Agendas, minutes, and video recordings are available on the City website.',
            [
              { text: 'Watch past meetings on the ' },
              { link: { text: 'City of Solvang YouTube channel', url: 'https://www.youtube.com/@CityofSolvangCA' } },
              { text: '.' },
            ],
          ],
        },
        {
          heading: 'News & Announcements',
          paragraphs: [
            [
              { text: 'Stay informed about city news, public notices, and community updates. Visit our ' },
              { link: { text: 'News & Announcements', url: '/news' } },
              { text: ' page for the latest information.' },
            ],
          ],
        },
        {
          heading: 'Events Calendar',
          paragraphs: [
            [
              { text: 'View upcoming city meetings, community events, and important dates on our ' },
              { link: { text: 'Events Calendar', url: '/events' } },
              { text: '.' },
            ],
          ],
        },
        {
          heading: 'Contact',
          paragraphs: [
            [
              { bold: 'Email: ' },
              { link: { text: 'council@cityofsolvang.com', url: 'mailto:council@cityofsolvang.com' } },
            ],
            [
              { bold: 'Phone: ' },
              { text: '(805) 688-5575' },
            ],
            'All communications to council are public record.',
          ],
        },
      ],
    },
    {
      slug: 'residents',
      title: 'Residents',
      content: [
        {
          heading: 'Utility Services',
          paragraphs: [
            [
              { bold: 'Water & Sewer' },
              { text: ' - City-provided service. Pay bills at City Hall, by mail, or online. Report leaks to (805) 688-5575.' },
            ],
            [
              { bold: 'Electrical & Gas' },
              { text: ' - Provided by Pacific Gas & Electric (PG&E). Contact: 1-800-743-5000.' },
            ],
            [
              { bold: 'Solid Waste & Recycling' },
              { text: ' - Provided by Waste Management. Contact Waste Management for service questions or missed pickups.' },
            ],
          ],
        },
        {
          heading: 'Public Safety',
          paragraphs: [
            [
              { bold: 'Police' },
              { text: ' - Santa Barbara County Sheriff\'s Office. Non-emergency: (805) 686-5000. Substation: 1745 Mission Drive.' },
            ],
            [
              { bold: 'Fire' },
              { text: ' - Santa Barbara County Fire District. Station #30 at 1644 Oak Street.' },
            ],
            [
              { bold: 'Emergency' },
              { text: ' - Always dial 911 for emergencies.' },
            ],
          ],
        },
        {
          heading: 'Transportation',
          paragraphs: [
            [
              { text: 'Santa Ynez Valley Transit (SYVT) provides public bus service throughout the valley. Services include fixed routes and Dial-A-Ride for seniors and disabled residents. Plan trips at ' },
              { link: { text: 'syvt.com', url: 'https://www.syvt.com' } },
              { text: ' or call (805) 688-5452.' },
            ],
          ],
        },
        {
          heading: 'Parks & Recreation',
          paragraphs: [
            [
              { text: 'Enjoy Solvang\'s parks, facilities, and recreation programs. Reserve Veterans Memorial Hall for events. Register for classes and activities at (805) 688-7529 or ' },
              { link: { text: 'secure.rec1.com', url: 'https://secure.rec1.com' } },
              { text: '.' },
            ],
          ],
        },
        {
          heading: 'Stay Informed',
          paragraphs: [
            [
              { bold: 'Hej Solvang Newsletter' },
              { text: ' - City news delivered to your inbox.' },
            ],
            [
              { bold: 'Emergency Alerts' },
              { text: ' - Sign up at ' },
              { link: { text: 'ReadySBC.org', url: 'https://www.readysbc.org' } },
              { text: '.' },
            ],
            [
              { bold: 'City Council Meetings' },
              { text: ' - 2nd & 4th Mondays at 6:30 PM. Attend in person or watch on YouTube.' },
            ],
          ],
        },
        {
          heading: 'Report a Concern',
          paragraphs: [
            [
              { text: 'Report potholes, streetlight outages, code violations, graffiti, or other issues to Public Works at ' },
              { link: { text: 'publicworks@cityofsolvang.com', url: 'mailto:publicworks@cityofsolvang.com' } },
              { text: ' or (805) 688-5575 ext. 225.' },
            ],
          ],
        },
      ],
    },
    {
      slug: 'business',
      title: 'Business',
      content: [
        {
          heading: 'Starting a Business',
          paragraphs: [
            [
              { text: 'Welcome to Solvang! Our Community Development Department offers streamlined permitting to help you open your business. ' },
              { boldLink: { text: 'Apply for a business certificate', url: '/business/business-certificate' } },
              { text: ' to get started, or contact ' },
              { link: { text: 'planningdept@cityofsolvang.com', url: 'mailto:planningdept@cityofsolvang.com' } },
              { text: ' with questions.' },
            ],
          ],
        },
        {
          heading: 'Licenses & Permits',
          paragraphs: [
            [
              { bold: 'Building Permits' },
              { text: ' - For tenant improvements, new construction, or modifications. Contact: ' },
              { link: { text: 'buildingdept@cityofsolvang.com', url: 'mailto:buildingdept@cityofsolvang.com' } },
              { text: '.' },
            ],
            [
              { bold: 'Sign Permits' },
              { text: ' - All new signage requires approval to maintain Solvang\'s Danish village character.' },
            ],
          ],
        },
        {
          heading: 'Bid Opportunities',
          paragraphs: [
            [
              { text: 'The City posts Requests for Proposals (RFPs) and bid opportunities for goods and services. Contact ' },
              { link: { text: 'City Hall', url: '/departments/city-hall' } },
              { text: ' at (805) 688-5575 to inquire about current opportunities.' },
            ],
          ],
        },
        {
          heading: 'Zoning & Land Use',
          paragraphs: [
            [
              { text: 'Review zoning maps and city limits before selecting a business location. The Planning Division can help determine permitted uses for specific properties. Contact: ' },
              { link: { text: 'planningdept@cityofsolvang.com', url: 'mailto:planningdept@cityofsolvang.com' } },
              { text: '.' },
            ],
          ],
        },
        {
          heading: 'Resources',
          paragraphs: [
            [
              { bold: 'Solvang Chamber of Commerce' },
              { text: ' - Networking, promotion, and business advocacy.' },
            ],
            [
              { bold: 'Small Business Development Center' },
              { text: ' - Free business consulting and workshops.' },
            ],
            [
              { bold: 'Allan Hancock College' },
              { text: ' - Workforce training and education programs.' },
            ],
          ],
        },
      ],
    },
    {
      slug: 'visitors',
      title: 'Visitors',
      content: [
        {
          heading: 'About Solvang',
          paragraphs: [
            'Solvang, meaning "Sunny Field" in Danish, was founded in 1911 by a group of Danish educators from the Midwest searching for the ideal location for a Danish-type folk school. Nestled between the Santa Ynez and San Rafael mountain ranges, they envisioned this as the perfect place to develop a Danish Colony—what we now know as Solvang.',
            'The City was incorporated on May 1, 1985, and transitioned from a General Law City to a Charter City in November 2006. Although Solvang has since developed into one of California\'s premier tourist destinations, its Danish-American residents continue to perpetuate their heritage through the distinctive architectural style seen throughout the downtown village.',
            'With a residential population of approximately 6,100, Solvang welcomes around 5 million visitors each year. Tourism is central to the City\'s economic vitality, with Tourist Occupancy Tax comprising about half of General Fund revenues.',
          ],
        },
        {
          heading: 'Things to Do',
          paragraphs: [
            [
              { bold: 'Explore Danish Architecture' },
              { text: ' - Stroll through the village and admire half-timbered buildings, windmills, and Danish flags.' },
            ],
            [
              { bold: 'Wine Tasting' },
              { text: ' - The Santa Ynez Valley is home to over 120 wineries. Many tasting rooms are walking distance from downtown.' },
            ],
            [
              { bold: 'Danish Treats' },
              { text: ' - Try aebleskiver (Danish pancakes), fresh pastries, and traditional Danish cuisine.' },
            ],
            [
              { bold: 'Museums' },
              { text: ' - Visit the Elverhoj Museum of History and Art to learn about Solvang\'s Danish heritage.' },
            ],
          ],
        },
        {
          heading: 'Special Events',
          paragraphs: [
            [
              { bold: 'Danish Days' },
              { text: ' - September celebration of Danish culture with parades, folk dancing, and traditional foods.' },
            ],
            [
              { bold: 'Julefest' },
              { text: ' - December holiday festivities with candlelight tours, caroling, and Scandinavian traditions.' },
            ],
            [
              { bold: 'Taste of Solvang' },
              { text: ' - March food and wine festival showcasing local restaurants and wineries.' },
            ],
            [
              { bold: 'Fourth of July' },
              { text: ' - Patriotic parade and community celebration.' },
            ],
          ],
        },
        {
          heading: 'Getting Here',
          paragraphs: [
            'Solvang is located in the Santa Ynez Valley, approximately 45 minutes north of Santa Barbara. From Highway 101, take Highway 246 east directly into Solvang. Free parking is available throughout the village.',
          ],
        },
        {
          heading: 'Visitor Information',
          paragraphs: [
            [
              { text: 'For tourism information, dining guides, and accommodations, visit ' },
              { link: { text: 'solvangusa.com', url: 'https://www.solvangusa.com' } },
              { text: '. The Solvang Visitors Center is located in the heart of the village.' },
            ],
          ],
        },
      ],
    },
    {
      slug: 'solvang-history',
      title: 'Solvang History',
      content: [
        {
          heading: 'The Danish Settlement',
          paragraphs: [
            'In 1911, a group of Danish-American educators from the Midwest purchased 9,000 acres in the Santa Ynez Valley to establish a Danish colony where they could preserve their cultural heritage. They named their settlement Solvang, meaning "sunny field" in Danish.',
          ],
        },
        {
          heading: 'Early Years',
          paragraphs: [
            'The founders built Atterdag College (a Danish folk school), established farms, and created a tight-knit Danish community. The town remained a quiet agricultural village for decades, with residents speaking Danish and maintaining traditional customs.',
          ],
        },
        {
          heading: 'Becoming a Destination',
          paragraphs: [
            'In the 1940s, Solvang began transforming into a tourist destination. Local merchants rebuilt their storefronts in Danish Provincial style, complete with half-timbered facades, thatched roofs, and windmills. The charming architecture attracted visitors seeking a taste of Denmark in California.',
          ],
        },
        {
          heading: 'Solvang Today',
          paragraphs: [
            [
              { text: 'Incorporated as a city in 1985, Solvang now welcomes over one million visitors annually. The village features Danish bakeries, restaurants, shops, and the ' },
              { link: { text: 'Elverhoj Museum of History and Art', url: 'https://elverhoj.org' } },
              { text: '. Solvang proudly maintains its Danish heritage while serving as a gateway to Santa Ynez Valley wine country.' },
            ],
          ],
        },
        {
          heading: 'Population',
          paragraphs: [
            'Solvang is home to approximately 6,100 residents within its 2.4 square miles. The city provides full municipal services including water, wastewater, parks, and public works, while contracting with Santa Barbara County for police and fire protection.',
          ],
        },
      ],
    },
    {
      slug: 'how-to',
      title: 'How To',
      content: [
        {
          heading: 'Pay a Bill',
          paragraphs: [
            [
              { bold: 'Utility Bills' },
              { text: ' - Pay water and sewer bills in person at ' },
              { link: { text: 'City Hall', url: '/departments/city-hall' } },
              { text: ', by mail, or by phone at (805) 688-5575.' },
            ],
            [
              { bold: 'Permit Fees' },
              { text: ' - Pay permit and license fees at City Hall during business hours.' },
            ],
          ],
        },
        {
          heading: 'Report a Concern',
          paragraphs: [
            [
              { link: { text: 'Report a Concern', url: '/report-concern' } },
              { text: ' - Potholes, streetlight outages, street damage, graffiti, water leaks, and other issues.' },
            ],
            [
              { text: 'For after-hours emergencies, call (805) 688-5575.' },
            ],
          ],
        },
        {
          heading: 'Public Records Request',
          paragraphs: [
            [
              { link: { text: 'Submit a Public Records Request', url: '/public-records' } },
              { text: ' - Request city documents under the California Public Records Act.' },
            ],
          ],
        },
        {
          heading: 'Apply for a Permit',
          paragraphs: [
            [
              { bold: 'Starting a Business?' },
              { text: ' - Visit our ' },
              { link: { text: 'Business page', url: '/business' } },
              { text: ' for business certificates, building permits, and sign permits.' },
            ],
            [
              { bold: 'Special Event Permit' },
              { text: ' - Planning a public event? Contact the City Clerk at ' },
              { link: { text: 'cityclerk@cityofsolvang.com', url: 'mailto:cityclerk@cityofsolvang.com' } },
              { text: '.' },
            ],
            [
              { bold: 'Encroachment Permit' },
              { text: ' - Required for work in the public right-of-way. Contact ' },
              { link: { text: 'Public Works', url: '/departments/public-works' } },
              { text: '.' },
            ],
          ],
        },
        {
          heading: 'Find Information',
          paragraphs: [
            [
              { link: { text: 'City Council', url: '/city-council' } },
              { text: ' - Meeting schedule, agendas & minutes, council members, and how to participate.' },
            ],
            [
              { link: { text: 'Events Calendar', url: '/events' } },
              { text: ' - Upcoming city meetings and community events.' },
            ],
            [
              { link: { text: 'Departments', url: '/departments' } },
              { text: ' - Contact information for all city departments.' },
            ],
            [
              { link: { text: 'Find My Voting District', url: 'https://districtsolvang.org' } },
              { text: ' - Look up your City Council district.' },
            ],
          ],
        },
        {
          heading: 'Sign Up for Alerts',
          paragraphs: [
            [
              { link: { text: 'Emergency Alerts', url: 'https://www.readysbc.org' } },
              { text: ' - Register for emergency notifications from Santa Barbara County.' },
            ],
            [
              { link: { text: 'City News & Updates', url: '/subscribe' } },
              { text: ' - Subscribe to receive news, meeting reminders, and community updates.' },
            ],
            [
              { link: { text: 'Recreation Programs', url: 'https://secure.rec1.com' } },
              { text: ' - Register for Parks & Recreation classes and activities.' },
            ],
          ],
        },
        {
          heading: 'Contact Us',
          paragraphs: [
            [
              { text: 'Have a question or need assistance? ' },
              { link: { text: 'Fill out our contact form', url: '/contact' } },
              { text: ' and we\'ll get back to you within 2-3 business days.' },
            ],
            [
              { bold: 'City Hall' },
              { text: ' - 1644 Oak Street, Solvang, CA 93463' },
            ],
            [
              { bold: 'Phone' },
              { text: ' - (805) 688-5575' },
            ],
            [
              { bold: 'Hours' },
              { text: ' - Monday through Friday, 8:00 AM to 5:00 PM' },
            ],
          ],
        },
      ],
    },
  ]

  console.log('Fixing page formatting...\n')

  for (const page of pageUpdates) {
    try {
      const entries = await environment.getEntries({
        content_type: 'page',
        'fields.slug': page.slug,
      })

      if (entries.items.length > 0) {
        let entry = entries.items[0]
        entry.fields.content = { 'en-US': createRichText(page.content) }
        entry = await entry.update()
        await entry.publish()
        console.log(`  Updated: ${page.title}`)
      } else {
        console.log(`  Not found: ${page.title} (slug: ${page.slug})`)
      }
    } catch (error: any) {
      console.error(`  Error with ${page.title}:`, error.message)
    }
  }

  console.log('\nDone!')
}

main().catch(console.error)

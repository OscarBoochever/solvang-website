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
  const paragraphs = text.split('\n\n').filter(p => p.trim())
  return {
    nodeType: 'document',
    data: {},
    content: paragraphs.map(p => ({
      nodeType: 'paragraph',
      data: {},
      content: [{
        nodeType: 'text',
        value: p.replace(/\n/g, ' '),
        marks: [],
        data: {},
      }],
    })),
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

  // New Departments
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
      name: 'Public Works',
      slug: 'public-works',
      description: 'Our goal is to provide safe, cost effective and environmentally responsible public facilities and services to the residents and visitors of Solvang.',
      phone: '(805) 688-5575 ext. 225',
      email: 'publicworks@cityofsolvang.com',
      address: '1644 Oak Street, Solvang, CA 93463',
      content: [
        { heading: 'Services', content: 'Public Works manages infrastructure maintenance, street repairs, stormwater management, and engineering projects throughout the city.' },
        { heading: 'Street Sweeping Schedule', content: 'North of Mission Drive: 1st & 3rd Wednesdays (7am-2pm). South of Mission Drive: 2nd & 4th Wednesdays (7am-2pm). Village Area: Every Wednesday (1am-7am).' },
        { heading: 'Emergency Contact', content: 'For after-hours emergencies, call (805) 588-8119 (available 24/7).' },
        { heading: 'Dig Alert', content: 'Always call 811 before any excavation work to locate underground utilities.' },
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

  // New News Articles
  const newsArticles = [
    {
      title: 'Tourism & Marketing Committee Seeking Members',
      slug: 'tmac-applications-2026',
      excerpt: 'The City is seeking five committee members for the Tourism & Marketing Advisory Committee. Application deadline is January 16, 2026.',
      category: 'Announcement',
      publishDate: '2026-01-10',
      content: 'The City of Solvang is accepting applications for the Tourism & Marketing Advisory Committee (TMAC). Five positions are available for residents or local business owners who want to help shape Solvang\'s tourism strategy. Apply by January 16, 2026 through the City Clerk\'s office.',
    },
    {
      title: 'Human Services Grant Applications Now Open',
      slug: 'human-services-grants-2026',
      excerpt: 'Non-profit organizations can apply for Human Services Grant funding through January 30, 2026.',
      category: 'Announcement',
      publishDate: '2026-01-05',
      content: 'The City of Solvang is accepting Human Services Grant applications from December 1, 2025 through January 30, 2026. Priority funding areas include senior services, Veterans support, youth programs, and disability services benefiting Solvang residents. Contact City Hall for application details.',
    },
    {
      title: 'Winter/Spring Recreation Programs Now Available',
      slug: 'winter-spring-recreation-2026',
      excerpt: 'Parks & Recreation has released the new activity calendar featuring day trips, K9 training, and museum visits.',
      category: 'Event',
      publishDate: '2026-01-05',
      content: 'The Parks & Recreation Department has released the Winter/Spring 2026 activity calendar with exciting new offerings. Programs include day trips to IKEA, K9 training classes, museum visits, and more. Register online at secure.rec1.com or call (805) 688-7529.',
    },
    {
      title: 'Nyborg Estates Water Main Project Progressing',
      slug: 'nyborg-estates-water-project-update',
      excerpt: 'The waterline replacement project in Nyborg Estates is on schedule with road restoration planned.',
      category: 'Update',
      publishDate: '2025-12-15',
      content: 'The Nyborg Estates water main replacement project continues to progress on schedule. Water tie-ins have been completed and road restoration is underway. Thank you for your patience during this important infrastructure improvement.',
    },
    {
      title: 'Christmas Decoration Contest Winners Announced',
      slug: 'christmas-decoration-winners-2025',
      excerpt: 'Congratulations to the O\'Neill, Hanson, and Brown families for their award-winning holiday displays.',
      category: 'Announcement',
      publishDate: '2025-12-20',
      content: 'The City of Solvang is pleased to announce the winners of the 2025 Christmas Decoration Contest. The O\'Neill family won Best Traditional, the Hanson family took Best Lights, and the Brown family earned Best Creative. Thank you to all participants!',
    },
    {
      title: 'Water Conservation Reminder During Rainy Season',
      slug: 'water-conservation-reminder',
      excerpt: 'Residents are urged to pause irrigation systems during rainy weather to conserve water.',
      category: 'Update',
      publishDate: '2025-12-10',
      content: 'As we enter the rainy season, the City reminds residents to pause automatic irrigation systems during and after rainfall. This helps prevent water waste and runoff while protecting our water resources. Smart irrigation controllers can automatically adjust to weather conditions.',
    },
  ]

  // New Events
  const events = [
    {
      title: 'City Council Meeting',
      date: '2026-01-27',
      time: '6:30 PM',
      location: 'Council Chamber, 1644 Oak Street',
      description: 'Regular City Council meeting. Public welcome to attend in person or virtually. Agenda available at cityofsolvang.com.',
      eventType: 'meeting',
    },
    {
      title: 'Design Review Committee',
      date: '2026-01-15',
      time: '5:00 PM',
      location: 'City Hall, 1644 Oak Street',
      description: 'Design Review Committee meeting to review proposed building designs and modifications in Solvang.',
      eventType: 'meeting',
    },
    {
      title: 'City Council Meeting',
      date: '2026-02-10',
      time: '6:30 PM',
      location: 'Council Chamber, 1644 Oak Street',
      description: 'Regular City Council meeting. Second Monday of the month.',
      eventType: 'meeting',
    },
    {
      title: 'City Council Meeting',
      date: '2026-02-24',
      time: '6:30 PM',
      location: 'Council Chamber, 1644 Oak Street',
      description: 'Regular City Council meeting. Fourth Monday of the month.',
      eventType: 'meeting',
    },
    {
      title: 'Parks & Recreation Commission',
      date: '2026-01-21',
      time: '5:30 PM',
      location: 'City Hall, 1644 Oak Street',
      description: 'Monthly Parks & Recreation Commission meeting to discuss parks, facilities, and recreation programs.',
      eventType: 'meeting',
    },
    {
      title: 'Planning Commission Meeting',
      date: '2026-02-03',
      time: '6:00 PM',
      location: 'Council Chamber, 1644 Oak Street',
      description: 'Planning Commission meeting to review development applications and land use matters.',
      eventType: 'meeting',
    },
  ]

  // New Pages
  const pages = [
    {
      title: 'How Do I...',
      slug: 'how-do-i',
      metaDescription: 'Quick answers to common questions about City of Solvang services and processes.',
      content: [
        { heading: 'Pay My Utility Bill', content: 'Pay online, by mail, or in person at City Hall (1644 Oak Street). Call (805) 688-5575 for payment options.' },
        { heading: 'Report a Problem', content: 'Report potholes, streetlight outages, or other issues by calling Public Works at (805) 688-5575 ext. 225 or emailing publicworks@cityofsolvang.com.' },
        { heading: 'Get a Building Permit', content: 'Visit the Community Development Department at 411 Second Street or call (805) 688-5575 ext. 218. Applications available online.' },
        { heading: 'Start a Business', content: 'Contact the Community Development Department for business license and permit information. We offer streamlined permitting for new businesses.' },
        { heading: 'Reserve a Park or Facility', content: 'Contact Parks & Recreation at (805) 688-7529 or visit secure.rec1.com to reserve Veterans Memorial Hall or park facilities.' },
        { heading: 'Attend a City Council Meeting', content: 'Meetings are held 6:30 PM on the 2nd and 4th Monday of each month at City Hall. Virtual attendance options available.' },
        { heading: 'Request Public Records', content: 'Submit requests to the City Clerk at cityclerk@cityofsolvang.com or visit City Hall during business hours.' },
        { heading: 'Sign Up for Emergency Alerts', content: 'Register for emergency notifications through Santa Barbara County\'s alert system at readysbc.org.' },
      ],
    },
    {
      title: 'Residents',
      slug: 'residents',
      metaDescription: 'Information and services for City of Solvang residents.',
      content: [
        { heading: 'Utility Services', content: 'The City provides water and wastewater services to residents. Pay bills online, by mail, or at City Hall. For service questions, call (805) 688-5575.' },
        { heading: 'Trash & Recycling', content: 'Waste Management provides trash and recycling collection services. For schedule information or to report missed pickups, contact Waste Management directly.' },
        { heading: 'Street Maintenance', content: 'Public Works maintains city streets. Report potholes or other issues to publicworks@cityofsolvang.com. Street sweeping occurs weekly - check the schedule to avoid parking tickets.' },
        { heading: 'Parks & Recreation', content: 'Enjoy Solvang\'s parks and recreation programs. Register for classes, sports leagues, and special events through Parks & Recreation at (805) 688-7529.' },
        { heading: 'Public Safety', content: 'Police services are provided by the Santa Barbara County Sheriff. Non-emergency: (805) 686-5000. Fire services are provided by Santa Barbara County Fire. Emergency: 911.' },
        { heading: 'City Meetings', content: 'Stay informed by attending City Council meetings (2nd & 4th Mondays at 6:30 PM) or watching live on the City\'s YouTube channel.' },
        { heading: 'Water Conservation', content: 'Help conserve water by following irrigation guidelines and reporting leaks. Rebates may be available for water-efficient appliances.' },
      ],
    },
    {
      title: 'Business',
      slug: 'business',
      metaDescription: 'Resources and information for businesses in Solvang.',
      content: [
        { heading: 'Starting a Business', content: 'Welcome to Solvang! Our Community Development Department offers streamlined permitting to help you open your business. Contact planningdept@cityofsolvang.com to get started.' },
        { heading: 'Business Licenses', content: 'All businesses operating in Solvang require a business license. Applications are available at City Hall or online. Renewals are due annually.' },
        { heading: 'Building & Permits', content: 'For tenant improvements, signage, or construction, contact the Building Division at buildingdept@cityofsolvang.com or (805) 688-5575 ext. 218.' },
        { heading: 'Economic Development', content: 'The City supports local business growth through resources, partnerships, and initiatives. We collaborate with the Chamber of Commerce and Small Business Development Center.' },
        { heading: 'Special Events', content: 'Planning a special event? Contact the City Clerk for permit information. Solvang hosts numerous festivals and events throughout the year.' },
        { heading: 'Design Guidelines', content: 'Solvang\'s unique Danish architecture is protected by design guidelines. The Design Review Committee reviews exterior modifications to maintain our village character.' },
        { heading: 'Resources', content: 'Connect with the Solvang Chamber of Commerce, Santa Barbara County Small Business Development Center, and SCORE for business mentoring and resources.' },
      ],
    },
    {
      title: 'Visitors',
      slug: 'visitors',
      metaDescription: 'Welcome to Solvang - The Danish Capital of America. Plan your visit.',
      content: [
        { heading: 'Welcome to Solvang', content: 'Solvang, meaning "sunny field" in Danish, was founded in 1911 by Danish immigrants. Today, our charming village welcomes over a million visitors annually to experience Danish culture, wine tasting, and small-town hospitality.' },
        { heading: 'Things to Do', content: 'Explore Danish architecture, visit the Elverhoj Museum of History and Art, sample aebleskiver (Danish pancakes), tour Santa Ynez Valley wineries, or stroll through our unique shops.' },
        { heading: 'Annual Events', content: 'Solvang hosts many festivals including Danish Days, Julefest (Christmas celebration), Taste of Solvang, and the Fourth of July celebration.' },
        { heading: 'Getting Here', content: 'Solvang is located in the Santa Ynez Valley, about 45 minutes from Santa Barbara. Take Highway 101 to Highway 246 and head east to Solvang.' },
        { heading: 'Visitor Information', content: 'For tourism information, visit solvangusa.com or stop by the Solvang Visitors Center. Follow @solvangusa on social media for events and inspiration.' },
        { heading: 'Parking', content: 'Free parking is available throughout the village. Public parking lots are located near the main shopping areas.' },
      ],
    },
    {
      title: 'City Council',
      slug: 'city-council',
      metaDescription: 'Information about Solvang City Council members, meetings, and how to participate.',
      content: [
        { heading: 'Meeting Schedule', content: 'City Council meets at 6:30 PM on the 2nd and 4th Monday of each month at the Council Chamber, 1644 Oak Street. Virtual attendance options are available.' },
        { heading: 'Current Council Members', content: 'Mayor David Brown (term ends December 2026), Mark Infanti - District 1, Claudia Orona - District 2, Louise Smith - District 3, Elizabeth Orona - District 4.' },
        { heading: 'How to Participate', content: 'Attend meetings in person or virtually. Public comment is welcome on agenda items. Submit written comments to cityclerk@cityofsolvang.com.' },
        { heading: 'Agendas & Minutes', content: 'Meeting agendas are posted 72 hours in advance. Agendas, minutes, and video recordings are available on the City website.' },
        { heading: 'Contact', content: 'Email: council@cityofsolvang.com. Phone: (805) 688-5575. All communications to council are public record.' },
      ],
    },
    {
      title: 'Emergency Preparedness',
      slug: 'emergency-preparedness',
      metaDescription: 'Be prepared for emergencies in Solvang. Resources and information for disaster readiness.',
      content: [
        { heading: 'Be Prepared', content: 'Solvang residents should be prepared for emergencies including wildfires, earthquakes, and severe weather. Create a family emergency plan and maintain an emergency supply kit.' },
        { heading: 'Emergency Alerts', content: 'Sign up for Santa Barbara County emergency alerts at readysbc.org to receive notifications about evacuations, severe weather, and other emergencies.' },
        { heading: 'Evacuation Routes', content: 'Know your evacuation routes. During emergencies, follow instructions from emergency personnel and monitor local news and alert systems.' },
        { heading: 'Emergency Contacts', content: 'Emergency: 911. Sheriff Non-Emergency: (805) 686-5000. City of Solvang: (805) 688-5575. Public Works Emergency: (805) 588-8119.' },
        { heading: 'Resources', content: 'Visit readysbc.org for comprehensive emergency preparedness information, including how to prepare for wildfires, earthquakes, and other disasters common to our region.' },
      ],
    },
  ]

  console.log('Adding new departments...')
  for (const dept of departments) {
    try {
      // Check if department already exists
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
          description: { 'en-US': dept.description },
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

  console.log('\nAdding news articles...')
  for (const article of newsArticles) {
    try {
      const existing = await environment.getEntries({
        content_type: 'news',
        'fields.slug': article.slug,
      })
      if (existing.items.length > 0) {
        console.log(`  Skipping ${article.title} (already exists)`)
        continue
      }

      const entry = await environment.createEntry('news', {
        fields: {
          title: { 'en-US': article.title },
          slug: { 'en-US': article.slug },
          excerpt: { 'en-US': article.excerpt },
          category: { 'en-US': article.category },
          publishDate: { 'en-US': article.publishDate },
          content: { 'en-US': createRichText(article.content) },
        },
      })
      await entry.publish()
      console.log(`  Added: ${article.title}`)
    } catch (error: any) {
      console.error(`  Error adding ${article.title}:`, error.message)
    }
  }

  console.log('\nAdding events...')
  for (const event of events) {
    try {
      // Check for duplicate by title and date
      const existing = await environment.getEntries({
        content_type: 'event',
        'fields.title': event.title,
        'fields.date': event.date,
      })
      if (existing.items.length > 0) {
        console.log(`  Skipping ${event.title} on ${event.date} (already exists)`)
        continue
      }

      const entry = await environment.createEntry('event', {
        fields: {
          title: { 'en-US': event.title },
          date: { 'en-US': event.date },
          time: { 'en-US': event.time },
          location: { 'en-US': event.location },
          description: { 'en-US': createRichText(event.description) },
          eventType: { 'en-US': event.eventType },
        },
      })
      await entry.publish()
      console.log(`  Added: ${event.title} (${event.date})`)
    } catch (error: any) {
      console.error(`  Error adding ${event.title}:`, error.message)
    }
  }

  console.log('\nAdding pages...')
  for (const page of pages) {
    try {
      const existing = await environment.getEntries({
        content_type: 'page',
        'fields.slug': page.slug,
      })
      if (existing.items.length > 0) {
        console.log(`  Skipping ${page.title} (already exists)`)
        continue
      }

      const entry = await environment.createEntry('page', {
        fields: {
          title: { 'en-US': page.title },
          slug: { 'en-US': page.slug },
          metaDescription: { 'en-US': page.metaDescription },
          content: { 'en-US': createRichTextWithHeadings(page.content) },
        },
      })
      await entry.publish()
      console.log(`  Added: ${page.title}`)
    } catch (error: any) {
      console.error(`  Error adding ${page.title}:`, error.message)
    }
  }

  console.log('\nDone!')
}

main().catch(console.error)

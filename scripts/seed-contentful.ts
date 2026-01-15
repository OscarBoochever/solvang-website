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

async function seed() {
  const client = contentful.createClient({ accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN! })
  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID!)
  const environment = await space.getEnvironment('master')

  console.log('🌱 Seeding Contentful...\n')

  // Departments
  const departments = [
    {
      name: 'City Hall',
      slug: 'city-hall',
      description: 'The administrative center of Solvang city government, providing essential services to residents and businesses.',
      phone: '(805) 688-5575',
      email: 'cityhall@cityofsolvang.com',
      address: '1644 Oak Street, Solvang, CA 93463',
      content: 'City Hall is the heart of Solvang\'s municipal operations. Our dedicated staff provides services including business licensing, utility billing, public records requests, and general city information. The City Council meets here on the 2nd and 4th Monday of each month at 6:30 PM. We are committed to transparent, responsive government that serves our Danish-American community with pride.',
    },
    {
      name: 'Public Works',
      slug: 'public-works',
      description: 'Maintains city infrastructure including streets, water systems, sewer systems, and stormwater management.',
      phone: '(805) 688-5575 x102',
      email: 'publicworks@cityofsolvang.com',
      address: '1644 Oak Street, Solvang, CA 93463',
      content: 'The Public Works Department is responsible for maintaining and improving Solvang\'s infrastructure. Our services include street maintenance and repair, water distribution system management, wastewater collection and treatment, stormwater management, and traffic signal maintenance. We also coordinate capital improvement projects to enhance our city\'s infrastructure for future generations.',
    },
    {
      name: 'Parks & Recreation',
      slug: 'parks-recreation',
      description: 'Programs, facilities, and community events that enhance quality of life for Solvang residents.',
      phone: '(805) 688-5575 x103',
      email: 'parks@cityofsolvang.com',
      address: '1644 Oak Street, Solvang, CA 93463',
      content: 'Parks & Recreation enriches our community through diverse programs and well-maintained facilities. We offer youth and adult sports leagues, fitness classes, senior programs, and summer camps. Our parks include Hans Christian Andersen Park, Sunny Fields Park, and the Solvang Festival Theater. We also organize community events including Danish Days, Julefest, and the annual Polar Bear Plunge.',
    },
    {
      name: 'Planning & Building',
      slug: 'planning',
      description: 'Zoning, permits, building inspections, and long-range planning for sustainable city development.',
      phone: '(805) 688-5575 x104',
      email: 'planning@cityofsolvang.com',
      address: '1644 Oak Street, Solvang, CA 93463',
      content: 'The Planning & Building Department guides Solvang\'s physical development while preserving our unique Danish architectural heritage. We process building permits, conduct inspections, enforce zoning regulations, and develop long-range plans. Our Design Review Committee ensures new construction complements Solvang\'s distinctive character. We also manage the Historic Preservation program to protect our cultural landmarks.',
    },
  ]

  console.log('📁 Creating departments...')
  for (const dept of departments) {
    try {
      const entry = await environment.createEntry('department', {
        fields: {
          name: { 'en-US': dept.name },
          slug: { 'en-US': dept.slug },
          description: { 'en-US': createRichText(dept.description) },
          phone: { 'en-US': dept.phone },
          email: { 'en-US': dept.email },
          address: { 'en-US': dept.address },
          content: { 'en-US': createRichText(dept.content) },
        },
      })
      await entry.publish()
      console.log(`  ✓ ${dept.name}`)
    } catch (e: any) {
      console.log(`  ✗ ${dept.name}: ${e.message}`)
    }
  }

  // Pages
  const pages = [
    {
      title: 'Contact Us',
      slug: 'contact',
      metaDescription: 'Contact the City of Solvang - phone, email, address, and office hours.',
      content: 'We\'re here to help! Contact the City of Solvang through any of the following methods:\n\n**Main Office**\n1644 Oak Street\nSolvang, CA 93463\n\n**Phone:** (805) 688-5575\n**Fax:** (805) 686-2049\n\n**Office Hours:**\nMonday - Friday: 8:00 AM - 5:00 PM\nClosed on weekends and city holidays.\n\n**Emergency Services:**\nFor emergencies, dial 911.\nFor non-emergency police services, call (805) 688-5575.',
    },
    {
      title: 'Accessibility',
      slug: 'accessibility',
      metaDescription: 'City of Solvang accessibility statement and accommodation requests.',
      content: 'The City of Solvang is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply the relevant accessibility standards.\n\n**Our Commitment**\nWe strive to meet WCAG 2.1 Level AA standards across our digital platforms.\n\n**Requesting Accommodations**\nIf you need assistance or accommodations, please contact us at (805) 688-5575 or email accessibility@cityofsolvang.com.\n\n**Feedback**\nWe welcome your feedback on the accessibility of our website. Please let us know if you encounter accessibility barriers.',
    },
    {
      title: 'Terms of Use',
      slug: 'terms',
      metaDescription: 'Terms and conditions for using the City of Solvang website.',
      content: 'By accessing and using the City of Solvang website, you agree to these terms of use.\n\n**Use of Content**\nContent on this website is provided for informational purposes. While we strive for accuracy, the City makes no warranties about completeness or reliability.\n\n**Links to Other Sites**\nOur website may contain links to external sites. The City is not responsible for the content or privacy practices of linked sites.\n\n**Privacy**\nPlease review our Privacy Policy for information about how we collect and use data.\n\n**Modifications**\nThe City reserves the right to modify these terms at any time.',
    },
    {
      title: 'Privacy Policy',
      slug: 'privacy',
      metaDescription: 'City of Solvang privacy policy and data collection practices.',
      content: 'The City of Solvang respects your privacy and is committed to protecting your personal information.\n\n**Information We Collect**\nWe may collect information you provide directly, such as when you contact us or sign up for newsletters. We also collect standard web analytics data.\n\n**How We Use Information**\nWe use collected information to provide services, respond to inquiries, and improve our website.\n\n**Data Security**\nWe implement appropriate security measures to protect your information.\n\n**Contact**\nFor privacy questions, contact us at privacy@cityofsolvang.com.',
    },
  ]

  console.log('\n📄 Creating pages...')
  for (const page of pages) {
    try {
      const entry = await environment.createEntry('page', {
        fields: {
          title: { 'en-US': page.title },
          slug: { 'en-US': page.slug },
          metaDescription: { 'en-US': page.metaDescription },
          content: { 'en-US': createRichText(page.content) },
        },
      })
      await entry.publish()
      console.log(`  ✓ ${page.title}`)
    } catch (e: any) {
      console.log(`  ✗ ${page.title}: ${e.message}`)
    }
  }

  // News
  const news = [
    {
      title: 'Human Services Grant Funding Application Period Extended',
      slug: 'grant-funding-extended',
      excerpt: 'The City of Solvang has extended the application deadline for community human services grants. Non-profit organizations serving Solvang residents are encouraged to apply.',
      category: 'Announcement',
      publishDate: '2026-01-10',
      content: 'The City of Solvang has extended the application deadline for community human services grants to February 15, 2026. Non-profit organizations providing essential services to Solvang residents are encouraged to apply.\n\nGrant funding is available for programs addressing food security, housing assistance, youth services, senior services, and health services. Awards range from $5,000 to $25,000.\n\nApplications can be submitted online through the City website or in person at City Hall. For questions, contact the City Manager\'s office at (805) 688-5575.',
    },
    {
      title: 'Water Conservation Reminder During Storm Season',
      slug: 'water-conservation-reminder',
      excerpt: 'With the recent rainfall, this is a great opportunity to pause or shut off irrigation systems. Conserving water helps our community and reduces runoff.',
      category: 'Update',
      publishDate: '2026-01-08',
      content: 'With the recent rainfall throughout the Santa Ynez Valley, the City of Solvang reminds residents to adjust their irrigation systems accordingly.\n\nDuring wet weather, we encourage residents to pause or shut off automatic irrigation systems. This helps conserve water, reduces water bills, and minimizes stormwater runoff.\n\nFor tips on water-efficient landscaping and rebates on smart irrigation controllers, visit our Public Works page or call (805) 688-5575.',
    },
    {
      title: 'Annual Polar Bear Plunge Returns February 1st',
      slug: 'polar-bear-plunge-2026',
      excerpt: 'Join us for the 4th Annual Polar Bear Plunge at Lake Santa Ynez! Take a quick dip in the refreshing water and support local charities.',
      category: 'Event',
      publishDate: '2026-01-05',
      content: 'The 4th Annual Solvang Polar Bear Plunge is back! Join fellow brave souls on February 1, 2026, at 10:00 AM for a refreshing dip in Lake Santa Ynez.\n\nRegistration is $25 per person, with all proceeds benefiting local charities. Participants receive a commemorative t-shirt and hot cocoa after the plunge.\n\nPre-registration is encouraged but day-of registration is available. Visit the Parks & Recreation page to sign up online.',
    },
  ]

  console.log('\n📰 Creating news articles...')
  for (const article of news) {
    try {
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
      console.log(`  ✓ ${article.title}`)
    } catch (e: any) {
      console.log(`  ✗ ${article.title}: ${e.message}`)
    }
  }

  // Events
  const events = [
    {
      title: 'City Council Meeting',
      date: '2026-01-27',
      time: '6:30 PM',
      location: 'Council Chambers, City Hall',
      description: 'Regular meeting of the Solvang City Council. Public comment welcome. Agenda available 72 hours before meeting.',
      eventType: 'meeting',
    },
    {
      title: 'Planning Commission',
      date: '2026-01-29',
      time: '6:00 PM',
      location: 'Council Chambers, City Hall',
      description: 'Regular meeting of the Planning Commission to review development applications and zoning matters.',
      eventType: 'meeting',
    },
    {
      title: 'Polar Bear Plunge',
      date: '2026-02-01',
      time: '10:00 AM',
      location: 'Lake Santa Ynez',
      description: '4th Annual Polar Bear Plunge benefiting local charities. Registration $25 includes t-shirt and hot cocoa.',
      eventType: 'event',
    },
    {
      title: 'Parks & Recreation Commission',
      date: '2026-02-03',
      time: '5:30 PM',
      location: 'City Hall',
      description: 'Monthly meeting of the Parks & Recreation Commission.',
      eventType: 'meeting',
    },
    {
      title: 'City Council Meeting',
      date: '2026-02-10',
      time: '6:30 PM',
      location: 'Council Chambers, City Hall',
      description: 'Regular meeting of the Solvang City Council. Public comment welcome.',
      eventType: 'meeting',
    },
  ]

  console.log('\n📅 Creating events...')
  for (const event of events) {
    try {
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
      console.log(`  ✓ ${event.title} (${event.date})`)
    } catch (e: any) {
      console.log(`  ✗ ${event.title}: ${e.message}`)
    }
  }

  console.log('\n✅ Seeding complete!')
}

// Helper to create Contentful rich text from plain text
function createRichText(text: string) {
  const paragraphs = text.split('\n\n')
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

seed().catch(console.error)

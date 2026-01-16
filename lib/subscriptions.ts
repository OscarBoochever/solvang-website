// Subscription categories as defined in the RFP
export const subscriptionCategories = [
  {
    id: 'agendas',
    name: 'Meeting Agendas',
    description: 'City Council and commission meeting agendas',
  },
  {
    id: 'emergencies',
    name: 'Emergency Alerts',
    description: 'Critical emergency notifications and evacuations',
  },
  {
    id: 'road-closures',
    name: 'Road Closures',
    description: 'Street closures, construction, and traffic updates',
  },
  {
    id: 'job-postings',
    name: 'Job Postings',
    description: 'City employment opportunities',
  },
  {
    id: 'bid-opportunities',
    name: 'Bid Opportunities',
    description: 'RFPs, bids, and contracting opportunities',
  },
  {
    id: 'news',
    name: 'News & Announcements',
    description: 'General city news and press releases',
  },
  {
    id: 'events',
    name: 'Events & Programs',
    description: 'Community events and city programs',
  },
  {
    id: 'utility-disruptions',
    name: 'Utility Disruptions',
    description: 'Water, sewer, and utility service interruptions',
  },
  {
    id: 'water-quality',
    name: 'Water Quality Reports',
    description: 'Annual water quality and testing reports',
  },
  {
    id: 'holidays',
    name: 'Holiday Closures',
    description: 'City office holiday schedules',
  },
  {
    id: 'budgets',
    name: 'Budget Updates',
    description: 'City budget information and financial reports',
  },
  {
    id: 'surveys',
    name: 'Community Surveys',
    description: 'Public input opportunities and surveys',
  },
  {
    id: 'public-hearings',
    name: 'Public Hearings',
    description: 'Notices for public hearings and comment periods',
  },
  {
    id: 'grants',
    name: 'Grant Opportunities',
    description: 'Available grants for residents and businesses',
  },
  {
    id: 'volunteer',
    name: 'Volunteer Opportunities',
    description: 'Ways to get involved in your community',
  },
  {
    id: 'tourism',
    name: 'Tourism Updates',
    description: 'Tourism-related impacts and events',
  },
]

export type SubscriptionCategory = typeof subscriptionCategories[number]

export type DeliveryMethod = 'email' | 'sms' | 'both'

export interface SubscriptionPreferences {
  email: string
  phone?: string
  deliveryMethod: DeliveryMethod
  categories: string[]
}

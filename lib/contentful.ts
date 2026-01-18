import { createClient, Entry, EntrySkeletonType } from 'contentful'

// Initialize Contentful client
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
})

// Preview client for draft content
const previewClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_PREVIEW_TOKEN!,
  host: 'preview.contentful.com',
})

// Get the appropriate client
function getClient(preview = false) {
  return preview ? previewClient : client
}

// Types for our content models
export interface DepartmentFields {
  name: string
  slug: string
  description?: string
  content?: any // Rich text
  phone?: string
  email?: string
  address?: string
  image?: any
}

export interface PageFields {
  title: string
  slug: string
  content?: any // Rich text
  metaDescription?: string
}

export interface NewsFields {
  title: string
  slug: string
  excerpt?: string
  content?: any // Rich text
  category?: string
  publishDate?: string
  image?: any
}

export interface EventFields {
  title: string
  date: string
  time?: string
  location?: string
  description?: string
  eventType?: string
}

export interface AlertFields {
  title: string
  message: string
  severity: 'info' | 'warning' | 'critical'
  link?: string
  linkText?: string
  dismissible?: boolean
  active?: boolean
  startsAt?: string
  expiresAt?: string
  priority?: number
}

// Fetch all departments
export async function getDepartments(preview = false) {
  const response = await getClient(preview).getEntries({
    content_type: 'department',
    order: ['fields.name'],
  })
  return response.items
}

// Fetch single department by slug
export async function getDepartmentBySlug(slug: string, preview = false) {
  const response = await getClient(preview).getEntries({
    content_type: 'department',
    'fields.slug': slug,
    limit: 1,
  })
  return response.items[0] || null
}

// Fetch all pages
export async function getPages(preview = false) {
  const response = await getClient(preview).getEntries({
    content_type: 'page',
  })
  // Filter by status (published or scheduled with time passed)
  return response.items.filter(isContentVisible)
}

// Fetch single page by slug
export async function getPageBySlug(slug: string, preview = false) {
  const response = await getClient(preview).getEntries({
    content_type: 'page',
    'fields.slug': slug,
    limit: 1,
  })
  const item = response.items[0]
  if (!item || !isContentVisible(item)) return null
  return item
}

// Helper to check if content should be visible based on status
function isContentVisible(item: any): boolean {
  const status = item.fields?.status || 'published'
  if (status === 'published') return true
  if (status === 'draft') return false
  if (status === 'scheduled') {
    const scheduledPublish = item.fields?.scheduledPublish
    if (!scheduledPublish) return false
    return new Date(scheduledPublish) <= new Date()
  }
  return true // Default to visible for backwards compatibility
}

// Fetch all news articles
export async function getNews(limit?: number, preview = false) {
  // Fetch more than needed to account for filtering out scheduled/draft items
  const fetchLimit = limit ? limit * 3 : 100
  const response = await getClient(preview).getEntries({
    content_type: 'news',
    order: ['-fields.publishDate', '-sys.createdAt'],
    limit: fetchLimit,
  })
  // Filter by status (published or scheduled with time passed)
  const visibleItems = response.items.filter(isContentVisible)
  // Return only the requested number of items
  return limit ? visibleItems.slice(0, limit) : visibleItems
}

// Fetch single news article by slug
export async function getNewsBySlug(slug: string, preview = false) {
  const response = await getClient(preview).getEntries({
    content_type: 'news',
    'fields.slug': slug,
    limit: 1,
  })
  const item = response.items[0]
  if (!item || !isContentVisible(item)) return null
  return item
}

// Fetch all events
export async function getEvents(preview = false) {
  const response = await getClient(preview).getEntries({
    content_type: 'event',
    order: ['fields.date'],
  })
  // Filter by status (published or scheduled with time passed)
  return response.items.filter(isContentVisible)
}

// Fetch upcoming events (from today onwards)
export async function getUpcomingEvents(limit?: number, preview = false) {
  const today = new Date().toISOString().split('T')[0]
  // Fetch more than needed to account for filtering out scheduled/draft items
  const fetchLimit = limit ? limit * 3 : 30
  const response = await getClient(preview).getEntries({
    content_type: 'event',
    'fields.date[gte]': today,
    order: ['fields.date'],
    limit: fetchLimit,
  })
  // Filter by status (published or scheduled with time passed)
  const visibleItems = response.items.filter(isContentVisible)
  // Return only the requested number of items
  return limit ? visibleItems.slice(0, limit) : visibleItems
}

// Fetch active alerts (visible on the site)
export async function getActiveAlerts(preview = false) {
  const response = await getClient(preview).getEntries({
    content_type: 'alert',
  })

  const now = new Date()

  // Filter to only alerts that have started and haven't expired
  return response.items.filter((item: any) => {
    const fields = item.fields
    // Check if started (if startsAt is set, it must be in the past)
    if (fields.startsAt && new Date(fields.startsAt) > now) return false
    // Check if expired
    if (fields.expiresAt && new Date(fields.expiresAt) < now) return false
    return true
  }).sort((a: any, b: any) => {
    // Sort by priority (higher first), then by severity
    const priorityA = a.fields.priority || 0
    const priorityB = b.fields.priority || 0
    if (priorityB !== priorityA) return priorityB - priorityA
    // Then by severity
    const severityOrder = { critical: 0, warning: 1, info: 2 }
    const sevA = severityOrder[a.fields.severity as keyof typeof severityOrder] ?? 2
    const sevB = severityOrder[b.fields.severity as keyof typeof severityOrder] ?? 2
    return sevA - sevB
  })
}

// Get all content for chatbot knowledge base
export async function getAllContentForChatbot() {
  const [departments, pages, news, events] = await Promise.all([
    getDepartments(),
    getPages(),
    getNews(),
    getEvents(),
  ])

  return {
    departments,
    pages,
    news,
    events,
  }
}

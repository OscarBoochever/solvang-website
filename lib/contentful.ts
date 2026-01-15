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
  return response.items
}

// Fetch single page by slug
export async function getPageBySlug(slug: string, preview = false) {
  const response = await getClient(preview).getEntries({
    content_type: 'page',
    'fields.slug': slug,
    limit: 1,
  })
  return response.items[0] || null
}

// Fetch all news articles
export async function getNews(limit?: number, preview = false) {
  const response = await getClient(preview).getEntries({
    content_type: 'news',
    order: ['-fields.publishDate'],
    limit: limit || 100,
  })
  return response.items
}

// Fetch single news article by slug
export async function getNewsBySlug(slug: string, preview = false) {
  const response = await getClient(preview).getEntries({
    content_type: 'news',
    'fields.slug': slug,
    limit: 1,
  })
  return response.items[0] || null
}

// Fetch all events
export async function getEvents(preview = false) {
  const response = await getClient(preview).getEntries({
    content_type: 'event',
    order: ['fields.date'],
  })
  return response.items
}

// Fetch upcoming events (from today onwards)
export async function getUpcomingEvents(limit?: number, preview = false) {
  const today = new Date().toISOString().split('T')[0]
  const response = await getClient(preview).getEntries({
    content_type: 'event',
    'fields.date[gte]': today,
    order: ['fields.date'],
    limit: limit || 10,
  })
  return response.items
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

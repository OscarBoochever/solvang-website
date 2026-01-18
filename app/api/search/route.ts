import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'contentful'

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
})

// Normalize text by removing accents/diacritics and converting to lowercase
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
    .replace(/['']/g, "'") // Normalize quotes
}

// Check if two strings are similar (fuzzy match)
function isSimilar(str1: string, str2: string): boolean {
  const s1 = normalizeText(str1)
  const s2 = normalizeText(str2)

  // Exact match
  if (s1 === s2) return true

  // One contains the other
  if (s1.includes(s2) || s2.includes(s1)) return true

  // Prefix match (for partial typing)
  if (s1.startsWith(s2) || s2.startsWith(s1)) return true

  // For longer strings, check word-level matching
  if (s1.length >= 4 && s2.length >= 4) {
    // Check if at least 80% of characters match (simple similarity)
    const longer = s1.length > s2.length ? s1 : s2
    const shorter = s1.length > s2.length ? s2 : s1
    let matches = 0
    for (let i = 0; i < shorter.length; i++) {
      if (longer.includes(shorter[i])) matches++
    }
    if (matches / shorter.length >= 0.8) return true
  }

  return false
}

// Static pages and forms that aren't in Contentful
// Keywords include English + Spanish + Danish translations for common terms
const staticContent = [
  {
    id: 'form-public-records',
    type: 'form',
    title: 'Public Records Request',
    keywords: [
      'public records', 'records request', 'cpra', 'california public records act', 'documents', 'foia',
      // Spanish
      'registros publicos', 'documentos', 'solicitud', 'archivos',
      // Danish
      'offentlige dokumenter', 'arkiver'
    ],
    description: 'Request city documents under the California Public Records Act',
    url: '/public-records',
  },
  {
    id: 'form-report-concern',
    type: 'form',
    title: 'Report a Concern',
    keywords: [
      'report', 'concern', 'pothole', 'streetlight', 'graffiti', 'water leak', 'code violation', 'complaint', 'issue', 'problem',
      // Spanish
      'reportar', 'problema', 'queja', 'bache', 'luz', 'agua', 'fuga', 'grafiti', 'preocupacion',
      // Danish
      'rapport', 'problem', 'klage'
    ],
    description: 'Report potholes, streetlights, water leaks, graffiti, and other issues',
    url: '/report-concern',
  },
  {
    id: 'form-contact',
    type: 'form',
    title: 'Contact Us',
    keywords: [
      'contact', 'email', 'message', 'question', 'inquiry', 'reach', 'help',
      // Spanish
      'contacto', 'contactar', 'mensaje', 'pregunta', 'ayuda', 'correo',
      // Danish
      'kontakt', 'besked', 'sporgsmaal', 'hjaelp'
    ],
    description: 'Send a message to city staff',
    url: '/contact',
  },
  {
    id: 'form-business-certificate',
    type: 'form',
    title: 'Business Certificate Application',
    keywords: [
      'business certificate', 'business license', 'start business', 'new business', 'license application', 'permit',
      // Spanish
      'licencia', 'negocio', 'certificado', 'empresa', 'permiso', 'comercio',
      // Danish
      'virksomhed', 'licens', 'tilladelse'
    ],
    description: 'Apply for a business certificate to operate in Solvang',
    url: '/business/business-certificate',
  },
  {
    id: 'form-subscribe',
    type: 'form',
    title: 'Subscribe to City Updates',
    keywords: [
      'subscribe', 'newsletter', 'alerts', 'notifications', 'email updates', 'news', 'signup', 'sign up',
      // Spanish
      'suscribir', 'suscripcion', 'alertas', 'notificaciones', 'noticias', 'boletin',
      // Danish
      'abonnere', 'nyhedsbrev', 'nyheder'
    ],
    description: 'Subscribe to city news, alerts, and updates',
    url: '/subscribe',
  },
  {
    id: 'page-events-calendar',
    type: 'page',
    title: 'Events Calendar',
    keywords: [
      'events', 'calendar', 'meetings', 'schedule', 'upcoming', 'city council meeting', 'planning commission',
      // Spanish
      'eventos', 'calendario', 'reuniones', 'horario', 'proximos',
      // Danish
      'begivenheder', 'kalender', 'moder'
    ],
    description: 'View upcoming city meetings and community events',
    url: '/events',
  },
  {
    id: 'page-departments',
    type: 'page',
    title: 'City Departments',
    keywords: [
      'departments', 'city hall', 'public works', 'utilities', 'planning', 'parks', 'recreation',
      // Spanish
      'departamentos', 'ayuntamiento', 'obras publicas', 'servicios', 'parques', 'recreacion',
      // Danish
      'afdelinger', 'radhus', 'parker'
    ],
    description: 'Browse all city departments and services',
    url: '/departments',
  },
  {
    id: 'page-news',
    type: 'page',
    title: 'News & Announcements',
    keywords: [
      'news', 'announcements', 'press', 'releases', 'updates', 'city news',
      // Spanish
      'noticias', 'anuncios', 'comunicados', 'actualizaciones', 'prensa',
      // Danish
      'nyheder', 'meddelelser', 'opdateringer'
    ],
    description: 'Latest news and announcements from the City of Solvang',
    url: '/news',
  },
  {
    id: 'service-utility-payment',
    type: 'service',
    title: 'Pay Utility Bill',
    keywords: [
      'pay bill', 'utility', 'water bill', 'sewer bill', 'payment', 'bills',
      // Spanish
      'pagar', 'factura', 'agua', 'utilidades', 'pago', 'cuenta',
      // Danish
      'betale', 'regning', 'vand'
    ],
    description: 'Pay your water and sewer bills',
    url: '/how-to#pay-a-bill',
  },
  {
    id: 'service-agendas',
    type: 'service',
    title: 'Meeting Agendas & Minutes',
    keywords: [
      'agendas', 'minutes', 'city council', 'meeting', 'video', 'recordings', 'youtube',
      // Spanish
      'agenda', 'actas', 'consejo', 'reunion', 'grabaciones',
      // Danish
      'dagsorden', 'referat', 'byrad', 'mode'
    ],
    description: 'View City Council meeting agendas, minutes, and video recordings',
    url: '/city-council',
  },
  {
    id: 'page-stream-live',
    type: 'page',
    title: 'Stream Live - City Council Meetings',
    keywords: [
      'stream', 'live', 'watch', 'city council', 'meeting', 'vimeo', 'broadcast', 'real-time', 'video',
      // Spanish
      'en vivo', 'ver', 'transmision', 'directo',
      // Danish
      'live', 'se', 'transmission'
    ],
    description: 'Watch live City Council meetings in real-time via Vimeo',
    url: '/city-council/live',
  },
  {
    id: 'service-voting-district',
    type: 'service',
    title: 'Find My Voting District',
    keywords: [
      'voting', 'district', 'election', 'vote', 'council district', 'representative',
      // Spanish
      'votar', 'distrito', 'eleccion', 'voto', 'representante',
      // Danish
      'stemme', 'distrikt', 'valg'
    ],
    description: 'Look up your City Council voting district',
    url: 'https://districtsolvang.org',
  },
  {
    id: 'service-emergency-alerts',
    type: 'service',
    title: 'Emergency Alerts',
    keywords: [
      'emergency', 'alerts', 'readysbc', 'notifications', 'disaster', 'warning',
      // Spanish
      'emergencia', 'alertas', 'desastre', 'advertencia', 'avisos',
      // Danish
      'nodsituation', 'alarm', 'advarsel'
    ],
    description: 'Sign up for emergency notifications',
    url: 'https://www.readysbc.org',
  },
  {
    id: 'page-visitors',
    type: 'page',
    title: 'Visitors Guide',
    keywords: [
      'visitors', 'tourism', 'things to do', 'attractions', 'visit', 'tour', 'vacation', 'travel', 'danish',
      // Spanish
      'visitantes', 'turismo', 'que hacer', 'atracciones', 'visitar', 'viaje', 'danes', 'turista',
      // Danish
      'besog', 'turisme', 'sevaerdigheder', 'dansk'
    ],
    description: 'Plan your visit to Solvang - The Danish Capital of America',
    url: '/visitors',
  },
  {
    id: 'page-business',
    type: 'page',
    title: 'Business Information',
    keywords: [
      'business', 'commerce', 'commercial', 'entrepreneur', 'company', 'store', 'shop',
      // Spanish
      'negocios', 'comercio', 'empresa', 'tienda', 'comercial',
      // Danish
      'forretning', 'handel', 'butik'
    ],
    description: 'Resources for businesses in Solvang',
    url: '/business',
  },
  {
    id: 'page-how-to',
    type: 'page',
    title: 'How To Guides',
    keywords: [
      'how to', 'guide', 'help', 'instructions', 'tutorial', 'steps',
      // Spanish
      'como', 'guia', 'ayuda', 'instrucciones', 'pasos', 'donde',
      // Danish
      'hvordan', 'vejledning', 'hjaelp'
    ],
    description: 'Step-by-step guides for city services',
    url: '/how-to',
  },
  {
    id: 'page-history',
    type: 'page',
    title: 'Solvang History',
    keywords: [
      'history', 'danish', 'heritage', 'founding', 'settlers', 'culture', 'tradition',
      // Spanish
      'historia', 'danes', 'herencia', 'fundacion', 'cultura', 'tradicion',
      // Danish
      'historie', 'arv', 'kultur', 'tradition', 'dansk'
    ],
    description: 'Learn about Solvang\'s Danish heritage and founding story',
    url: '/solvang-history',
  },
]

function searchStaticContent(query: string): { id: string; type: string; title: string; description: string; url: string; score: number }[] {
  const normalizedQuery = normalizeText(query)
  const queryWords = normalizedQuery.split(/\s+/).filter(w => w.length >= 2)

  return staticContent.map(item => {
    let score = 0
    const normalizedTitle = normalizeText(item.title)
    const normalizedDesc = normalizeText(item.description)
    const normalizedKeywords = item.keywords.map(k => normalizeText(k))
    const allText = `${normalizedTitle} ${normalizedKeywords.join(' ')} ${normalizedDesc}`

    // Exact title match (highest priority)
    if (normalizedTitle.includes(normalizedQuery)) score += 100

    // Check each query word
    for (const word of queryWords) {
      // Title contains word
      if (normalizedTitle.includes(word)) score += 50

      // Keyword exact match
      if (normalizedKeywords.some(k => k === word)) score += 40

      // Keyword contains word
      if (normalizedKeywords.some(k => k.includes(word))) score += 30

      // Fuzzy keyword match
      if (normalizedKeywords.some(k => isSimilar(k, word))) score += 20

      // Description contains word
      if (normalizedDesc.includes(word)) score += 10

      // Any text contains word (partial)
      if (allText.includes(word)) score += 5
    }

    // Bonus for matching all query words
    if (queryWords.length > 1 && queryWords.every(word => allText.includes(word))) {
      score += 25
    }

    return {
      id: item.id,
      type: item.type,
      title: item.title,
      description: item.description,
      url: item.url,
      score,
    }
  })
  .filter(item => item.score > 0)
  .sort((a, b) => b.score - a.score)
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ results: [] })
  }

  try {
    // Search static content first (forms, services) with scoring
    const staticResults = searchStaticContent(query)

    // Normalize query for Contentful search
    const normalizedQuery = normalizeText(query)

    // Search across all content types using Contentful's full-text search
    // Search with both original and normalized query for better results
    const [departments, pages, news, events] = await Promise.all([
      client.getEntries({
        content_type: 'department',
        query: normalizedQuery,
        limit: 5,
      }),
      client.getEntries({
        content_type: 'page',
        query: normalizedQuery,
        limit: 5,
      }),
      client.getEntries({
        content_type: 'news',
        query: normalizedQuery,
        limit: 5,
      }),
      client.getEntries({
        content_type: 'event',
        query: normalizedQuery,
        limit: 5,
      }),
    ])

    const contentfulResults = [
      ...departments.items.map((item: any) => ({
        id: item.sys.id,
        type: 'department',
        title: item.fields.name,
        description: item.fields.description || '',
        url: `/departments/${item.fields.slug}`,
        score: 50, // Base score for Contentful results
      })),
      ...pages.items.map((item: any) => ({
        id: item.sys.id,
        type: 'page',
        title: item.fields.title,
        description: item.fields.metaDescription || '',
        url: `/${item.fields.slug}`,
        score: 50,
      })),
      ...news.items.map((item: any) => ({
        id: item.sys.id,
        type: 'news',
        title: item.fields.title,
        description: item.fields.excerpt || '',
        url: `/news/${item.fields.slug}`,
        score: 40,
      })),
      ...events.items.map((item: any) => ({
        id: item.sys.id,
        type: 'event',
        title: item.fields.title,
        description: `${item.fields.date}${item.fields.location ? ` at ${item.fields.location}` : ''}`,
        url: '/events',
        score: 40,
      })),
    ]

    // Combine all results
    const allResults = [...staticResults, ...contentfulResults]

    // Remove duplicates by URL, keeping highest scoring version
    const seenUrls = new Map<string, typeof allResults[0]>()
    for (const item of allResults) {
      const existing = seenUrls.get(item.url)
      if (!existing || item.score > existing.score) {
        seenUrls.set(item.url, item)
      }
    }

    // Sort by score and return (without score in response)
    const results = Array.from(seenUrls.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 10) // Limit to 10 results
      .map(({ score, ...rest }) => rest)

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ results: [], error: 'Search failed' }, { status: 500 })
  }
}

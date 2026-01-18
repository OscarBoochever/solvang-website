import * as contentful from 'contentful-management'

const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN!,
})

async function getEnvironment() {
  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID!)
  return space.getEnvironment('master')
}

// Helper to create rich text from plain text or HTML
export function createRichText(text: string) {
  if (!text) return null

  // Check if content contains HTML tags - if so, wrap it in a special structure
  // that we can detect and render directly on the frontend
  const containsHtml = /<[^>]+>/.test(text)

  if (containsHtml) {
    // Store HTML in a single paragraph with a special marker
    return {
      nodeType: 'document',
      data: { isHtml: true },
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

  // Plain text - split into paragraphs
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

// Get all entries of a content type
export async function getEntries(contentType: string) {
  const environment = await getEnvironment()
  const entries = await environment.getEntries({ content_type: contentType })
  return entries.items
}

// Get a single entry
export async function getEntry(entryId: string) {
  const environment = await getEnvironment()
  return environment.getEntry(entryId)
}

// Create a new entry
export async function createEntry(contentType: string, fields: Record<string, any>) {
  const environment = await getEnvironment()
  const entry = await environment.createEntry(contentType, { fields })
  return entry
}

// Update an entry
export async function updateEntry(entryId: string, fields: Record<string, any>) {
  const environment = await getEnvironment()
  const entry = await environment.getEntry(entryId)

  // Update fields
  Object.keys(fields).forEach(key => {
    entry.fields[key] = fields[key]
  })

  return entry.update()
}

// Publish an entry
export async function publishEntry(entryId: string) {
  const environment = await getEnvironment()
  const entry = await environment.getEntry(entryId)
  return entry.publish()
}

// Unpublish an entry
export async function unpublishEntry(entryId: string) {
  const environment = await getEnvironment()
  const entry = await environment.getEntry(entryId)
  return entry.unpublish()
}

// Delete an entry
export async function deleteEntry(entryId: string) {
  const environment = await getEnvironment()
  const entry = await environment.getEntry(entryId)

  // Unpublish first if published
  if (entry.isPublished()) {
    await entry.unpublish()
  }

  return entry.delete()
}

// Upload an asset (image)
export async function uploadAsset(file: Buffer, fileName: string, contentType: string) {
  const environment = await getEnvironment()

  // Convert Buffer to ArrayBuffer for Contentful API
  const arrayBuffer = file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength) as ArrayBuffer

  // Create the asset
  const asset = await environment.createAssetFromFiles({
    fields: {
      title: { 'en-US': fileName },
      description: { 'en-US': '' },
      file: {
        'en-US': {
          contentType,
          fileName,
          file: arrayBuffer,
        },
      },
    },
  })

  // Process and publish the asset
  const processedAsset = await asset.processForAllLocales()

  // Wait for processing to complete
  let publishedAsset = processedAsset
  let attempts = 0
  while (attempts < 10) {
    try {
      publishedAsset = await processedAsset.publish()
      break
    } catch (e: any) {
      if (e.message?.includes('still processing')) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        attempts++
      } else {
        throw e
      }
    }
  }

  return publishedAsset
}

// Get an asset
export async function getAsset(assetId: string) {
  const environment = await getEnvironment()
  return environment.getAsset(assetId)
}

// Menu management
interface MenuItem {
  id: string
  label: string
  url: string
  children?: MenuItem[]
}

interface MenuData {
  items: MenuItem[]
}

const SITE_SETTINGS_ID = 'site-settings-menu'

// Ensure siteSettings content type exists
async function ensureSiteSettingsContentType(): Promise<boolean> {
  try {
    const environment = await getEnvironment()

    try {
      await environment.getContentType('siteSettings')
      return true // Already exists
    } catch (e: any) {
      if (e.name === 'NotFound') {
        // Create the content type
        const contentType = await environment.createContentTypeWithId('siteSettings', {
          name: 'Site Settings',
          description: 'Key-value store for site configuration',
          displayField: 'key',
          fields: [
            {
              id: 'key',
              name: 'Key',
              type: 'Symbol',
              required: true,
              localized: false,
            },
            {
              id: 'value',
              name: 'Value',
              type: 'Text',
              required: false,
              localized: false,
            },
          ],
        })
        await contentType.publish()
        return true
      }
      throw e
    }
  } catch (error) {
    console.error('Error ensuring siteSettings content type:', error)
    return false
  }
}

// Get menu from Contentful (stored in a siteSettings entry)
export async function getMenu(): Promise<MenuData> {
  try {
    const environment = await getEnvironment()

    // Try to get entries, create content type if needed
    let entries
    try {
      entries = await environment.getEntries({ content_type: 'siteSettings' })
    } catch (e: any) {
      if (e.name === 'NotFound' || e.message?.includes('Unknown content type')) {
        await ensureSiteSettingsContentType()
        return { items: [] }
      }
      throw e
    }

    // Find the menu settings entry
    const menuEntry = entries.items.find((e: any) =>
      e.fields.key?.['en-US'] === 'navigation-menu'
    )

    if (menuEntry) {
      const menuJson = menuEntry.fields.value?.['en-US']
      if (menuJson) {
        return typeof menuJson === 'string' ? JSON.parse(menuJson) : menuJson
      }
    }

    // Return default menu if none found
    return { items: [] }
  } catch (error) {
    console.error('Error fetching menu from Contentful:', error)
    return { items: [] }
  }
}

// Save menu to Contentful
export async function saveMenu(menu: MenuData): Promise<boolean> {
  try {
    // Ensure content type exists
    await ensureSiteSettingsContentType()

    const environment = await getEnvironment()
    const entries = await environment.getEntries({ content_type: 'siteSettings' })

    // Find existing menu entry
    let menuEntry = entries.items.find((e: any) =>
      e.fields.key?.['en-US'] === 'navigation-menu'
    )

    if (menuEntry) {
      // Update existing entry
      menuEntry.fields.value = { 'en-US': JSON.stringify(menu) }
      const updated = await menuEntry.update()
      await updated.publish()
    } else {
      // Create new entry
      const entry = await environment.createEntry('siteSettings', {
        fields: {
          key: { 'en-US': 'navigation-menu' },
          value: { 'en-US': JSON.stringify(menu) },
        },
      })
      await entry.publish()
    }

    return true
  } catch (error) {
    console.error('Error saving menu to Contentful:', error)
    return false
  }
}

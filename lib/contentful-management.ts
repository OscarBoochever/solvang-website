import * as contentful from 'contentful-management'

const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN!,
})

async function getEnvironment() {
  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID!)
  return space.getEnvironment('master')
}

// Helper to create rich text from plain text
export function createRichText(text: string) {
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

  // Create the asset
  const asset = await environment.createAssetFromFiles({
    fields: {
      title: { 'en-US': fileName },
      file: {
        'en-US': {
          contentType,
          fileName,
          file,
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

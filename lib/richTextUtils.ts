import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer'

/**
 * Extract plain text from a rich text field that could be either:
 * 1. Standard Contentful rich text format
 * 2. Our custom HTML format (with isHtml: true flag)
 *
 * This is used for:
 * - Search indexing
 * - Chatbot content extraction
 * - Listing page excerpts/previews
 */
export function richTextToPlainText(field: any): string {
  if (!field) return ''

  // Check if it's our custom HTML format
  if (field.data?.isHtml) {
    // Extract the raw HTML string
    const htmlString = field.content?.[0]?.content?.[0]?.value || ''
    // Strip HTML tags to get plain text
    return stripHtmlTags(htmlString)
  }

  // Standard Contentful rich text - use the official converter
  return documentToPlainTextString(field)
}

/**
 * Strip HTML tags from a string to get plain text
 */
export function stripHtmlTags(html: string): string {
  if (!html) return ''

  // Replace common block elements with newlines for readability
  let text = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')

  // Remove all remaining HTML tags
  text = text.replace(/<[^>]+>/g, '')

  // Decode common HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")

  // Clean up whitespace
  text = text
    .replace(/\n{3,}/g, '\n\n')  // Max 2 newlines in a row
    .trim()

  return text
}

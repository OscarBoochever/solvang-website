'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer'

export default function EditNews() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageAssetId, setImageAssetId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Announcement',
    publishDate: new Date().toISOString().split('T')[0],
    status: 'published',
    scheduledDate: '',
    scheduledTime: '09:00',
  })
  const router = useRouter()
  const params = useParams()
  const isNew = params.id === 'new'

  useEffect(() => {
    fetch('/api/admin/check')
      .then(res => {
        if (!res.ok) router.push('/admin')
        else if (!isNew) loadEntry()
        else setLoading(false)
      })
      .catch(() => router.push('/admin'))
  }, [router, isNew])

  const loadEntry = async () => {
    const res = await fetch(`/api/admin/content/${params.id}`)
    const data = await res.json()
    const fields = data.entry?.fields || {}
    const scheduledDateTime = fields.scheduledPublish?.['en-US'] || ''
    // Convert UTC to Pacific Time for display
    let scheduledDate = ''
    let scheduledTime = '09:00'
    if (scheduledDateTime) {
      const utcDate = new Date(scheduledDateTime)
      // Format in Pacific Time
      scheduledDate = utcDate.toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' }) // YYYY-MM-DD format
      scheduledTime = utcDate.toLocaleTimeString('en-US', {
        timeZone: 'America/Los_Angeles',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    }
    setForm({
      title: fields.title?.['en-US'] || '',
      slug: fields.slug?.['en-US'] || '',
      excerpt: fields.excerpt?.['en-US'] || '',
      content: fields.content?.['en-US'] ? documentToPlainTextString(fields.content['en-US']) : '',
      category: fields.category?.['en-US'] || 'Announcement',
      publishDate: fields.publishDate?.['en-US'] || new Date().toISOString().split('T')[0],
      status: fields.status?.['en-US'] || 'published',
      scheduledDate,
      scheduledTime,
    })
    // Load existing image if present
    const imageLink = fields.image?.['en-US']
    if (imageLink?.sys?.id) {
      setImageAssetId(imageLink.sys.id)
      // Fetch asset details to get URL
      const assetRes = await fetch(`/api/admin/asset/${imageLink.sys.id}`)
      if (assetRes.ok) {
        const assetData = await assetRes.json()
        if (assetData.url) {
          setImagePreview(`https:${assetData.url}`)
        }
      }
    }
    setLoading(false)
  }

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.success) {
        setImageAssetId(data.asset.id)
        setImagePreview(`https:${data.asset.url}`)
      } else {
        alert('Upload failed: ' + data.error)
      }
    } catch (error) {
      alert('Upload failed')
    }
    setUploading(false)
  }

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0])
    }
  }

  const removeImage = () => {
    setImagePreview(null)
    setImageAssetId(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Validate scheduled date/time if status is scheduled
    if (form.status === 'scheduled' && (!form.scheduledDate || !form.scheduledTime)) {
      alert('Please set both a date and time for scheduled articles')
      return
    }
    setSaving(true)
    const url = isNew ? '/api/admin/content' : `/api/admin/content/${params.id}`
    const method = isNew ? 'POST' : 'PUT'
    const fieldsWithImage = { ...form, imageAssetId }
    const body = isNew
      ? { contentType: 'news', fields: fieldsWithImage, richTextFields: ['content'] }
      : { fields: fieldsWithImage, richTextFields: ['content'] }
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    router.push('/admin/news')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-100"><div className="text-gray-500">Loading...</div></div>

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-navy-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/admin/news" className="text-white/60 hover:text-white">← Back</Link>
          <h1 className="font-bold">{isNew ? 'Add News Article' : 'Edit News Article'}</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
              <input type="text" required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent" placeholder="e.g., water-conservation-update" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent">
                <option value="Announcement">Announcement</option>
                <option value="Update">Update</option>
                <option value="Event">Event</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Publish Date</label>
              <input type="date" value={form.publishDate} onChange={(e) => setForm({ ...form, publishDate: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent">
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          {form.status === 'scheduled' && (
            <div className="bg-gold-50 border border-gold-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-gold-800 mb-2">Schedule Publication</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gold-700 mb-1">Date</label>
                  <input type="date" value={form.scheduledDate} onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })} className="w-full px-4 py-2 border border-gold-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-xs text-gold-700 mb-1">Time</label>
                  <input type="time" value={form.scheduledTime} onChange={(e) => setForm({ ...form, scheduledTime: e.target.value })} className="w-full px-4 py-2 border border-gold-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent" />
                </div>
              </div>
              <p className="text-xs text-gold-600 mt-2">This article will be automatically published at the scheduled date and time (Pacific Time).</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
            {imagePreview ? (
              <div className="relative">
                <div className="relative h-48 rounded-lg overflow-hidden bg-gray-100">
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                </div>
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  dragActive ? 'border-navy-500 bg-navy-50' : 'border-gray-300 hover:border-gray-400'
                } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {uploading ? (
                  <div className="text-gray-500">Uploading...</div>
                ) : (
                  <>
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">Drop an image here or click to upload</p>
                    <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
            <textarea rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent" placeholder="Brief summary for listings" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea rows={8} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent" placeholder="Full article content. Separate paragraphs with blank lines." />
          </div>

          <div className="flex gap-4 pt-4 border-t">
            <button type="submit" disabled={saving} className="px-6 py-2 bg-navy-700 hover:bg-navy-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50">{saving ? 'Saving...' : 'Save Article'}</button>
            <Link href="/admin/news" className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors">Cancel</Link>
          </div>
        </form>
      </main>
    </div>
  )
}

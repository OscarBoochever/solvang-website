'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import RichTextEditor from '@/components/admin/RichTextEditor'

export default function EditEvent() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    location: '',
    description: '',
    eventType: 'meeting',
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
    // Get description - check if it's our custom HTML format or Contentful rich text
    let descriptionHtml = ''
    const descField = fields.description?.['en-US']
    if (descField) {
      if (descField.data?.isHtml) {
        descriptionHtml = descField.content?.[0]?.content?.[0]?.value || ''
      } else {
        descriptionHtml = documentToHtmlString(descField)
      }
    }

    setForm({
      title: fields.title?.['en-US'] || '',
      date: fields.date?.['en-US'] || new Date().toISOString().split('T')[0],
      time: fields.time?.['en-US'] || '',
      location: fields.location?.['en-US'] || '',
      description: descriptionHtml,
      eventType: fields.eventType?.['en-US'] || 'meeting',
      status: fields.status?.['en-US'] || 'published',
      scheduledDate,
      scheduledTime,
    })
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Validate scheduled date/time if status is scheduled
    if (form.status === 'scheduled' && (!form.scheduledDate || !form.scheduledTime)) {
      alert('Please set both a date and time for scheduled events')
      return
    }
    setSaving(true)
    const url = isNew ? '/api/admin/content' : `/api/admin/content/${params.id}`
    const method = isNew ? 'POST' : 'PUT'
    const body = isNew
      ? { contentType: 'event', fields: form, richTextFields: ['description'] }
      : { fields: form, richTextFields: ['description'] }
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    router.push('/admin/events')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-100"><div className="text-gray-500">Loading...</div></div>

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-navy-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/admin/events" className="text-white/60 hover:text-white">← Back</Link>
          <h1 className="font-bold">{isNew ? 'Add Event' : 'Edit Event'}</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent" placeholder="e.g., City Council Meeting" />
          </div>

          <div className="grid grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input type="text" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent" placeholder="6:30 PM" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent">
                <option value="meeting">Meeting</option>
                <option value="event">Special Event</option>
              </select>
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
                  <label className="block text-xs text-gold-700 mb-1">Publish Date</label>
                  <input type="date" value={form.scheduledDate} onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })} className="w-full px-4 py-2 border border-gold-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-xs text-gold-700 mb-1">Publish Time</label>
                  <input type="time" value={form.scheduledTime} onChange={(e) => setForm({ ...form, scheduledTime: e.target.value })} className="w-full px-4 py-2 border border-gold-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent" />
                </div>
              </div>
              <p className="text-xs text-gold-600 mt-2">This event will appear on the calendar at the scheduled date and time (Pacific Time).</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent" placeholder="Council Chambers, City Hall" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <RichTextEditor
              value={form.description}
              onChange={(description) => setForm({ ...form, description })}
              placeholder="Event details..."
            />
          </div>

          <div className="flex gap-4 pt-4 border-t">
            <button type="submit" disabled={saving} className="px-6 py-2 bg-navy-700 hover:bg-navy-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50">{saving ? 'Saving...' : 'Save Event'}</button>
            <Link href="/admin/events" className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors">Cancel</Link>
          </div>
        </form>
      </main>
    </div>
  )
}

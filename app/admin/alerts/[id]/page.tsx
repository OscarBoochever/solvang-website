'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

// Helper to format UTC datetime to Pacific Time for display in datetime-local input
function formatDateTimeLocalPT(isoString: string | undefined): string {
  if (!isoString) return ''
  const date = new Date(isoString)
  // Format in Pacific Time
  const ptString = date.toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  // Convert "MM/DD/YYYY, HH:MM" to "YYYY-MM-DDTHH:MM"
  const [datePart, timePart] = ptString.split(', ')
  const [month, day, year] = datePart.split('/')
  return `${year}-${month}-${day}T${timePart}`
}

// Helper to convert Pacific Time input to UTC ISO string
function ptToUTC(datetimeLocalValue: string): string | null {
  if (!datetimeLocalValue) return null
  // datetimeLocalValue is like "2026-01-20T10:00" - interpret as Pacific Time

  // Parse the components
  const [datePart, timePart] = datetimeLocalValue.split('T')
  const [year, month, day] = datePart.split('-').map(Number)
  const [hours, minutes] = timePart.split(':').map(Number)

  // Create a date object treating the input as local time first
  const localDate = new Date(year, month - 1, day, hours, minutes, 0)

  // Get what that same wall-clock time would be in Pacific
  const localTimeStr = localDate.toLocaleString('en-US')
  const pacificTimeStr = localDate.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })

  const localParsed = new Date(localTimeStr)
  const pacificParsed = new Date(pacificTimeStr)

  // Calculate offset: how much to adjust to treat input as Pacific instead of local
  const offsetMs = localParsed.getTime() - pacificParsed.getTime()

  // Adjust the date
  const utcDate = new Date(localDate.getTime() + offsetMs)

  return utcDate.toISOString()
}

export default function EditAlert() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    message: '',
    severity: 'info',
    link: '',
    linkText: '',
    dismissible: true,
    postImmediately: true,
    startsAt: '',
    expiresAt: '',
    priority: 10,
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

    // Determine if it was posted immediately (no startsAt or startsAt is in the past)
    const startsAt = fields.startsAt?.['en-US']
    const wasPostedImmediately = !startsAt || new Date(startsAt) <= new Date()

    setForm({
      title: fields.title?.['en-US'] || '',
      message: fields.message?.['en-US'] || '',
      severity: fields.severity?.['en-US'] || 'info',
      link: fields.link?.['en-US'] || '',
      linkText: fields.linkText?.['en-US'] || '',
      dismissible: fields.dismissible?.['en-US'] ?? true,
      postImmediately: wasPostedImmediately,
      startsAt: formatDateTimeLocalPT(fields.startsAt?.['en-US']),
      expiresAt: formatDateTimeLocalPT(fields.expiresAt?.['en-US']),
      priority: fields.priority?.['en-US'] || 10,
    })
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!form.postImmediately && !form.startsAt) {
      alert('Please set a start date/time for scheduled alerts')
      return
    }

    // Debug: show what we're about to save
    const startsAtValue = form.postImmediately ? null : (form.startsAt ? ptToUTC(form.startsAt) : null)
    console.log('Saving alert:', {
      postImmediately: form.postImmediately,
      startsAtInput: form.startsAt,
      startsAtConverted: startsAtValue,
    })

    setSaving(true)

    const url = isNew ? '/api/admin/content' : `/api/admin/content/${params.id}`
    const method = isNew ? 'POST' : 'PUT'

    // Format fields for API - convert PT times to UTC
    const formattedFields = {
      title: form.title,
      message: form.message,
      severity: form.severity,
      link: form.link || null,
      linkText: form.linkText || null,
      dismissible: form.dismissible,
      active: true, // Always active - visibility controlled by startsAt/expiresAt
      startsAt: form.postImmediately ? null : (form.startsAt ? ptToUTC(form.startsAt) : null),
      expiresAt: form.expiresAt ? ptToUTC(form.expiresAt) : null,
      priority: form.priority,
    }

    const body = isNew
      ? { contentType: 'alert', fields: formattedFields }
      : { fields: formattedFields }

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    router.push('/admin/alerts')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-100"><div className="text-gray-500">Loading...</div></div>

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-navy-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/admin/alerts" className="text-white/60 hover:text-white">← Back</Link>
          <h1 className="font-bold">{isNew ? 'Add Alert' : 'Edit Alert'}</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
              placeholder="e.g., City Hall Closure"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
            <textarea
              rows={3}
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
              placeholder="The full alert message that will be displayed to users"
            />
          </div>

          {/* Severity and Priority */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Severity *</label>
              <select
                value={form.severity}
                onChange={(e) => setForm({ ...form, severity: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
              >
                <option value="info">Info (Blue)</option>
                <option value="warning">Warning (Gold)</option>
                <option value="critical">Critical (Red)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Critical alerts are announced immediately to screen readers
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <input
                type="number"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: parseInt(e.target.value) || 10 })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                min="1"
                max="100"
              />
              <p className="text-xs text-gray-500 mt-1">
                Higher priority alerts appear first (1-100)
              </p>
            </div>
          </div>

          {/* Link */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link URL (optional)</label>
              <input
                type="url"
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link Text (optional)</label>
              <input
                type="text"
                value={form.linkText}
                onChange={(e) => setForm({ ...form, linkText: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                placeholder="Learn more"
              />
            </div>
          </div>

          {/* Posting Options */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setForm({ ...form, postImmediately: true })}
                className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                  form.postImmediately
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`font-medium ${form.postImmediately ? 'text-emerald-700' : 'text-gray-800'}`}>
                  Post Immediately
                </div>
                <div className="text-sm text-gray-500 mt-1">Alert goes live right away</div>
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, postImmediately: false })}
                className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                  !form.postImmediately
                    ? 'border-gold-500 bg-gold-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`font-medium ${!form.postImmediately ? 'text-gold-700' : 'text-gray-800'}`}>
                  Schedule
                </div>
                <div className="text-sm text-gray-500 mt-1">Set a future start date/time</div>
              </button>
            </div>
          </div>

          {/* Scheduling */}
          <div className={`rounded-lg p-4 ${!form.postImmediately ? 'bg-gold-50 border border-gold-200' : 'bg-gray-50'}`}>
            <h3 className="text-sm font-medium text-gray-800 mb-3">
              {form.postImmediately ? 'Expiration (optional)' : 'Schedule'}
            </h3>
            <div className={`grid gap-6 ${form.postImmediately ? 'grid-cols-1' : 'grid-cols-2'}`}>
              {!form.postImmediately && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date & Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={form.startsAt}
                    onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent font-sans text-gray-800"
                    required={!form.postImmediately}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Alert will go live at this time (PT)
                  </p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiration Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={form.expiresAt}
                  onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent font-sans text-gray-800"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Alert will automatically hide after this time in PT (leave empty for no expiration)
                </p>
              </div>
            </div>
          </div>

          {/* Options */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.dismissible}
                onChange={(e) => setForm({ ...form, dismissible: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-navy-600 focus:ring-navy-500"
              />
              <div>
                <div className="font-medium text-gray-800">Dismissible</div>
                <div className="text-sm text-gray-500">Allow users to close this alert</div>
              </div>
            </label>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
            <div className={`rounded-lg text-white p-4 ${
              form.severity === 'critical' ? 'bg-red-600' :
              form.severity === 'warning' ? 'bg-gold-600' :
              'bg-navy-600'
            }`}>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 mt-0.5">
                  {form.severity === 'warning' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </span>
                <div className="flex-1">
                  <p className="font-semibold">{form.title || 'Alert Title'}</p>
                  <p className="text-sm text-white/90 mt-0.5">{form.message || 'Alert message will appear here...'}</p>
                  {form.link && (
                    <span className="inline-flex items-center gap-1 text-sm font-medium mt-2 underline">
                      {form.linkText || 'Learn more'}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  )}
                </div>
                {form.dismissible && (
                  <span className="flex-shrink-0 p-1 hover:bg-white/20 rounded">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-navy-700 hover:bg-navy-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Alert'}
            </button>
            <Link href="/admin/alerts" className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}

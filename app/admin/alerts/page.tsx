'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Permission } from '@/lib/auth'

export default function AdminAlerts() {
  const [entries, setEntries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [permissions, setPermissions] = useState<Permission>({
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canPublish: false,
    canManageUsers: false,
    canViewAnalytics: false,
  })
  const router = useRouter()

  useEffect(() => {
    fetch('/api/admin/check')
      .then(res => {
        if (!res.ok) router.push('/admin')
        else return res.json()
      })
      .then(data => {
        if (data?.user?.permissions) {
          setPermissions(data.user.permissions)
        }
        loadEntries()
      })
      .catch(() => router.push('/admin'))
  }, [router])

  const loadEntries = async () => {
    const res = await fetch('/api/admin/content?type=alert')
    const data = await res.json()
    setEntries(data.entries || [])
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this alert?')) return
    setDeleting(id)
    await fetch(`/api/admin/content/${id}`, { method: 'DELETE' })
    loadEntries()
    setDeleting(null)
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">Critical</span>
      case 'warning':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gold-100 text-gold-700">Warning</span>
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-navy-100 text-navy-700">Info</span>
    }
  }

  const getStatusBadge = (entry: any) => {
    const fields = entry.fields
    const startsAt = fields.startsAt?.['en-US']
    const expiresAt = fields.expiresAt?.['en-US']
    const now = new Date()

    // Check if expired first
    if (expiresAt && new Date(expiresAt) < now) {
      return (
        <div>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Expired</span>
          <div className="text-xs text-gray-500 mt-1">
            {new Date(expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
          </div>
        </div>
      )
    }

    // Check if scheduled (has a future start date)
    if (startsAt && new Date(startsAt) > now) {
      return (
        <div>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gold-100 text-gold-700">Scheduled</span>
          <div className="text-xs text-gold-600 mt-1">
            {new Date(startsAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
          </div>
        </div>
      )
    }

    // Otherwise it's active
    return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">Active</span>
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-100"><div className="text-gray-500">Loading...</div></div>

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-navy-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="text-white/60 hover:text-white">← Back</Link>
            <h1 className="font-bold">Site Alerts</h1>
          </div>
          {permissions.canCreate && (
            <Link href="/admin/alerts/new" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 rounded-lg text-sm font-medium transition-colors">+ Add Alert</Link>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Title</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Severity</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Expires</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Priority</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Edited</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {entries.map((entry) => {
                const fields = entry.fields
                const expiresAt = fields.expiresAt?.['en-US']
                const startsAt = fields.startsAt?.['en-US']
                const now = new Date()
                const isExpired = expiresAt && new Date(expiresAt) < now
                const isScheduled = startsAt && new Date(startsAt) > now
                const dimmed = isExpired

                return (
                  <tr key={entry.sys.id} className={`hover:bg-gray-50 ${dimmed ? 'opacity-60' : ''}`}>
                    <td className="px-6 py-4">
                      <div className={`font-medium ${dimmed ? 'text-gray-500' : 'text-gray-800'}`}>
                        {fields.title?.['en-US']}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {fields.message?.['en-US']}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getSeverityBadge(fields.severity?.['en-US'])}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(entry)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {expiresAt
                        ? new Date(expiresAt).toLocaleString('en-US', { timeZone: 'America/Los_Angeles', month: 'short', day: 'numeric', year: 'numeric' })
                        : 'Never'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {fields.priority?.['en-US'] || '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {entry.sys.updatedAt && (
                        <div>
                          <div>{new Date(entry.sys.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'America/Los_Angeles' })}</div>
                          <div className="text-xs text-gray-400">{new Date(entry.sys.updatedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Los_Angeles' })}</div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {permissions.canEdit && (
                        <Link href={`/admin/alerts/${entry.sys.id}`} className="text-navy-600 hover:text-navy-800 text-sm font-medium mr-4">Edit</Link>
                      )}
                      {permissions.canDelete && (
                        <button onClick={() => handleDelete(entry.sys.id)} disabled={deleting === entry.sys.id} className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50">{deleting === entry.sys.id ? 'Deleting...' : 'Delete'}</button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {entries.length === 0 && <div className="text-center py-12 text-gray-500">No alerts yet. Create one to display site-wide notifications.</div>}
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-navy-50 border border-navy-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-navy-800 mb-2">About Site Alerts</h3>
          <ul className="text-sm text-navy-700 space-y-1">
            <li>• <strong>Critical</strong> alerts appear in red and are announced to screen readers immediately</li>
            <li>• <strong>Warning</strong> alerts appear in gold for important but non-urgent notices</li>
            <li>• <strong>Info</strong> alerts appear in blue for general announcements</li>
            <li>• Use <strong>Start Date</strong> to schedule alerts for future display</li>
            <li>• Use <strong>Expiration</strong> to automatically hide alerts after a certain date</li>
            <li>• Higher <strong>priority</strong> numbers appear first when multiple alerts are active</li>
          </ul>
        </div>
      </main>
    </div>
  )
}

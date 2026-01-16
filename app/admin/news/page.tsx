'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Permission } from '@/lib/auth'

export default function AdminNews() {
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
    const res = await fetch('/api/admin/content?type=news')
    const data = await res.json()
    setEntries(data.entries || [])
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this news article?')) return
    setDeleting(id)
    await fetch(`/api/admin/content/${id}`, { method: 'DELETE' })
    loadEntries()
    setDeleting(null)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-100"><div className="text-gray-500">Loading...</div></div>

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-navy-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="text-white/60 hover:text-white">← Back</Link>
            <h1 className="font-bold">News</h1>
          </div>
          {permissions.canCreate && (
            <Link href="/admin/news/new" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 rounded-lg text-sm font-medium transition-colors">+ Add Article</Link>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Title</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Category</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Date</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {entries.map((entry) => {
                const fields = entry.fields
                const rawStatus = fields.status?.['en-US'] || 'published'
                const scheduledDate = fields.scheduledPublish?.['en-US']
                // Determine effective status - if scheduled and time has passed, it's effectively published
                const isScheduledAndPast = rawStatus === 'scheduled' && scheduledDate && new Date(scheduledDate) <= new Date()
                const effectiveStatus = isScheduledAndPast ? 'published' : rawStatus
                const isNotPublished = effectiveStatus !== 'published'
                return (
                  <tr key={entry.sys.id} className={`hover:bg-gray-50 ${isNotPublished ? 'opacity-60' : ''}`}>
                    <td className="px-6 py-4"><div className={`font-medium ${isNotPublished ? 'text-gray-500' : 'text-gray-800'}`}>{fields.title?.['en-US']}</div></td>
                    <td className="px-6 py-4">
                      {effectiveStatus === 'draft' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Draft</span>
                      )}
                      {effectiveStatus === 'scheduled' && (
                        <div>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gold-100 text-gold-700">
                            Scheduled
                          </span>
                          {scheduledDate && (
                            <div className="text-xs text-gold-600 mt-1">
                              {new Date(scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(scheduledDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Los_Angeles' })} PT
                            </div>
                          )}
                        </div>
                      )}
                      {effectiveStatus === 'published' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">Published</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{fields.category?.['en-US']}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{fields.publishDate?.['en-US']}</td>
                    <td className="px-6 py-4 text-right">
                      {permissions.canEdit && (
                        <Link href={`/admin/news/${entry.sys.id}`} className="text-navy-600 hover:text-navy-800 text-sm font-medium mr-4">Edit</Link>
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
          {entries.length === 0 && <div className="text-center py-12 text-gray-500">No news articles yet.</div>}
        </div>
      </main>
    </div>
  )
}

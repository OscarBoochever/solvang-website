'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminPages() {
  const [entries, setEntries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/admin/check')
      .then(res => {
        if (!res.ok) router.push('/admin')
        else loadEntries()
      })
      .catch(() => router.push('/admin'))
  }, [router])

  const loadEntries = async () => {
    const res = await fetch('/api/admin/content?type=page')
    const data = await res.json()
    setEntries(data.entries || [])
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return
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
            <h1 className="font-bold">Pages</h1>
          </div>
          <Link href="/admin/pages/new" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 rounded-lg text-sm font-medium transition-colors">+ Add Page</Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Title</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">URL</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {entries.map((entry) => {
                const fields = entry.fields
                return (
                  <tr key={entry.sys.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4"><div className="font-medium text-gray-800">{fields.title?.['en-US']}</div></td>
                    <td className="px-6 py-4 text-sm text-gray-500">/{fields.slug?.['en-US']}</td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/pages/${entry.sys.id}`} className="text-navy-600 hover:text-navy-800 text-sm font-medium mr-4">Edit</Link>
                      <button onClick={() => handleDelete(entry.sys.id)} disabled={deleting === entry.sys.id} className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50">{deleting === entry.sys.id ? 'Deleting...' : 'Delete'}</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {entries.length === 0 && <div className="text-center py-12 text-gray-500">No pages yet.</div>}
        </div>
      </main>
    </div>
  )
}

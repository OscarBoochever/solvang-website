'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Permission, roleDisplayNames, Role } from '@/lib/auth'

interface UserInfo {
  name: string
  email?: string
  role: Role
  permissions: Permission
}

const contentTypes = [
  {
    id: 'department',
    name: 'Departments',
    description: 'Manage city department information',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    color: 'bg-navy-100 text-navy-700',
    requiresPermission: 'canEdit' as keyof Permission,
  },
  {
    id: 'page',
    name: 'Pages',
    description: 'Edit site pages like Contact, Privacy, etc.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    color: 'bg-emerald-100 text-emerald-700',
    requiresPermission: 'canEdit' as keyof Permission,
  },
  {
    id: 'news',
    name: 'News',
    description: 'Publish news articles and announcements',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
    color: 'bg-gold-100 text-gold-700',
    requiresPermission: 'canEdit' as keyof Permission,
  },
  {
    id: 'event',
    name: 'Events',
    description: 'Manage meetings and community events',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    color: 'bg-sky-100 text-sky-700',
    requiresPermission: 'canEdit' as keyof Permission,
  },
]

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<UserInfo | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/admin/check')
      .then(res => {
        if (!res.ok) {
          router.push('/admin')
        } else {
          return res.json()
        }
      })
      .then(data => {
        if (data?.user) {
          setUser(data.user)
        }
        setLoading(false)
      })
      .catch(() => router.push('/admin'))
  }, [router])

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  const permissions = user?.permissions || {
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canPublish: false,
    canManageUsers: false,
    canViewAnalytics: false,
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-navy-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 4l5 5M15 15l5 5M20 4l-5 5M9 15l-5 5" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <div>
              <h1 className="font-bold">Solvang Admin</h1>
              <p className="text-xs text-white/60">Content Management</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-white/80 hover:text-white transition-colors">
              View Site →
            </Link>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium">{user?.name || 'Admin'}</div>
                <div className="text-xs text-white/60">
                  {user?.role ? roleDisplayNames[user.role] : 'Administrator'}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Welcome back, {user?.name?.split(' ')[0] || 'Admin'}!</h2>
          <p className="text-gray-600">
            {permissions.canEdit
              ? 'Manage your website content below.'
              : 'View website content and analytics below.'}
          </p>
        </div>

        {/* Role Badge */}
        <div className="mb-6 flex flex-wrap gap-2">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
            user?.role === 'super_admin' ? 'bg-purple-100 text-purple-700' :
            user?.role === 'admin' ? 'bg-navy-100 text-navy-700' :
            user?.role === 'editor' ? 'bg-emerald-100 text-emerald-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            {user?.role ? roleDisplayNames[user.role] : 'Unknown Role'}
          </span>

          {/* Permission badges */}
          {permissions.canCreate && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-emerald-50 text-emerald-600">
              Create
            </span>
          )}
          {permissions.canEdit && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-600">
              Edit
            </span>
          )}
          {permissions.canDelete && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-50 text-red-600">
              Delete
            </span>
          )}
          {permissions.canPublish && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gold-50 text-gold-600">
              Publish
            </span>
          )}
        </div>

        {/* Content Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contentTypes.map((type) => {
            const plural = type.id === 'news' ? 'news' : `${type.id}s`
            const hasPermission = permissions[type.requiresPermission]
            const isViewOnly = !permissions.canEdit

            return (
              <Link
                key={type.id}
                href={`/admin/${plural}`}
                className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group ${
                  isViewOnly ? 'opacity-75' : ''
                }`}
              >
                <div className={`w-14 h-14 ${type.color} rounded-xl flex items-center justify-center mb-4`}>
                  {type.icon}
                </div>
                <h3 className="font-semibold text-gray-800 group-hover:text-navy-600 transition-colors">
                  {type.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                {isViewOnly && (
                  <span className="inline-block mt-2 text-xs text-gray-400">View only</span>
                )}
              </Link>
            )
          })}
        </div>

        {/* Admin-only sections */}
        {permissions.canManageUsers && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Administration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-purple-500">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-800">User Management</h4>
                </div>
                <p className="text-sm text-gray-500">Manage user accounts and permissions</p>
                <p className="text-xs text-gray-400 mt-2">Coming soon - database integration required</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-amber-500">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-800">Site Alerts</h4>
                </div>
                <p className="text-sm text-gray-500">Manage emergency and informational alerts</p>
                <p className="text-xs text-gray-400 mt-2">Edit lib/alerts.ts or integrate with CMS</p>
              </div>
            </div>
          </div>
        )}

        {/* Analytics section */}
        {permissions.canViewAnalytics && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Analytics</h3>
            <Link
              href="/admin/analytics"
              className="block bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800 group-hover:text-navy-600 transition-colors">Site Statistics</h4>
              </div>
              <p className="text-sm text-gray-500">
                View visitor statistics, top pages, traffic sources, and more.
              </p>
              <p className="text-xs text-sky-600 mt-2 group-hover:underline">View Analytics →</p>
            </Link>
          </div>
        )}

        {/* Quick Tips */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">Quick Tips</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            {permissions.canEdit && (
              <>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  Changes are published immediately after saving.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  The AI assistant automatically learns from your content updates.
                </li>
              </>
            )}
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5">✓</span>
              Use the &quot;View Site&quot; link to preview your changes.
            </li>
            {permissions.canPublish && (
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">✓</span>
                Schedule content to appear later by setting status to &quot;Scheduled&quot; and choosing a date/time.
              </li>
            )}
            {!permissions.canEdit && (
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">ℹ</span>
                You have view-only access. Contact an administrator to request edit permissions.
              </li>
            )}
          </ul>
        </div>
      </main>
    </div>
  )
}

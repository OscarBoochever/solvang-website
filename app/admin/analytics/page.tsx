'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface AnalyticsData {
  today: {
    activeUsers: number
    sessions: number
    pageViews: number
    avgSessionDuration: number
  }
  last7Days: {
    activeUsers: number
    sessions: number
    pageViews: number
    avgSessionDuration: number
    bounceRate?: number
  }
  last30Days: {
    activeUsers: number
    sessions: number
    pageViews: number
  }
  topPages: { path: string; views: number }[]
  trafficSources: { source: string; sessions: number }[]
  dailyVisitors: { date: string; users: number; sessions: number }[]
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}m ${secs}s`
}

function formatDate(dateStr: string): string {
  // Format: YYYYMMDD to Mon DD
  const year = dateStr.slice(0, 4)
  const month = dateStr.slice(4, 6)
  const day = dateStr.slice(6, 8)
  const date = new Date(`${year}-${month}-${day}`)
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/admin/check')
      .then(res => {
        if (!res.ok) router.push('/admin')
        else loadAnalytics()
      })
      .catch(() => router.push('/admin'))
  }, [router])

  const loadAnalytics = async () => {
    try {
      const res = await fetch('/api/admin/analytics')
      const result = await res.json()

      if (!res.ok) {
        setError(result.message || result.error || 'Failed to load analytics')
      } else {
        setData(result)
      }
    } catch {
      setError('Failed to connect to analytics service')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-navy-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="text-white/60 hover:text-white">
              ← Back
            </Link>
            <h1 className="font-bold">Site Analytics</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {error ? (
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Analytics Not Configured</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="bg-gray-50 rounded-lg p-4 text-left text-sm">
                <p className="font-medium text-gray-700 mb-2">To enable analytics, you need to:</p>
                <ol className="list-decimal list-inside space-y-1 text-gray-600">
                  <li>Create a Google Analytics 4 property</li>
                  <li>Set up a Google Cloud service account</li>
                  <li>Add the required environment variables</li>
                </ol>
                <p className="mt-3 text-gray-500">See the setup guide for details.</p>
              </div>
            </div>
          </div>
        ) : data ? (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-500">Today's Visitors</span>
                </div>
                <div className="text-3xl font-bold text-gray-800">{data.today.activeUsers.toLocaleString()}</div>
                <div className="text-sm text-gray-500 mt-1">{data.today.sessions} sessions</div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-500">Page Views (7d)</span>
                </div>
                <div className="text-3xl font-bold text-gray-800">{data.last7Days.pageViews.toLocaleString()}</div>
                <div className="text-sm text-gray-500 mt-1">{data.last30Days.pageViews.toLocaleString()} last 30d</div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-500">Avg. Session</span>
                </div>
                <div className="text-3xl font-bold text-gray-800">{formatDuration(data.last7Days.avgSessionDuration)}</div>
                <div className="text-sm text-gray-500 mt-1">last 7 days</div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-500">Bounce Rate</span>
                </div>
                <div className="text-3xl font-bold text-gray-800">
                  {data.last7Days.bounceRate !== undefined ? `${(data.last7Days.bounceRate * 100).toFixed(1)}%` : 'N/A'}
                </div>
                <div className="text-sm text-gray-500 mt-1">last 7 days</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Daily Visitors Chart */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4">Daily Visitors (Last 7 Days)</h3>
                <div className="space-y-3">
                  {data.dailyVisitors.map((day, index) => {
                    const maxUsers = Math.max(...data.dailyVisitors.map(d => d.users))
                    const percentage = maxUsers > 0 ? (day.users / maxUsers) * 100 : 0
                    return (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-20 text-sm text-gray-500">{formatDate(day.date)}</div>
                        <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-sky-500 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="w-12 text-sm text-gray-600 text-right">{day.users}</div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Traffic Sources */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4">Traffic Sources (Last 7 Days)</h3>
                <div className="space-y-3">
                  {data.trafficSources.length > 0 ? (
                    data.trafficSources.map((source, index) => {
                      const totalSessions = data.trafficSources.reduce((acc, s) => acc + s.sessions, 0)
                      const percentage = totalSessions > 0 ? (source.sessions / totalSessions) * 100 : 0
                      const colors = ['bg-sky-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500', 'bg-rose-500']
                      return (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-24 text-sm text-gray-600 truncate" title={source.source}>
                            {source.source || 'Direct'}
                          </div>
                          <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${colors[index % colors.length]} rounded-full transition-all`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <div className="w-16 text-sm text-gray-600 text-right">
                            {percentage.toFixed(1)}%
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-gray-500 text-sm">No traffic data available</p>
                  )}
                </div>
              </div>
            </div>

            {/* Top Pages */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Top Pages (Last 7 Days)</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 text-sm font-medium text-gray-500">Page</th>
                      <th className="text-right py-2 text-sm font-medium text-gray-500">Views</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topPages.length > 0 ? (
                      data.topPages.map((page, index) => (
                        <tr key={index} className="border-b last:border-0">
                          <td className="py-3 text-sm text-gray-800">{page.path}</td>
                          <td className="py-3 text-sm text-gray-600 text-right">{page.views.toLocaleString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="py-4 text-center text-gray-500 text-sm">
                          No page data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : null}
      </main>
    </div>
  )
}

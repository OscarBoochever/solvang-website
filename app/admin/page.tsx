'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [showDemoUsers, setShowDemoUsers] = useState(false)
  const router = useRouter()

  // Check if already logged in
  useEffect(() => {
    fetch('/api/admin/check')
      .then(res => {
        if (res.ok) {
          router.push('/admin/dashboard')
        } else {
          setLoading(false)
        }
      })
      .catch(() => setLoading(false))
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (res.ok) {
        router.push('/admin/dashboard')
      } else {
        setError(data.error || 'Invalid credentials')
      }
    } catch {
      setError('Login failed. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-navy-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 text-white" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 4l5 5M15 15l5 5M20 4l-5 5M9 15l-5 5" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-navy-800">City of Solvang</h1>
          <p className="text-gray-500 text-sm mt-1">Employee Portal</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
              placeholder="Enter your username"
              autoComplete="username"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 px-4 bg-navy-700 hover:bg-navy-600 text-white font-medium rounded-lg transition-colors"
          >
            Sign In
          </button>
        </form>

        {/* Demo credentials for review */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setShowDemoUsers(!showDemoUsers)}
            className="w-full text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1"
          >
            <span>Demo accounts for testing</span>
            <svg className={`w-4 h-4 transition-transform ${showDemoUsers ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showDemoUsers && (
            <div className="mt-4 space-y-2 text-xs">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-navy-700">Super Admin</div>
                <div className="text-gray-600">admin / admin123</div>
                <div className="text-gray-400">Full access to all features</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-navy-700">Administrator</div>
                <div className="text-gray-600">cityclerk / clerk123</div>
                <div className="text-gray-400">Can create, edit, delete, publish</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-navy-700">Editor</div>
                <div className="text-gray-600">editor / editor123</div>
                <div className="text-gray-400">Can create and edit content</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-navy-700">Viewer</div>
                <div className="text-gray-600">viewer / viewer123</div>
                <div className="text-gray-400">Read-only access</div>
              </div>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400 text-center mt-6">
          For employee access only. Contact IT for assistance.
        </p>
      </div>
    </div>
  )
}

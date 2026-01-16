'use client'

import { useState } from 'react'
import Translated from '@/components/Translated'

interface FormData {
  name: string
  email: string
  phone: string
  department: string
  subject: string
  message: string
}

const initialFormData: FormData = {
  name: '',
  email: '',
  phone: '',
  department: '',
  subject: '',
  message: '',
}

const departments = [
  'General Inquiry',
  'City Manager',
  'City Clerk',
  'Finance',
  'Planning & Building',
  'Public Works',
  'Police Department',
  'Fire Department',
  'Parks & Recreation',
  'Other',
]

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit form')
      }

      setStatus('success')
      setFormData(initialFormData)
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center">
        <svg
          className="w-12 h-12 text-emerald-500 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-lg font-semibold text-emerald-800 mb-2">
          <Translated>Message Sent Successfully</Translated>
        </h3>
        <p className="text-emerald-700 mb-4">
          <Translated>
            Thank you for contacting the City of Solvang. We will respond to your inquiry within 2-3 business days.
          </Translated>
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="text-emerald-600 font-medium hover:text-emerald-800"
        >
          <Translated>Send another message</Translated>
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <Translated>{errorMessage || 'An error occurred. Please try again.'}</Translated>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            <Translated>Full Name</Translated> <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            <Translated>Email Address</Translated> <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            <Translated>Phone Number</Translated>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
          />
        </div>

        {/* Department */}
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
            <Translated>Department</Translated> <span className="text-red-500">*</span>
          </label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 bg-white"
          >
            <option value="">Select a department...</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
          <Translated>Subject</Translated> <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
        />
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          <Translated>Message</Translated> <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 resize-y"
        />
      </div>

      {/* Submit */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          <span className="text-red-500">*</span> <Translated>Required fields</Translated>
        </p>
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="btn bg-navy-600 text-white hover:bg-navy-700 disabled:bg-navy-400 px-6 py-3 flex items-center gap-2"
        >
          {status === 'submitting' ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <Translated>Sending...</Translated>
            </>
          ) : (
            <Translated>Send Message</Translated>
          )}
        </button>
      </div>
    </form>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Translated from '@/components/Translated'
import { useLanguage } from '@/lib/LanguageContext'

interface FormData {
  name: string
  email: string
  phone: string
  category: string
  location: string
  description: string
}

const initialFormData: FormData = {
  name: '',
  email: '',
  phone: '',
  category: '',
  location: '',
  description: '',
}

const categories = [
  'Pothole / Road Damage',
  'Streetlight Outage',
  'Water Leak',
  'Sewer Issue',
  'Sidewalk Damage',
  'Traffic Sign / Signal',
  'Graffiti',
  'Code Violation',
  'Illegal Dumping',
  'Tree / Vegetation',
  'Drainage / Flooding',
  'Other',
]

export default function ReportConcernForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const { language, translate } = useLanguage()

  // Translated options and placeholders
  const [translatedCategories, setTranslatedCategories] = useState<string[]>(categories)
  const [placeholders, setPlaceholders] = useState({
    selectCategory: 'Select a category...',
    optional: 'Optional',
    followUp: 'For follow-up (optional)',
    location: 'Street address or nearest cross streets',
    description: 'Please describe the issue in detail...',
  })

  // Translate dropdown options and placeholders when language changes
  useEffect(() => {
    if (language === 'en') {
      setTranslatedCategories(categories)
      setPlaceholders({
        selectCategory: 'Select a category...',
        optional: 'Optional',
        followUp: 'For follow-up (optional)',
        location: 'Street address or nearest cross streets',
        description: 'Please describe the issue in detail...',
      })
      return
    }

    // Translate categories
    Promise.all(categories.map(cat => translate(cat)))
      .then(setTranslatedCategories)

    // Translate placeholders
    Promise.all([
      translate('Select a category...'),
      translate('Optional'),
      translate('For follow-up (optional)'),
      translate('Street address or nearest cross streets'),
      translate('Please describe the issue in detail...'),
    ]).then(([selectCategory, optional, followUp, location, description]) => {
      setPlaceholders({ selectCategory, optional, followUp, location, description })
    })
  }, [language, translate])

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
      const response = await fetch('/api/report-concern', {
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
          <Translated>Report Submitted Successfully</Translated>
        </h3>
        <p className="text-emerald-700 mb-4">
          <Translated>
            Thank you for reporting this concern. Public Works will review your submission and take appropriate action. For urgent issues, please call (805) 688-5575.
          </Translated>
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="text-emerald-600 font-medium hover:text-emerald-800"
        >
          <Translated>Submit another report</Translated>
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
            <Translated>Your Name</Translated>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
            placeholder={placeholders.optional}
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            <Translated>Email Address</Translated>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
            placeholder={placeholders.followUp}
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
            placeholder={placeholders.followUp}
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            <Translated>Type of Concern</Translated> <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 bg-white"
          >
            <option value="">{placeholders.selectCategory}</option>
            {categories.map((cat, index) => (
              <option key={cat} value={cat}>
                {translatedCategories[index]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
          <Translated>Location</Translated> <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          placeholder={placeholders.location}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          <Translated>Please be as specific as possible to help us locate the issue.</Translated>
        </p>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          <Translated>Description</Translated> <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={5}
          placeholder={placeholders.description}
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
          className="btn bg-burgundy-600 text-white hover:bg-burgundy-700 disabled:bg-burgundy-400 px-6 py-3 flex items-center gap-2"
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
              <Translated>Submitting...</Translated>
            </>
          ) : (
            <Translated>Submit Report</Translated>
          )}
        </button>
      </div>
    </form>
  )
}

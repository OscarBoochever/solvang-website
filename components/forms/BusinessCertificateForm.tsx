'use client'

import { useState, useEffect } from 'react'
import Translated from '@/components/Translated'
import { useLanguage } from '@/lib/LanguageContext'

interface FormData {
  businessName: string
  ownerName: string
  email: string
  phone: string
  businessType: string
  businessAddress: string
  mailingAddress: string
  startDate: string
  description: string
}

const initialFormData: FormData = {
  businessName: '',
  ownerName: '',
  email: '',
  phone: '',
  businessType: '',
  businessAddress: '',
  mailingAddress: '',
  startDate: '',
  description: '',
}

const businessTypes = [
  'Retail Store',
  'Restaurant / Food Service',
  'Professional Services',
  'Lodging / Hotel / Inn',
  'Wine Tasting Room',
  'Personal Services (Salon, Spa, etc.)',
  'Entertainment / Recreation',
  'Construction / Contractor',
  'Home-Based Business',
  'Non-Profit Organization',
  'Other',
]

export default function BusinessCertificateForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const { language, translate } = useLanguage()

  // Translated options and placeholders
  const [translatedTypes, setTranslatedTypes] = useState<string[]>(businessTypes)
  const [placeholders, setPlaceholders] = useState({
    selectType: 'Select business type...',
    businessAddress: 'Street address in Solvang',
    mailingAddress: 'If different from business address',
    description: 'Briefly describe your business activities, products, or services...',
  })

  // Translate dropdown options and placeholders when language changes
  useEffect(() => {
    if (language === 'en') {
      setTranslatedTypes(businessTypes)
      setPlaceholders({
        selectType: 'Select business type...',
        businessAddress: 'Street address in Solvang',
        mailingAddress: 'If different from business address',
        description: 'Briefly describe your business activities, products, or services...',
      })
      return
    }

    // Translate business types
    Promise.all(businessTypes.map(type => translate(type)))
      .then(setTranslatedTypes)

    // Translate placeholders
    Promise.all([
      translate('Select business type...'),
      translate('Street address in Solvang'),
      translate('If different from business address'),
      translate('Briefly describe your business activities, products, or services...'),
    ]).then(([selectType, businessAddress, mailingAddress, description]) => {
      setPlaceholders({ selectType, businessAddress, mailingAddress, description })
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
      const response = await fetch('/api/business-certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit application')
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
          <Translated>Application Submitted Successfully</Translated>
        </h3>
        <p className="text-emerald-700 mb-4">
          <Translated>
            Thank you for your business certificate application. Our Finance Department will review your submission and contact you within 3-5 business days. For questions, call (805) 688-5575.
          </Translated>
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="text-emerald-600 font-medium hover:text-emerald-800"
        >
          <Translated>Submit another application</Translated>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden">
        {/* Business Name */}
        <div>
          <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
            <Translated>Business Name</Translated> <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
          />
        </div>

        {/* Owner Name */}
        <div>
          <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-1">
            <Translated>Owner / Applicant Name</Translated> <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="ownerName"
            name="ownerName"
            value={formData.ownerName}
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
            <Translated>Phone Number</Translated> <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
          />
        </div>

        {/* Business Type */}
        <div>
          <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-1">
            <Translated>Type of Business</Translated> <span className="text-red-500">*</span>
          </label>
          <select
            id="businessType"
            name="businessType"
            value={formData.businessType}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 bg-white"
          >
            <option value="">{placeholders.selectType}</option>
            {businessTypes.map((type, index) => (
              <option key={type} value={type}>
                {translatedTypes[index]}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div className="min-w-0 overflow-hidden">
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            <Translated>Proposed Start Date</Translated> <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="w-full min-w-0 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 box-border"
            style={{ maxWidth: '100%' }}
          />
        </div>
      </div>

      {/* Business Address */}
      <div>
        <label htmlFor="businessAddress" className="block text-sm font-medium text-gray-700 mb-1">
          <Translated>Business Location Address</Translated> <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="businessAddress"
          name="businessAddress"
          value={formData.businessAddress}
          onChange={handleChange}
          required
          placeholder={placeholders.businessAddress}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
        />
      </div>

      {/* Mailing Address */}
      <div>
        <label htmlFor="mailingAddress" className="block text-sm font-medium text-gray-700 mb-1">
          <Translated>Mailing Address</Translated>
        </label>
        <input
          type="text"
          id="mailingAddress"
          name="mailingAddress"
          value={formData.mailingAddress}
          onChange={handleChange}
          placeholder={placeholders.mailingAddress}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          <Translated>Business Description</Translated> <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
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
              <Translated>Submitting...</Translated>
            </>
          ) : (
            <Translated>Submit Application</Translated>
          )}
        </button>
      </div>
    </form>
  )
}

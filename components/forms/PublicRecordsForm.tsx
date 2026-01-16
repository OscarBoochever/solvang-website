'use client'

import { useState } from 'react'
import Translated from '@/components/Translated'

interface FormData {
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  recordsDescription: string
  dateRangeStart: string
  dateRangeEnd: string
  purpose: string
  preferredFormat: string
}

const initialFormData: FormData = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: 'CA',
  zip: '',
  recordsDescription: '',
  dateRangeStart: '',
  dateRangeEnd: '',
  purpose: '',
  preferredFormat: 'electronic',
}

const formatOptions = [
  { value: 'electronic', label: 'Electronic (PDF)' },
  { value: 'paper', label: 'Paper copies' },
  { value: 'inspection', label: 'In-person inspection' },
]

export default function PublicRecordsForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [referenceId, setReferenceId] = useState('')

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
      const response = await fetch('/api/public-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit request')
      }

      setStatus('success')
      setReferenceId(data.referenceId || '')
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
          <Translated>Request Submitted Successfully</Translated>
        </h3>
        {referenceId && (
          <p className="text-emerald-700 font-medium mb-2">
            <Translated>Reference Number:</Translated> {referenceId}
          </p>
        )}
        <p className="text-emerald-700 mb-4">
          <Translated>
            Your public records request has been received. Per the California Public Records Act,
            we will respond within 10 days. You will receive a confirmation email shortly.
          </Translated>
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="text-emerald-600 font-medium hover:text-emerald-800"
        >
          <Translated>Submit another request</Translated>
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

      {/* Requestor Information */}
      <div>
        <h3 className="text-lg font-semibold text-navy-800 mb-4">
          <Translated>Requestor Information</Translated>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              <Translated>Street Address</Translated>
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              <Translated>City</Translated>
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                <Translated>State</Translated>
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                maxLength={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
              />
            </div>
            <div>
              <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
                <Translated>ZIP Code</Translated>
              </label>
              <input
                type="text"
                id="zip"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                maxLength={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Records Request Details */}
      <div>
        <h3 className="text-lg font-semibold text-navy-800 mb-4">
          <Translated>Records Request Details</Translated>
        </h3>

        <div className="space-y-4">
          <div>
            <label htmlFor="recordsDescription" className="block text-sm font-medium text-gray-700 mb-1">
              <Translated>Description of Records Requested</Translated> <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-2">
              <Translated>
                Please be as specific as possible. Include names, dates, locations, document types, or any other
                identifying information that will help us locate the records.
              </Translated>
            </p>
            <textarea
              id="recordsDescription"
              name="recordsDescription"
              value={formData.recordsDescription}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 resize-y"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="dateRangeStart" className="block text-sm font-medium text-gray-700 mb-1">
                <Translated>Date Range Start</Translated>
              </label>
              <input
                type="date"
                id="dateRangeStart"
                name="dateRangeStart"
                value={formData.dateRangeStart}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
              />
            </div>

            <div>
              <label htmlFor="dateRangeEnd" className="block text-sm font-medium text-gray-700 mb-1">
                <Translated>Date Range End</Translated>
              </label>
              <input
                type="date"
                id="dateRangeEnd"
                name="dateRangeEnd"
                value={formData.dateRangeEnd}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
              <Translated>Purpose of Request</Translated>
            </label>
            <p className="text-xs text-gray-500 mb-2">
              <Translated>Optional - This helps us better understand and fulfill your request.</Translated>
            </p>
            <input
              type="text"
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
            />
          </div>

          <div>
            <label htmlFor="preferredFormat" className="block text-sm font-medium text-gray-700 mb-1">
              <Translated>Preferred Format</Translated>
            </label>
            <select
              id="preferredFormat"
              name="preferredFormat"
              value={formData.preferredFormat}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 bg-white"
            >
              {formatOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Legal Notice */}
      <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
        <p className="font-medium text-gray-700 mb-2">
          <Translated>California Public Records Act Notice</Translated>
        </p>
        <p>
          <Translated>
            Under the California Public Records Act (Government Code Section 6250 et seq.), the City of Solvang
            will respond to your request within 10 calendar days. Some records may be exempt from disclosure.
            Copying fees may apply for paper copies.
          </Translated>
        </p>
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
            <Translated>Submit Request</Translated>
          )}
        </button>
      </div>
    </form>
  )
}

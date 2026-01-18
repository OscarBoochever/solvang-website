'use client'

import { useState, useEffect } from 'react'
import Translated from '@/components/Translated'
import { subscriptionCategories, DeliveryMethod } from '@/lib/subscriptions'
import { useLanguage } from '@/lib/LanguageContext'

export default function SubscriptionForm() {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('email')
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const { language, translate } = useLanguage()

  // Translated placeholder
  const [phonePlaceholder, setPhonePlaceholder] = useState('(555) 555-5555')

  // Translate placeholder when language changes
  useEffect(() => {
    if (language === 'en') {
      setPhonePlaceholder('(555) 555-5555')
      return
    }

    translate('(555) 555-5555').then(setPhonePlaceholder)
  }, [language, translate])

  const toggleCategory = (categoryId: string) => {
    const newSelected = new Set(selectedCategories)
    if (newSelected.has(categoryId)) {
      newSelected.delete(categoryId)
    } else {
      newSelected.add(categoryId)
    }
    setSelectedCategories(newSelected)
  }

  const selectAll = () => {
    setSelectedCategories(new Set(subscriptionCategories.map((c) => c.id)))
  }

  const clearAll = () => {
    setSelectedCategories(new Set())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    // Validation
    if (!email) {
      setErrorMessage('Email address is required')
      setStatus('error')
      return
    }

    if ((deliveryMethod === 'sms' || deliveryMethod === 'both') && !phone) {
      setErrorMessage('Phone number is required for SMS notifications')
      setStatus('error')
      return
    }

    if (selectedCategories.size === 0) {
      setErrorMessage('Please select at least one notification category')
      setStatus('error')
      return
    }

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          phone: phone || undefined,
          deliveryMethod,
          categories: Array.from(selectedCategories),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe')
      }

      setStatus('success')
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
          <Translated>Subscription Confirmed!</Translated>
        </h3>
        <p className="text-emerald-700 mb-4">
          <Translated>You have been subscribed to</Translated> {selectedCategories.size} <Translated>notification categories.</Translated>
          {' '}<Translated>A confirmation email has been sent to</Translated> {email}.
        </p>
        <button
          onClick={() => {
            setStatus('idle')
            setEmail('')
            setPhone('')
            setSelectedCategories(new Set())
          }}
          className="text-emerald-600 font-medium hover:text-emerald-800"
        >
          <Translated>Manage another subscription</Translated>
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

      {/* Contact Information */}
      <div>
        <h3 className="text-lg font-semibold text-navy-800 mb-4">
          <Translated>Contact Information</Translated>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              <Translated>Email Address</Translated> <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              <Translated>Phone Number</Translated>
              {(deliveryMethod === 'sms' || deliveryMethod === 'both') && (
                <span className="text-red-500"> *</span>
              )}
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={phonePlaceholder}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
            />
          </div>
        </div>
      </div>

      {/* Delivery Method */}
      <div>
        <h3 className="text-lg font-semibold text-navy-800 mb-4">
          <Translated>Delivery Method</Translated>
        </h3>
        <div className="flex flex-wrap gap-4">
          {[
            { value: 'email', label: 'Email Only' },
            { value: 'sms', label: 'SMS Only' },
            { value: 'both', label: 'Email & SMS' },
          ].map((option) => (
            <label
              key={option.value}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer transition-colors ${
                deliveryMethod === option.value
                  ? 'border-navy-500 bg-navy-50 text-navy-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input
                type="radio"
                name="deliveryMethod"
                value={option.value}
                checked={deliveryMethod === option.value}
                onChange={(e) => setDeliveryMethod(e.target.value as DeliveryMethod)}
                className="sr-only"
              />
              <span
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  deliveryMethod === option.value ? 'border-navy-500' : 'border-gray-400'
                }`}
              >
                {deliveryMethod === option.value && (
                  <span className="w-2 h-2 rounded-full bg-navy-500" />
                )}
              </span>
              <Translated>{option.label}</Translated>
            </label>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-navy-800">
            <Translated>Notification Categories</Translated>
          </h3>
          <div className="flex gap-2 text-sm">
            <button
              type="button"
              onClick={selectAll}
              className="text-navy-600 hover:text-navy-800"
            >
              <Translated>Select All</Translated>
            </button>
            <span className="text-gray-300">|</span>
            <button
              type="button"
              onClick={clearAll}
              className="text-navy-600 hover:text-navy-800"
            >
              <Translated>Clear All</Translated>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {subscriptionCategories.map((category) => (
            <label
              key={category.id}
              className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedCategories.has(category.id)
                  ? 'border-navy-500 bg-navy-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedCategories.has(category.id)}
                onChange={() => toggleCategory(category.id)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-navy-600 focus:ring-navy-500"
              />
              <div>
                <div className="font-medium text-gray-900">
                  <Translated>{category.name}</Translated>
                </div>
                <div className="text-sm text-gray-500">
                  <Translated>{category.description}</Translated>
                </div>
              </div>
            </label>
          ))}
        </div>

        <p className="text-sm text-gray-500 mt-2">
          <Translated>Selected:</Translated> {selectedCategories.size} <Translated>of</Translated> {subscriptionCategories.length} <Translated>categories</Translated>
        </p>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-between pt-4 border-t">
        <p className="text-sm text-gray-500">
          <Translated>You can unsubscribe at any time.</Translated>
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
              <Translated>Subscribing...</Translated>
            </>
          ) : (
            <Translated>Subscribe</Translated>
          )}
        </button>
      </div>
    </form>
  )
}

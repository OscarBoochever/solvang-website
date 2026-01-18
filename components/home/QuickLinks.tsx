'use client'

import Link from 'next/link'
import Translated from '@/components/Translated'

const services = [
  {
    name: 'Meeting Agendas',
    description: 'Access council and commission meetings',
    href: '/city-council#agendas--minutes',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    color: 'bg-navy-700 hover:bg-navy-600',
  },
  {
    name: 'Utility Billing',
    description: 'Pay your water and sewer bills',
    href: '/how-to#pay-a-bill',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'bg-gold-500 hover:bg-gold-400 text-navy-900',
  },
  {
    name: 'Parks & Rec',
    description: 'Programs, facilities, and events',
    href: '/departments/parks-recreation',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    color: 'bg-navy-400 hover:bg-navy-300',
  },
  {
    name: 'Business Licenses',
    description: 'Apply for business certificates',
    href: '/business/business-certificate',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    color: 'bg-sky-500 hover:bg-sky-400',
  },
  {
    name: 'Public Records',
    description: 'Request public documents',
    href: '/public-records',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    color: 'bg-gray-600 hover:bg-gray-500',
  },
  {
    name: 'Report a Concern',
    description: 'Submit issues to city staff',
    href: '/report-concern',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    color: 'bg-burgundy-600 hover:bg-burgundy-500',
  },
]

export default function QuickLinks() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-navy-800 mb-6">
        <Translated>Quick Services</Translated>
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {services.map((service) => (
          <Link
            key={service.name}
            href={service.href}
            className={`${service.color} text-white rounded-xl p-4 flex flex-col items-center text-center transition-all hover:scale-105 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-navy-500`}
          >
            {/* Icon */}
            <div className="mb-3">
              {service.icon}
            </div>

            {/* Title */}
            <h3 className="font-semibold text-sm leading-tight mb-1">
              <Translated>{service.name}</Translated>
            </h3>

            {/* Description */}
            <p className="text-xs opacity-90 leading-tight">
              <Translated>{service.description}</Translated>
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}

'use client'

import Translated from '@/components/Translated'

export default function Hero() {
  return (
    <section className="relative bg-navy-800 text-white">
      {/* Background image placeholder - we'll use a gradient for now */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700"
        aria-hidden="true"
      />

      {/* Decorative windmill pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      <div className="relative container-narrow py-20 md:py-28 lg:py-32">
        <div className="max-w-3xl">
          {/* Tagline */}
          <p className="text-gold-400 font-medium mb-3 tracking-wide">
            <Translated>Welcome to</Translated>
          </p>

          {/* Main heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <Translated>City of Solvang</Translated>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-navy-200 mb-6">
            <Translated>The Danish Capital of America</Translated>
          </p>

          {/* Description */}
          <p className="text-lg text-navy-300 mb-8 max-w-2xl">
            <Translated>Nestled in California&apos;s Santa Ynez Valley, Solvang offers a unique blend of Danish heritage and modern municipal services. Find everything you need to connect with your city government.</Translated>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <a
              href="#ask-assistant"
              className="btn bg-gold-500 text-navy-900 hover:bg-gold-400 font-semibold px-6 py-3"
            >
              <Translated>Ask Solvang Assistant</Translated>
            </a>
            <a
              href="/contact"
              className="btn bg-white/10 text-white hover:bg-white/20 backdrop-blur font-semibold px-6 py-3"
            >
              <Translated>Contact Us</Translated>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  )
}

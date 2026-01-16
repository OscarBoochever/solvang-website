'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Translated from '@/components/Translated'

const heroImages = [
  {
    src: '/images/wilderness-city.jpg',
    alt: 'Scenic view of Solvang nestled in the Santa Ynez Valley',
  },
  {
    src: '/images/storefronts.jpg',
    alt: 'Danish-style storefronts in downtown Solvang',
  },
  {
    src: '/images/flowers.jpg',
    alt: 'Beautiful flowers in Solvang',
  },
]

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-advance carousel every 12 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length)
    }, 12000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative bg-navy-800 text-white">
      {/* Background images carousel */}
      {heroImages.map((image, index) => (
        <div
          key={image.src}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority={index === 0}
            className="object-cover"
            sizes="100vw"
          />
        </div>
      ))}

      {/* Dark overlay for text readability */}
      <div
        className="absolute inset-0 bg-navy-900/60"
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
          <p className="text-xl md:text-2xl text-white/90 mb-6">
            <Translated>The Danish Capital of America</Translated>
          </p>

          {/* Description */}
          <p className="text-lg text-white/80 mb-8 max-w-2xl">
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
      <div className="absolute -bottom-px left-0 right-0 pointer-events-none">
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

'use client'

import { useState, useEffect } from 'react'
import Translated from '@/components/Translated'

interface SocialPost {
  id: string
  platform: 'instagram' | 'facebook' | 'twitter'
  content: string
  date: string
  link: string
}

// Placeholder posts - in production, these would come from social media APIs
const placeholderPosts: SocialPost[] = [
  {
    id: '1',
    platform: 'instagram',
    content: 'Beautiful sunset over the Santa Ynez Valley! #Solvang #DanishVillage',
    date: '2025-01-15',
    link: 'https://www.instagram.com/cityofsolvang/',
  },
  {
    id: '2',
    platform: 'facebook',
    content: 'Join us for the upcoming City Council meeting this Thursday at 6:30 PM. Public participation is welcome!',
    date: '2025-01-14',
    link: 'https://www.facebook.com/cityofsolvang',
  },
  {
    id: '3',
    platform: 'twitter',
    content: 'Reminder: Street sweeping on Mission Drive tomorrow morning. Please move vehicles by 7 AM.',
    date: '2025-01-13',
    link: 'https://twitter.com/cityofsolvang',
  },
  {
    id: '4',
    platform: 'instagram',
    content: 'Our historic windmills are looking stunning this morning! #SolvangWindmills',
    date: '2025-01-11',
    link: 'https://www.instagram.com/cityofsolvang/',
  },
  {
    id: '5',
    platform: 'facebook',
    content: 'Thank you to everyone who attended the Parks Commission meeting. Great discussions on our upcoming improvements!',
    date: '2025-01-10',
    link: 'https://www.facebook.com/cityofsolvang',
  },
  {
    id: '6',
    platform: 'twitter',
    content: 'The Planning Commission will meet next Tuesday to discuss the downtown improvement project. See agenda online.',
    date: '2025-01-09',
    link: 'https://twitter.com/cityofsolvang',
  },
]

const platformConfig = {
  instagram: {
    name: 'Instagram',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
      </svg>
    ),
  },
  facebook: {
    name: 'Facebook',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
      </svg>
    ),
  },
  twitter: {
    name: 'X',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
}

export default function SocialMediaFeed() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const postsPerView = isMobile ? 1 : 3
  const maxIndex = Math.max(0, placeholderPosts.length - postsPerView)

  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, maxIndex])

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
    setIsAutoPlaying(false)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
    setIsAutoPlaying(false)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  // Only show carousel controls if there are more posts than can be displayed
  const showControls = placeholderPosts.length > postsPerView

  return (
    <section className="py-12 bg-white" aria-labelledby="social-media-heading">
      <div className="container-narrow">
        {/* Header */}
        <div className="mb-8">
          <h2 id="social-media-heading" className="text-2xl font-bold text-navy-800">
            <Translated>Follow Us on Social Media</Translated>
          </h2>
          <p className="text-gray-600 mt-1">
            <Translated>Stay connected with the City of Solvang</Translated>
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Navigation Arrows - only show if needed */}
          {showControls && (
            <>
              <button
                onClick={goToPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-navy-500"
                aria-label="Previous posts"
              >
                <svg className="w-5 h-5 text-navy-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={goToNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-navy-500"
                aria-label="Next posts"
              >
                <svg className="w-5 h-5 text-navy-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Posts Container */}
          <div className="overflow-hidden mx-6 md:mx-8">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / postsPerView)}%)`,
              }}
            >
              {placeholderPosts.map((post) => {
                const config = platformConfig[post.platform]
                return (
                  <div
                    key={post.id}
                    className="w-full md:w-1/3 flex-shrink-0 px-2"
                  >
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-gray-50 border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-gray-300 transition-all h-full"
                    >
                      {/* Platform & Date */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-gray-500">
                          {config.icon}
                          <span className="text-sm font-medium">{config.name}</span>
                        </div>
                        <span className="text-xs text-gray-400">{formatDate(post.date)}</span>
                      </div>

                      {/* Post Content */}
                      <p className="text-gray-700 text-sm leading-relaxed line-clamp-4">
                        <Translated>{post.content}</Translated>
                      </p>

                      {/* View Link */}
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <span className="text-navy-600 text-sm font-medium hover:text-navy-800">
                          <Translated>View post</Translated> →
                        </span>
                      </div>
                    </a>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Dots Navigation - only show if needed */}
        {showControls && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index)
                  setIsAutoPlaying(false)
                }}
                className={`w-2 h-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-offset-2 ${
                  index === currentIndex ? 'bg-navy-600' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === currentIndex ? 'true' : 'false'}
              />
            ))}
          </div>
        )}

        {/* Subtle sample indicator */}
        <p className="text-center text-xs text-gray-400 mt-4"><Translated>Sample posts</Translated></p>
      </div>
    </section>
  )
}

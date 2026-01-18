import Hero from '@/components/home/Hero'
import QuickLinks from '@/components/home/QuickLinks'
import ChatSection from '@/components/chat/ChatSection'
import NewsSectionCMS from '@/components/home/NewsSectionCMS'
import EventsSidebarCMS from '@/components/home/EventsSidebarCMS'
import SocialMediaFeed from '@/components/home/SocialMediaFeed'

export const revalidate = 60 // Revalidate content every 60 seconds

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Quick Action Links */}
      <section className="py-12 bg-white">
        <div className="container-narrow">
          <QuickLinks />
        </div>
      </section>

      {/* AI Chat Assistant */}
      <ChatSection />

      {/* News and Events Section */}
      <section className="py-12 bg-gray-50">
        <div className="container-narrow">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* News - Takes 2 columns */}
            <div className="lg:col-span-2">
              <NewsSectionCMS />
            </div>

            {/* Events Sidebar - Takes 1 column */}
            <div>
              <EventsSidebarCMS />
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Feed */}
      <SocialMediaFeed />
    </>
  )
}

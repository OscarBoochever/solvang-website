/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net', // Contentful assets
      },
    ],
  },
  eslint: {
    // Allow builds to complete with warnings
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Optimización para SEO
  compress: true,
  async rewrites() {
    return [
      {
        source: '/admin',
        destination: 'http://35.209.116.50/admin',
      },
      {
        source: '/admin/:path*',
        destination: 'http://35.209.116.50/admin/:path*',
      },
    ]
  },
}

module.exports = nextConfig

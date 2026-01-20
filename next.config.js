/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Output for static export (Firebase Hosting) - DISABLED for Vercel
  // output: 'export',
  // Optimización para SEO
  compress: true,
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.orkiosk.com',
          },
        ],
        destination: 'https://orkiosk.com/:path*',
        permanent: true,
      },
    ]
  },
  // Redirects and Rewrites for /admin are NOT handled here to avoid affecting the external client server
  /*
  async rewrites() {
    return [
      {
        source: '/admin',
        destination: 'http://35.209.116.50/',
      },
      {
        source: '/admin/:path*',
        destination: 'http://35.209.116.50/:path*',
      },
    ]
  },
  */
}

module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
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
}

module.exports = nextConfig

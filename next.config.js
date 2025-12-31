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
  // Output for static export (Firebase Hosting)
  output: 'export',
  // Optimización para SEO
  compress: true,
  // Redirects and Rewrites are moved to firebase.json or handled by Firebase Hosting because they are not supported in static exports
  /*
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
  */
}

module.exports = nextConfig

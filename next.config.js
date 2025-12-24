/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Optimización para SEO
  compress: true,
}

module.exports = nextConfig

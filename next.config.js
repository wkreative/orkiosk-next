/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // sitio estático = sin servidor
  images: { unoptimized: true },
}
module.exports = nextConfig

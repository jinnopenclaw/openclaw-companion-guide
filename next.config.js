/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow reading HTML files from project root at build time
  experimental: {
    serverComponentsExternalPackages: [],
  },
  // Preserve trailing slash behaviour matching existing static site
  trailingSlash: false,
}

module.exports = nextConfig

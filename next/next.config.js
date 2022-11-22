/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['slumbr-party-panel.local.com', 'mitchellb23.sg-host.com'],
  },
}

module.exports = nextConfig

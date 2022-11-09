/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'],
  },
  env: {
    instamedia_api_url: process.env.INSTAMEDIA_API_URL,
  },
  experimental: {
    appDir: true,
  },
  swcMinify: true,
};

module.exports = nextConfig;

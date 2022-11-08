/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    instamedia_api_url: process.env.INSTAMEDIA_API_URL,
  },
};

module.exports = nextConfig;

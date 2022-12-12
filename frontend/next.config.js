/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      '1a5cd591b637a88f61a74d153d44ed7f.r2.cloudflarestorage.com',
      'pub-c9ffee2cae11433798dc6a029d31faf3.r2.dev',
    ],
  },
};

module.exports = nextConfig;

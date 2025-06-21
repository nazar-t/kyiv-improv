import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en', // Redirect to default locale
        permanent: false, // Use temporary redirect for development
      },
    ];
  },
  // Other Next.js configurations can go here
};

export default nextConfig;

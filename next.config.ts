import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
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

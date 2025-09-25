/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Re-enable webpack caching for faster incremental rebuilds in dev
    config.cache = true;
    return config;
  },
  images: {
    domains: ['images.unsplash.com'],
    // OR use remotePatterns for more control:
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  // Add other Next.js config options here
};

export default nextConfig;
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // This allows production builds on Vercel to successfully complete even if there are ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // This allows production builds on Vercel to successfully complete even if there are TS errors.
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      // You can add more image domains here if needed
    ],
  },
};

export default nextConfig;

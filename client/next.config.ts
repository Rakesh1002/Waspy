import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_API_KEY,
  },
  images: {
    domains: ["lh3.googleusercontent.com"], // For Google OAuth profile pictures
  },
  // Production optimizations
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;

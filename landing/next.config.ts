import type { NextConfig } from "next";

const apiURL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Hostname faqat qiymat bor bo‘lsa qo‘shiladi
const hostname = apiURL ? apiURL.replace(/^https?:\/\//, '') : undefined;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: hostname
      ? [
          {
            protocol: 'https',
            hostname,
            port: '',
            pathname: '/media/**',
          },
        ]
      : [], // BASE_URL bo‘lmasa remotePatterns bo‘sh bo‘lsin
  },
};

export default nextConfig;

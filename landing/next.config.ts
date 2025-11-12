import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'secdevuz.pythonanywhere.com',
        port: '', // Agar port ishlatilmasa, bo'sh qoldiring
        pathname: '/media/**', // Bu yerda rasmlar joylashgan yo'lni ko'rsating
      },
    ],
  },

};

export default nextConfig;

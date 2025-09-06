import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   experimental: {
    optimizeCss: false, // disables lightningcss
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

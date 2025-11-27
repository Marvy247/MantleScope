import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  // Add empty turbopack config to acknowledge webpack config
  turbopack: {},
};

export default nextConfig;

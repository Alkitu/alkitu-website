import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Migrate SVG support from webpack to Turbopack
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Recommended for the `pages` directory, default in `app`.
  images: {
    // unoptimized: true, // Optimización activada para producción
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "cdn-images-1.medium.com",
      },
      {
        protocol: "https",
        hostname: "medium.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "alkitu.com",
      },
    ],
  },
  webpack: (config) => {
    // Add support for .riv files as assets
    config.module.rules.push({
      test: /\.riv$/i,
      type: 'asset/resource',
    });

    // Add support for .wasm files (required for Rive runtime)
    config.module.rules.push({
      test: /\.wasm$/i,
      type: 'asset/resource',
    });

    // Enable WebAssembly experiments
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    return config;
  },
};

module.exports = nextConfig;

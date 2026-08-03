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
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
  async redirects() {
    return [
      // Duplicate of marketing-4-0-evolution; imported unpublished for review,
      // so without this it would render the blog 404 instead of passing its
      // link equity to the surviving article.
      //
      // Note there is deliberately no rule for the old `/blog/general/:slug`
      // URLs (the previous pipeline resolved every post to that path and the
      // sitemap published them for months). A static rule cannot know a post's
      // real category; the post page resolves it instead and issues a 301 to
      // the canonical URL whenever the category segment does not match.
      {
        source: '/:lang(en|es)/blog/:category/marketing-4-0-evolucion',
        destination: '/:lang/blog/marketing-digital/marketing-4-0-evolution',
        permanent: true,
      },
    ];
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

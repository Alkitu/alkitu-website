import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://alkitu.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',      // Block admin panel
          '/api/',        // Block API routes
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

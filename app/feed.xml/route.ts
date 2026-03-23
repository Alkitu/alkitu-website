import { allBlogPosts } from 'contentlayer/generated';

const BASE_URL = 'https://alkitu.com';

export async function GET() {
  const posts = allBlogPosts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const itemsXml = posts
    .map((post) => {
      const pubDate = new Date(post.date).toUTCString();
      return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${BASE_URL}${post.url}</link>
      <guid isPermaLink="true">${BASE_URL}${post.url}</guid>
      <description><![CDATA[${post.metaDescription}]]></description>
      <pubDate>${pubDate}</pubDate>
      <category>${post.categories[0] || 'General'}</category>
      <dc:creator>${post.author}</dc:creator>
      ${post.image ? `<enclosure url="${post.image}" type="image/jpeg" />` : ''}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Alkitu Blog</title>
    <link>${BASE_URL}</link>
    <description>Blog de Alkitu - Agencia digital especializada en branding, marketing digital y desarrollo web</description>
    <language>es</language>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${itemsXml}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

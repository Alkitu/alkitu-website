import { getAllPosts } from "@/lib/content/blog";

const BASE = "https://tuconcepto.com";

export const dynamic = "force-static";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function pubDate(d?: string | Date): string {
  if (!d) return "";
  const date = d instanceof Date ? d : new Date(d);
  return isNaN(date.getTime()) ? "" : date.toUTCString();
}

/** Feed RSS del blog (Historia 4-5 / FR-23): un item por artículo, desde el frontmatter. */
export async function GET() {
  const posts = await getAllPosts();
  const items = posts
    .map((p) => {
      const url = `${BASE}/blog/${p.slug}`;
      const fecha = pubDate(p.frontmatter.creado ?? p.frontmatter.actualizado);
      return `    <item>
      <title>${escapeXml(p.frontmatter.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      ${p.frontmatter.categoria ? `<category>${escapeXml(p.frontmatter.categoria)}</category>` : ""}
      ${fecha ? `<pubDate>${fecha}</pubDate>` : ""}
      <description>${escapeXml(p.frontmatter.extracto ?? "")}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blog · [Concepto]</title>
    <link>${BASE}/blog</link>
    <atom:link href="${BASE}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <description>Artículos y notas sobre [concepto].</description>
    <language>es</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}

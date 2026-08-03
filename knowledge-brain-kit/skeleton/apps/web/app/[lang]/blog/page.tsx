import type { Metadata } from "next";

import { getAllPosts } from "@/lib/content/blog";
import type { Locale } from "@/lib/i18n/config";
import { alternatesFor } from "@/lib/seo/alternates";
import { hasEnPair } from "@/lib/i18n/pares";
import { BlogListado, type PostListado } from "./_components/BlogListado";

type RouteParams = { params: Promise<{ lang: Locale }> };

const META = {
  es: {
    title: "Blog | [Concepto]",
    description:
      "Artículos y notas sobre [concepto]: ideas, guías y aprendizajes.",
  },
  en: {
    title: "Blog | [Concept]",
    description:
      "Articles and notes on [concept]: ideas, guides and learnings.",
  },
} as const;

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { lang } = await params;
  const m = META[lang];
  const { alternates } = alternatesFor("/blog", { hasEn: hasEnPair("/blog"), lang });
  return {
    title: m.title,
    description: m.description,
    alternates: {
      ...alternates,
      types: { "application/rss+xml": "/blog/rss.xml" },
    },
  };
}

export default async function BlogPage({ params }: RouteParams) {
  const { lang } = await params;
  const posts = await getAllPosts(lang);
  const listado: PostListado[] = posts.map((p) => ({
    slug: p.slug,
    categoria: p.frontmatter.categoria ?? "",
    titulo: p.frontmatter.title,
    extracto: p.frontmatter.extracto ?? "",
    fecha: p.frontmatter.fecha ?? "",
    lectura: p.frontmatter.lectura ?? "",
    portada: p.frontmatter.portada,
  }));

  return <BlogListado posts={listado} lang={lang} />;
}

/**
 * llms.txt — llmstxt.org
 *
 * A plain-text map of the site aimed at language models rather than crawlers.
 * Ported from the knowledge-brain-kit, where it is generated live from real
 * content (never hand-maintained), so it cannot drift from what is published.
 *
 * Where a post declares `geo_respuesta_corta` (the GEO layer's extractable
 * answer), that is preferred over the marketing excerpt — it is the sentence
 * written specifically to be quoted.
 */

import { getAllPosts } from '@/lib/blog/queries';

export const dynamic = 'force-static';
export const revalidate = 3600;

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://alkitu.com';

function trunc(text: string, max: number): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length <= max ? clean : `${clean.slice(0, max - 1)}…`;
}

export async function GET() {
  const posts = await getAllPosts();

  const es = posts.filter((p) => p.locale === 'es');
  const en = posts.filter((p) => p.locale === 'en');

  const section = (title: string, list: typeof posts) => {
    if (!list.length) return '';
    const lines = list
      .map((p) => {
        const desc = p.geoRespuestaCorta ?? p.excerpt ?? p.metaDescription ?? '';
        const suffix = desc ? `: ${trunc(desc, 140)}` : '';
        return `- [${p.title}](${BASE}${p.url})${suffix}`;
      })
      .join('\n');
    return `## ${title}\n\n${lines}\n`;
  };

  const categories = [...new Set(posts.map((p) => p.categories[0]).filter(Boolean))];

  const body = `# Alkitu

> Agencia digital especializada en branding, marketing digital, desarrollo web y productos digitales a medida. Sitio bilingüe (español e inglés).

## Secciones

- [Inicio](${BASE}/es): Página principal.
- [Sobre nosotros](${BASE}/es/about): Quiénes somos y cómo trabajamos.
- [Proyectos](${BASE}/es/projects): Casos de trabajo realizados.
- [Blog](${BASE}/es/blog): Artículos sobre marketing, diseño y desarrollo.
- [Contacto](${BASE}/es/contact): Formulario de contacto.

## Temáticas del blog

${categories.map((c) => `- ${c}`).join('\n')}

${section('Blog (español)', es)}
${section('Blog (English)', en)}`;

  return new Response(body.trim() + '\n', {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}

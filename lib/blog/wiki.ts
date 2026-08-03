/**
 * Glossary reads for the public site.
 *
 * Separate from `lib/agent/glosario.ts` (which serves scripts and Claude Code)
 * because these are wrapped in React `cache()` and use the anonymous client, so
 * wiki pages and the blog interlinker stay statically renderable.
 */

import { cache } from 'react';
import { createAnalyticsClient } from '@/lib/supabase/analytics';
import type { GlossaryTerm, TermRef } from '@/lib/agent/glosario';

const arr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

interface Row {
  slug: string;
  titulo_es: string;
  titulo_en: string | null;
  definicion_es: string;
  definicion_en: string | null;
  dominio: string | null;
  pilar: string | null;
  aliases: unknown;
  campo_semantico: unknown;
  hiperonimos: unknown;
  hiponimos: unknown;
  relacionados: unknown;
  geo_respuesta_corta: string | null;
  published: boolean;
}

function toTerm(r: Row): GlossaryTerm {
  return {
    slug: r.slug,
    titulo: r.titulo_es,
    tituloEn: r.titulo_en,
    definicion: r.definicion_es,
    definicionEn: r.definicion_en,
    dominio: r.dominio,
    pilar: r.pilar,
    aliases: arr<string>(r.aliases),
    campoSemantico: arr<string>(r.campo_semantico),
    hiperonimos: arr<TermRef>(r.hiperonimos),
    hiponimos: arr<TermRef>(r.hiponimos),
    relacionados: arr<TermRef>(r.relacionados),
    geoRespuestaCorta: r.geo_respuesta_corta,
    published: r.published,
  };
}

/** Locale-aware title, falling back to Spanish. */
export function tituloDe(t: GlossaryTerm, lang: 'es' | 'en'): string {
  return lang === 'en' ? (t.tituloEn ?? t.titulo) : t.titulo;
}

/** Locale-aware definition, falling back to Spanish. */
export function definicionDe(t: GlossaryTerm, lang: 'es' | 'en'): string {
  return lang === 'en' ? (t.definicionEn ?? t.definicion) : t.definicion;
}

/** Every published term. Also feeds the blog interlinker. */
export const getTerms = cache(async (): Promise<GlossaryTerm[]> => {
  const supabase = createAnalyticsClient();
  const { data, error } = await supabase
    .from('glossary_terms')
    .select('*')
    .eq('published', true)
    .order('titulo_es');

  if (error) {
    // A missing glossary must never break a blog render — interlinking simply
    // becomes a no-op.
    console.error('[wiki] getTerms:', error.message);
    return [];
  }
  return (data ?? []).map((r) => toTerm(r as Row));
});

export const getTerm = cache(async (slug: string): Promise<GlossaryTerm | null> => {
  const supabase = createAnalyticsClient();
  const { data, error } = await supabase
    .from('glossary_terms')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();

  if (error) {
    console.error('[wiki] getTerm:', error.message);
    return null;
  }
  return data ? toTerm(data as Row) : null;
});

export const getTermSlugs = cache(async (): Promise<string[]> => {
  const supabase = createAnalyticsClient();
  const { data, error } = await supabase
    .from('glossary_terms')
    .select('slug')
    .eq('published', true);

  if (error) {
    console.error('[wiki] getTermSlugs:', error.message);
    return [];
  }
  return (data ?? []).map((r) => r.slug as string);
});

/** DefinedTerm structured data for a glossary entry. */
export function definedTermLd(term: GlossaryTerm, lang: 'es' | 'en') {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://alkitu.com';
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: tituloDe(term, lang),
    description: definicionDe(term, lang),
    url: `${site}/${lang}/wiki/${term.slug}`,
    ...(term.aliases.length ? { alternateName: term.aliases } : {}),
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: lang === 'es' ? 'Glosario de Alkitu' : 'Alkitu Glossary',
      url: `${site}/${lang}/wiki`,
    },
  };
}

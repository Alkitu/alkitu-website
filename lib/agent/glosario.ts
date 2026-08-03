/**
 * Glossary lookup — the first stop when grounding any content.
 *
 * Ported from the knowledge-brain-kit's `lib/agent/glosario.ts`, reading from
 * the `glossary_terms` table instead of a generated JSON file. Kept as plain
 * functions (no framework imports) so the same code serves Claude Code via
 * `npx tsx`, the render-time interlinker, and any future chat surface —
 * NFR-4 in the kit's PRD.
 */

import { agentClient } from './client';

export interface TermRef {
  nombre: string;
  slug: string;
}

export interface GlossaryTerm {
  slug: string;
  titulo: string;
  tituloEn: string | null;
  definicion: string;
  definicionEn: string | null;
  dominio: string | null;
  pilar: string | null;
  aliases: string[];
  campoSemantico: string[];
  hiperonimos: TermRef[];
  hiponimos: TermRef[];
  relacionados: TermRef[];
  geoRespuestaCorta: string | null;
  published: boolean;
}

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

const arr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

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

/** Locale-aware title, falling back to Spanish (kit convention). */
export function tituloDe(t: GlossaryTerm, lang: 'es' | 'en'): string {
  return lang === 'en' ? (t.tituloEn ?? t.titulo) : t.titulo;
}

/** Locale-aware definition, falling back to Spanish. */
export function definicionDe(t: GlossaryTerm, lang: 'es' | 'en'): string {
  return lang === 'en' ? (t.definicionEn ?? t.definicion) : t.definicion;
}

/**
 * All published terms.
 */
export async function allTerminos(includeUnpublished = false): Promise<GlossaryTerm[]> {
  let query = agentClient().from('glossary_terms').select('*').order('titulo_es');
  if (!includeUnpublished) query = query.eq('published', true);

  const { data, error } = await query;
  if (error) throw new Error(`glossary_terms: ${error.message}`);
  return (data ?? []).map((r) => toTerm(r as Row));
}

/**
 * Free-text search across slug, titles, aliases and definitions.
 *
 * Use this FIRST when writing about a concept: if a term exists, its definition
 * is the canonical wording and the article should link to it rather than
 * inventing a parallel explanation.
 */
export async function queryGlosario(q: string, dominio?: string): Promise<GlossaryTerm[]> {
  const needle = q.trim().toLowerCase();
  if (!needle) return [];

  const terms = await allTerminos();
  return terms
    .filter((t) => !dominio || t.dominio === dominio)
    .filter((t) => {
      const haystack = [
        t.slug,
        t.titulo,
        t.tituloEn ?? '',
        t.definicion,
        t.definicionEn ?? '',
        ...t.aliases,
        ...t.campoSemantico,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(needle);
    })
    .sort((a, b) => {
      // Exact title matches first, then slug matches, then the rest
      const score = (t: GlossaryTerm) =>
        t.titulo.toLowerCase() === needle ? 0 : t.slug === needle ? 1 : 2;
      return score(a) - score(b);
    });
}

/**
 * One term with its full taxonomy.
 */
export async function getTermino(slug: string): Promise<GlossaryTerm | null> {
  const { data, error } = await agentClient()
    .from('glossary_terms')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw new Error(`glossary_terms: ${error.message}`);
  return data ? toTerm(data as Row) : null;
}

/**
 * Neighbours of a concept in the taxonomy: its broader terms, narrower terms,
 * siblings (other terms sharing a hypernym) and explicit relations.
 *
 * This is the kit's `query_graph` without a separate graph artifact — the
 * relationships are already declared on each term, so they can be walked
 * directly.
 */
export async function queryGraph(concepto: string): Promise<{
  term: GlossaryTerm | null;
  hiperonimos: TermRef[];
  hiponimos: TermRef[];
  relacionados: TermRef[];
  hermanos: TermRef[];
}> {
  const term = (await getTermino(concepto)) ?? (await queryGlosario(concepto))[0] ?? null;

  if (!term) {
    return { term: null, hiperonimos: [], hiponimos: [], relacionados: [], hermanos: [] };
  }

  const all = await allTerminos();
  const parentSlugs = new Set(term.hiperonimos.map((h) => h.slug));

  const hermanos = all
    .filter((t) => t.slug !== term.slug)
    .filter((t) => t.hiperonimos.some((h) => parentSlugs.has(h.slug)))
    .map((t) => ({ nombre: t.titulo, slug: t.slug }));

  return {
    term,
    hiperonimos: term.hiperonimos,
    hiponimos: term.hiponimos,
    relacionados: term.relacionados,
    hermanos,
  };
}

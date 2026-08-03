/**
 * Automatic glossary interlinking.
 *
 * Ported from the knowledge-brain-kit's `lib/glosario.tsx`, reading terms from
 * the `glossary_terms` table instead of a generated JSON file. Walks a post's
 * markdown AST and links the FIRST mention of each term to `/{lang}/wiki/<slug>`.
 *
 * The rules that matter (all inherited from the kit, and all load-bearing):
 *
 *   - One link per term per article. Linking every occurrence reads as spam and
 *     dilutes the signal.
 *   - Longest phrase first, so "certificado SSL" wins over "certificado".
 *   - Never inside links, code, headings or blockquotes — those are either
 *     already navigational or must stay verbatim.
 *   - A term never links to itself (used when rendering a wiki page).
 */

import { visit } from 'unist-util-visit';
import type { Root, Text, Parent } from 'mdast';
import type { GlossaryTerm } from '@/lib/agent/glosario';

/** Nodes whose descendants must never be linkified. */
const SKIP_PARENTS = new Set([
  'link',
  'linkReference',
  'code',
  'inlineCode',
  'heading',
  'definition',
  'blockquote',
]);

/**
 * Words too generic to link without creating noise. Kept explicit rather than
 * length-based so the reasoning stays visible.
 */
const STOPLIST = new Set(['web', 'seo', 'app', 'ux', 'ui']);

export interface LinkableTerm {
  slug: string;
  phrases: string[];
}

/**
 * Surface forms for a term in a given locale: its title plus aliases (Spanish),
 * or the translated title (English, where aliases are Spanish-only).
 */
export function linkablePhrases(term: GlossaryTerm, lang: 'es' | 'en'): string[] {
  const phrases =
    lang === 'en'
      ? [term.tituloEn ?? term.titulo]
      : [term.titulo, ...term.aliases];

  return phrases
    .map((p) => p.trim())
    .filter((p) => p.length >= 3)
    .filter((p) => !p.includes('('))
    .filter((p) => !STOPLIST.has(p.toLowerCase()));
}

interface Index {
  pattern: RegExp;
  bySurface: Map<string, string>;
}

/**
 * Build one alternation regex over every surface form.
 *
 * Longest-first ordering is what makes the multi-word terms win; the lookarounds
 * keep matches on word boundaries without relying on `\b`, which misbehaves with
 * accented characters.
 */
export function buildIndex(terms: GlossaryTerm[], lang: 'es' | 'en'): Index | null {
  const bySurface = new Map<string, string>();

  for (const term of terms) {
    for (const phrase of linkablePhrases(term, lang)) {
      const key = phrase.toLowerCase();
      // Titles are written last and win over aliases on collision.
      bySurface.set(key, term.slug);
    }
  }

  if (!bySurface.size) return null;

  const surfaces = [...bySurface.keys()].sort((a, b) => b.length - a.length);
  const escaped = surfaces.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

  return {
    pattern: new RegExp(`(?<![\\p{L}\\p{N}])(${escaped.join('|')})(?![\\p{L}\\p{N}])`, 'giu'),
    bySurface,
  };
}

/**
 * Remark plugin factory.
 *
 * @param terms      published glossary terms
 * @param lang       locale being rendered
 * @param selfSlug   slug of the term/post being rendered, never self-linked
 */
export function remarkGlosarioLinks(
  terms: GlossaryTerm[],
  lang: 'es' | 'en',
  selfSlug?: string
) {
  const index = buildIndex(terms, lang);

  return () => (tree: Root) => {
    if (!index) return;

    const used = new Set<string>();
    if (selfSlug) used.add(selfSlug);

    visit(tree, 'text', (node: Text, i: number | undefined, parent: Parent | undefined) => {
      if (!parent || i === undefined) return;
      if (SKIP_PARENTS.has(parent.type)) return;

      const value = node.value;
      index.pattern.lastIndex = 0;

      const next: Array<Text | { type: 'link'; url: string; children: Text[] }> = [];
      let cursor = 0;
      let match: RegExpExecArray | null;
      let linked = false;

      while ((match = index.pattern.exec(value)) !== null) {
        const surface = match[1];
        const slug = index.bySurface.get(surface.toLowerCase());
        if (!slug || used.has(slug)) continue;

        used.add(slug);
        linked = true;

        if (match.index > cursor) {
          next.push({ type: 'text', value: value.slice(cursor, match.index) });
        }
        next.push({
          type: 'link',
          url: `/${lang}/wiki/${slug}`,
          children: [{ type: 'text', value: surface }],
        });
        cursor = match.index + surface.length;
      }

      if (!linked) return;
      if (cursor < value.length) {
        next.push({ type: 'text', value: value.slice(cursor) });
      }

      parent.children.splice(i, 1, ...(next as Parent['children']));
      return i + next.length;
    });
  };
}

/**
 * MDX compilation options for blog bodies.
 *
 * The previous pipeline compiled MDX at build time (Contentlayer, a webpack
 * plugin). Bodies now live in the database, so they are compiled at render time
 * with `next-mdx-remote/rsc`, which accepts a string source. The plugin chain is
 * a faithful copy of the old `contentlayer.config.ts` so output is unchanged,
 * plus glossary interlinking.
 *
 * On `remark-gfm`: it stays disabled, as it was before. The posts are not using
 * GFM tables, but 23 of them contain lines like
 * `[Ver servicios](/es/services) | [Contacto](/es/contact)` — bare pipes in a
 * paragraph, which GFM's table parser misreads. Enabling it would mangle those
 * lines, so the old comment's conclusion still holds even though its stated
 * cause (table syntax in seo-keywords-guide.mdx) was inaccurate.
 */

import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkCustomHeadingId from 'remark-custom-heading-id';
import type { MDXRemoteProps } from 'next-mdx-remote/rsc';
import { remarkGlosarioLinks } from './glosario';
import type { GlossaryTerm } from '@/lib/agent/glosario';

interface HastNode {
  children: Array<{ type: string; value: string }>;
  properties: { className?: string[] };
}

interface BuildOptions {
  terms?: GlossaryTerm[];
  lang?: 'es' | 'en';
  selfSlug?: string;
}

export function buildMdxOptions({
  terms = [],
  lang = 'es',
  selfSlug,
}: BuildOptions = {}): MDXRemoteProps['options'] {
  return {
    parseFrontmatter: false, // frontmatter lives in table columns, not in the body
    mdxOptions: {
      remarkPlugins: [
        // `{#custom-id}` heading anchors — 21 of the 23 migrated posts rely on
        // this, and the table of contents links break without it.
        remarkCustomHeadingId,
        // Links the first mention of each glossary term. No terms -> no-op.
        ...(terms.length ? [remarkGlosarioLinks(terms, lang, selfSlug)] : []),
      ],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'wrap',
            properties: {
              className: ['heading-link'],
              ariaLabel: 'Link to section',
            },
          },
        ],
        [
          rehypePrettyCode,
          {
            theme: 'github-dark',
            onVisitLine(node: HastNode) {
              // Keep empty lines from collapsing
              if (node.children.length === 0) {
                node.children = [{ type: 'text', value: ' ' }];
              }
            },
            onVisitHighlightedLine(node: HastNode) {
              node.properties.className = [...(node.properties.className ?? []), 'highlighted'];
            },
            onVisitHighlightedWord(node: HastNode) {
              node.properties.className = ['word'];
            },
          },
        ],
      ],
    },
  };
}

/** Options without interlinking, for contexts with no glossary. */
export const mdxOptions = buildMdxOptions();

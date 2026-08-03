/**
 * Contract gate. Run before considering blog work done.
 *
 * Checks every post in the database against the knowledge-brain-kit contract
 * (`lib/schemas/blog.ts`) plus a few whole-corpus invariants the per-post checks
 * cannot see: duplicate slugs, translation pairs, category slug drift.
 *
 * Exits non-zero when a PUBLISHED post has an error, so it works as a gate.
 * Drafts are reported but never fail the run — being incomplete is what a draft
 * is for.
 *
 * Usage:
 *   npm run blog:validate
 *   npm run blog:validate -- --strict    # warnings also fail
 */

import { agentClient } from '../lib/agent/client';
import { checkContract, type ContractFinding } from '../lib/schemas/blog';
import { categoriaToSlug } from '../lib/blog/slug';

const STRICT = process.argv.includes('--strict');

interface Row {
  id: string;
  title: string;
  slug: string;
  locale: string;
  categoria: string;
  categoria_slug: string;
  translation_group_id: string;
  published: boolean;
  estado: string;
  titulo_seo: string | null;
  metadescripcion: string | null;
  keyword_principal: string | null;
  canonical: string | null;
  extracto: string | null;
  geo_preguntas: string[];
  geo_respuestas: string[];
  geo_respuesta_corta: string | null;
  body_mdx: string;
}

const red = (s: string) => `\x1b[31m${s}\x1b[0m`;
const yellow = (s: string) => `\x1b[33m${s}\x1b[0m`;
const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;

async function main() {
  const { data, error } = await agentClient()
    .from('blog_posts')
    .select(
      'id, title, slug, locale, categoria, categoria_slug, translation_group_id, published, estado, titulo_seo, metadescripcion, keyword_principal, canonical, extracto, geo_preguntas, geo_respuestas, geo_respuesta_corta, body_mdx'
    )
    .order('locale')
    .order('slug');

  if (error) {
    console.error(red(`Could not read blog_posts: ${error.message}`));
    process.exit(1);
  }

  const posts = (data ?? []) as Row[];
  let blocking = 0;
  let warnings = 0;

  console.log(`\nChecking ${posts.length} posts against the content contract\n`);

  for (const post of posts) {
    const findings: ContractFinding[] = checkContract(post);

    // Whole-corpus invariant: the stored URL segment must still match its
    // category. If someone renames a category by hand, links silently rot.
    const expected = categoriaToSlug(post.categoria);
    if (post.categoria_slug !== expected) {
      findings.push({
        level: 'error',
        field: 'categoria_slug',
        message: `Stored slug "${post.categoria_slug}" does not match category "${post.categoria}" (expected "${expected}").`,
      });
    }

    if (!findings.length) continue;

    const errors = findings.filter((f) => f.level === 'error');
    const warns = findings.filter((f) => f.level === 'warning');

    // Only a published post's errors can break the build.
    if (post.published) blocking += errors.length;
    warnings += warns.length;

    const state = post.published ? '' : dim(' [draft]');
    console.log(`${post.locale}/${post.slug}${state}`);
    for (const f of errors) {
      const label = post.published ? red('  error  ') : yellow('  error  ');
      console.log(`${label}${f.field}: ${f.message}`);
    }
    for (const f of warns) {
      console.log(`${yellow('  warn   ')}${f.field}: ${f.message}`);
    }
    console.log();
  }

  // Duplicate (locale, slug) — the DB constraint should prevent it, but a
  // mismatch here would mean the constraint was dropped.
  const seen = new Set<string>();
  for (const p of posts) {
    const key = `${p.locale}:${p.slug}`;
    if (seen.has(key)) {
      console.log(red(`duplicate slug: ${key}`));
      blocking++;
    }
    seen.add(key);
  }

  // Translation pairing
  const groups = new Map<string, Row[]>();
  for (const p of posts) {
    groups.set(p.translation_group_id, [...(groups.get(p.translation_group_id) ?? []), p]);
  }
  const unpaired = [...groups.values()].filter((g) => g.length === 1);
  const oversized = [...groups.values()].filter((g) => g.length > 2);

  for (const g of oversized) {
    console.log(
      red(`translation group has ${g.length} members: ${g.map((p) => `${p.locale}/${p.slug}`).join(', ')}`)
    );
    blocking++;
  }

  console.log('─'.repeat(60));
  console.log(`posts:              ${posts.length}`);
  console.log(`published:          ${posts.filter((p) => p.published).length}`);
  console.log(`translation pairs:  ${[...groups.values()].filter((g) => g.length === 2).length}`);
  console.log(
    `single-locale:      ${unpaired.length}${unpaired.length ? dim(` (${unpaired.map((g) => `${g[0].locale}/${g[0].slug}`).join(', ')})`) : ''}`
  );
  console.log(`warnings:           ${warnings}`);
  console.log(`blocking errors:    ${blocking}`);
  console.log('─'.repeat(60));

  if (blocking > 0) {
    console.log(red(`\nFAIL — ${blocking} blocking error(s) on published posts.\n`));
    process.exit(1);
  }
  if (STRICT && warnings > 0) {
    console.log(yellow(`\nFAIL (--strict) — ${warnings} warning(s).\n`));
    process.exit(1);
  }
  console.log(green('\nPASS\n'));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

/**
 * Category slug — single source of truth.
 *
 * The previous Contentlayer pipeline had TWO divergent implementations of this:
 * the route/canonical used `/[\s\/]+/` (correct: "Diseño UX/UI" -> "diseno-ux-ui")
 * while `app/sitemap.ts` used `/\s+/`, leaving the slash in place and emitting
 * `/blog/diseno-ux/ui` — a bogus extra path segment that 404'd.
 *
 * Everything now derives the URL from `blog_posts.categoria_slug`, which is
 * computed once (here) at write time and stored. This function exists so writes
 * stay consistent; reads should use the stored column.
 */
export function categoriaToSlug(categoria: string): string {
  return categoria
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip diacritics
    .replace(/[\s/]+/g, '-') // spaces AND slashes -> single dash
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Canonical public path for a post.
 */
export function blogPostPath(
  locale: string,
  categoriaSlug: string,
  slug: string
): string {
  return `/${locale}/blog/${categoriaSlug}/${slug}`;
}

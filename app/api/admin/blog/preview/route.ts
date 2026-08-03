/**
 * MDX preview for the admin editor.
 *
 * Compiles the body straight to an HTML string with unified, rather than
 * rendering React: Next's App Router forbids importing `react-dom/server`, and
 * the editor only needs markup to drop into a panel.
 *
 * Shares the two plugins that change how existing content reads —
 * `remark-custom-heading-id` (most posts use `{#custom-id}` anchors) and
 * `rehype-slug` — so headings preview exactly as they will publish. JSX
 * components such as `<MediaCarousel />` are not executed here; they surface as
 * a visible placeholder, which is honest about what the preview can show.
 */

import { NextRequest } from 'next/server';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeSlug from 'rehype-slug';
import remarkCustomHeadingId from 'remark-custom-heading-id';
import { createClient } from '@/lib/supabase/server';
import { ApiSuccess, ApiError } from '@/lib/api/response';

/** Replace self-closing/paired JSX blocks with a readable placeholder. */
function stubJsx(source: string): string {
  return source
    .replace(/<([A-Z][\w.]*)\b[^>]*\/>/g, (_m, name) => `> _[componente: ${name}]_`)
    .replace(/<([A-Z][\w.]*)\b[^>]*>[\s\S]*?<\/\1>/g, (_m, name) => `> _[componente: ${name}]_`);
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) return ApiError.unauthorized('Authentication required');

    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', user.id)
      .single();

    if (!adminUser) return ApiError.forbidden('Admin access required');

    const { source } = await request.json();
    if (typeof source !== 'string') {
      return ApiError.badRequest('`source` must be a string');
    }

    try {
      const file = await unified()
        .use(remarkParse)
        .use(remarkCustomHeadingId)
        .use(remarkRehype)
        .use(rehypeSlug)
        .use(rehypeStringify)
        .process(stubJsx(source));

      return ApiSuccess.ok({ html: String(file) }, 'Preview compiled');
    } catch (compileError) {
      // Malformed input is expected while typing; report it as data so the
      // editor can show it inline instead of treating it as a request failure.
      return ApiSuccess.ok(
        {
          html: null,
          error: compileError instanceof Error ? compileError.message : 'Preview error',
        },
        'Preview failed to compile'
      );
    }
  } catch (err) {
    console.error('[admin/blog/preview]', err);
    return ApiError.internal('Unexpected error rendering preview');
  }
}

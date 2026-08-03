/**
 * Admin blog API — list and create.
 *
 * GET  /api/admin/blog        list posts (drafts included)
 * POST /api/admin/blog        create a post
 *
 * Validation goes through `lib/schemas/blog.ts`, the same module the
 * `npm run blog:validate` gate uses, so a post written here is held to exactly
 * the same contract as one written by Claude Code.
 */

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApiSuccess, ApiError } from '@/lib/api/response';
import { BlogPostInputSchema, checkContract, canPublish } from '@/lib/schemas/blog';
import { categoriaToSlug } from '@/lib/blog/slug';

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return { error: ApiError.unauthorized('Authentication required') };

  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('id')
    .eq('id', user.id)
    .single();

  if (!adminUser) return { error: ApiError.forbidden('Admin access required') };
  return { supabase };
}

export async function GET(request: NextRequest) {
  try {
    const { supabase, error } = await requireAdmin();
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale');
    const search = searchParams.get('search');

    let query = supabase!
      .from('blog_posts')
      .select(
        'id, title, slug, locale, categoria, categoria_slug, published, estado, featured, published_at, updated_at, translation_group_id, autor, portada'
      )
      .order('published_at', { ascending: false, nullsFirst: false });

    if (locale) query = query.eq('locale', locale);
    if (search) query = query.ilike('title', `%${search}%`);

    const { data, error: dbError } = await query;
    if (dbError) return ApiError.database(dbError.message);

    return ApiSuccess.ok(data, 'Posts retrieved');
  } catch (err) {
    console.error('[admin/blog GET]', err);
    return ApiError.internal('Unexpected error listing posts');
  }
}

export async function POST(request: NextRequest) {
  try {
    const { supabase, error } = await requireAdmin();
    if (error) return error;

    const body = await request.json();
    const parsed = BlogPostInputSchema.safeParse(body);
    if (!parsed.success) return ApiError.validationError(parsed.error);

    const input = parsed.data;

    // Publishing requires a clean contract; drafts may be incomplete.
    if (input.published && !canPublish(input)) {
      return ApiError.badRequest(
        'Cannot publish: the post has blocking contract errors.',
        checkContract(input)
          .filter((f) => f.level === 'error')
          .map((f) => ({ field: f.field, message: f.message, code: 'contract' }))
      );
    }

    const row = {
      ...input,
      categoria_slug: categoriaToSlug(input.categoria),
      published_at: input.published_at ?? (input.published ? new Date().toISOString() : null),
    };

    const { data, error: dbError } = await supabase!
      .from('blog_posts')
      .insert(row)
      .select()
      .single();

    if (dbError) {
      if (dbError.code === '23505') {
        return ApiError.conflict(`A ${input.locale} post with slug "${input.slug}" already exists.`);
      }
      return ApiError.database(dbError.message);
    }

    return ApiSuccess.created(data, 'Post created');
  } catch (err) {
    console.error('[admin/blog POST]', err);
    return ApiError.internal('Unexpected error creating post');
  }
}

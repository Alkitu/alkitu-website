/**
 * Admin blog API — read, update, delete a single post.
 *
 * GET    /api/admin/blog/[id]
 * PATCH  /api/admin/blog/[id]
 * DELETE /api/admin/blog/[id]
 *
 * Same contract gate as the collection route and as `npm run blog:validate`.
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { ApiSuccess, ApiError } from '@/lib/api/response';
import { BlogPostUpdateSchema, checkContract, canPublish } from '@/lib/schemas/blog';
import { categoriaToSlug } from '@/lib/blog/slug';

const IdSchema = z.object({ id: z.string().uuid('Invalid post id') });

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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { supabase, error } = await requireAdmin();
    if (error) return error;

    const parsedId = IdSchema.safeParse(await params);
    if (!parsedId.success) return ApiError.validationError(parsedId.error);

    const { data, error: dbError } = await supabase!
      .from('blog_posts')
      .select('*')
      .eq('id', parsedId.data.id)
      .maybeSingle();

    if (dbError) return ApiError.database(dbError.message);
    if (!data) return ApiError.notFound('Post not found');

    // Surface contract findings alongside the record so the editor can show
    // exactly what would block publishing, without duplicating the rules.
    return ApiSuccess.ok({ ...data, findings: checkContract(data) }, 'Post retrieved');
  } catch (err) {
    console.error('[admin/blog/[id] GET]', err);
    return ApiError.internal('Unexpected error reading post');
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { supabase, error } = await requireAdmin();
    if (error) return error;

    const parsedId = IdSchema.safeParse(await params);
    if (!parsedId.success) return ApiError.validationError(parsedId.error);

    const body = await request.json();
    const parsed = BlogPostUpdateSchema.safeParse(body);
    if (!parsed.success) return ApiError.validationError(parsed.error);

    const { data: existing, error: readError } = await supabase!
      .from('blog_posts')
      .select('*')
      .eq('id', parsedId.data.id)
      .maybeSingle();

    if (readError) return ApiError.database(readError.message);
    if (!existing) return ApiError.notFound('Post not found');

    const merged = { ...existing, ...parsed.data };

    if (merged.published && !canPublish(merged)) {
      return ApiError.badRequest(
        'Cannot publish: the post has blocking contract errors.',
        checkContract(merged)
          .filter((f) => f.level === 'error')
          .map((f) => ({ field: f.field, message: f.message, code: 'contract' }))
      );
    }

    const update: Record<string, unknown> = { ...parsed.data };

    // The stored category slug is what every URL is built from, so it must be
    // recomputed whenever the category changes — never left to drift.
    if (parsed.data.categoria) {
      update.categoria_slug = categoriaToSlug(parsed.data.categoria);
    }

    // Stamp the publication date the first time a post actually goes live.
    if (parsed.data.published && !existing.published_at) {
      update.published_at = new Date().toISOString();
    }

    const { data, error: dbError } = await supabase!
      .from('blog_posts')
      .update(update)
      .eq('id', parsedId.data.id)
      .select()
      .single();

    if (dbError) {
      if (dbError.code === '23505') {
        return ApiError.conflict('Another post in this locale already uses that slug.');
      }
      return ApiError.database(dbError.message);
    }

    return ApiSuccess.ok(data, 'Post updated');
  } catch (err) {
    console.error('[admin/blog/[id] PATCH]', err);
    return ApiError.internal('Unexpected error updating post');
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { supabase, error } = await requireAdmin();
    if (error) return error;

    const parsedId = IdSchema.safeParse(await params);
    if (!parsedId.success) return ApiError.validationError(parsedId.error);

    const { error: dbError } = await supabase!
      .from('blog_posts')
      .delete()
      .eq('id', parsedId.data.id);

    if (dbError) return ApiError.database(dbError.message);

    return ApiSuccess.ok({ id: parsedId.data.id }, 'Post deleted');
  } catch (err) {
    console.error('[admin/blog/[id] DELETE]', err);
    return ApiError.internal('Unexpected error deleting post');
  }
}

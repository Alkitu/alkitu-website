/**
 * Admin glossary API — read, update, delete a single term.
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { ApiSuccess, ApiError } from '@/lib/api/response';
import {
  GlossaryTermUpdateSchema,
  checkGlossaryContract,
  canPublishTerm,
} from '@/lib/schemas/glossary';

const IdSchema = z.object({ id: z.string().uuid('Invalid term id') });

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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { supabase, error } = await requireAdmin();
    if (error) return error;

    const parsedId = IdSchema.safeParse(await params);
    if (!parsedId.success) return ApiError.validationError(parsedId.error);

    const parsed = GlossaryTermUpdateSchema.safeParse(await request.json());
    if (!parsed.success) return ApiError.validationError(parsed.error);

    const { data: existing, error: readError } = await supabase!
      .from('glossary_terms')
      .select('*')
      .eq('id', parsedId.data.id)
      .maybeSingle();

    if (readError) return ApiError.database(readError.message);
    if (!existing) return ApiError.notFound('Term not found');

    const merged = { ...existing, ...parsed.data };

    if (merged.published && !canPublishTerm(merged)) {
      return ApiError.badRequest(
        'Cannot publish: the term has blocking contract errors.',
        checkGlossaryContract(merged)
          .filter((f) => f.level === 'error')
          .map((f) => ({ field: f.field, message: f.message, code: 'contract' }))
      );
    }

    const { data, error: dbError } = await supabase!
      .from('glossary_terms')
      .update(parsed.data)
      .eq('id', parsedId.data.id)
      .select()
      .single();

    if (dbError) {
      if (dbError.code === '23505') return ApiError.conflict('That slug is already taken.');
      return ApiError.database(dbError.message);
    }

    return ApiSuccess.ok(data, 'Term updated');
  } catch (err) {
    console.error('[admin/glossary/[id] PATCH]', err);
    return ApiError.internal('Unexpected error updating term');
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
      .from('glossary_terms')
      .delete()
      .eq('id', parsedId.data.id);

    if (dbError) return ApiError.database(dbError.message);
    return ApiSuccess.ok({ id: parsedId.data.id }, 'Term deleted');
  } catch (err) {
    console.error('[admin/glossary/[id] DELETE]', err);
    return ApiError.internal('Unexpected error deleting term');
  }
}

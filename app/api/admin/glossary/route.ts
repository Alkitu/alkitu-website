/**
 * Admin glossary API — list and create.
 *
 * Same auth + validation shape as the blog routes; the gate lives in
 * `lib/schemas/glossary.ts` so the admin UI and any script agree.
 */

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApiSuccess, ApiError } from '@/lib/api/response';
import {
  GlossaryTermInputSchema,
  checkGlossaryContract,
  canPublishTerm,
} from '@/lib/schemas/glossary';

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
    const search = searchParams.get('search');

    let query = supabase!.from('glossary_terms').select('*').order('titulo_es');
    if (search) query = query.ilike('titulo_es', `%${search}%`);

    const { data, error: dbError } = await query;
    if (dbError) return ApiError.database(dbError.message);

    return ApiSuccess.ok(data, 'Terms retrieved');
  } catch (err) {
    console.error('[admin/glossary GET]', err);
    return ApiError.internal('Unexpected error listing terms');
  }
}

export async function POST(request: NextRequest) {
  try {
    const { supabase, error } = await requireAdmin();
    if (error) return error;

    const parsed = GlossaryTermInputSchema.safeParse(await request.json());
    if (!parsed.success) return ApiError.validationError(parsed.error);

    const input = parsed.data;

    if (input.published && !canPublishTerm(input)) {
      return ApiError.badRequest(
        'Cannot publish: the term has blocking contract errors.',
        checkGlossaryContract(input)
          .filter((f) => f.level === 'error')
          .map((f) => ({ field: f.field, message: f.message, code: 'contract' }))
      );
    }

    const { data, error: dbError } = await supabase!
      .from('glossary_terms')
      .insert(input)
      .select()
      .single();

    if (dbError) {
      if (dbError.code === '23505') {
        return ApiError.conflict(`A term with slug "${input.slug}" already exists.`);
      }
      return ApiError.database(dbError.message);
    }

    return ApiSuccess.created(data, 'Term created');
  } catch (err) {
    console.error('[admin/glossary POST]', err);
    return ApiError.internal('Unexpected error creating term');
  }
}

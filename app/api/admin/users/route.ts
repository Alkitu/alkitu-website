import { NextRequest } from 'next/server';
import { z } from 'zod';
import { ApiSuccess, ApiError } from '@/lib/api/response';
import { createClient } from '@/lib/supabase/server';

// Query params schema
const QuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().positive().max(100).default(10),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  email: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (!user || authError) {
      return ApiError.badRequest('Not authenticated');
    }

    // Check admin status
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', user.id)
      .single();

    if (!adminUser || adminError) {
      return ApiError.badRequest('Unauthorized: Admin access required');
    }

    // Parse query params
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const validationResult = QuerySchema.safeParse(searchParams);

    if (!validationResult.success) {
      return ApiError.validationError(validationResult.error);
    }

    const { page, perPage, sortOrder, email } = validationResult.data;

    // Build query for admin_users table
    let query = supabase
      .from('admin_users')
      .select('*', { count: 'exact' });

    // Apply email filter
    if (email) {
      query = query.ilike('email', `%${email}%`);
    }

    // Apply sorting
    query = query.order('created_at', { ascending: sortOrder === 'asc' });

    // Apply pagination
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    query = query.range(from, to);

    const { data: users, error, count } = await query;

    if (error) {
      return ApiError.database('Failed to fetch users', error);
    }

    return ApiSuccess.ok(
      {
        users: users || [],
        total: count || 0,
        page,
        perPage,
      },
      'Users fetched successfully'
    );
  } catch (error) {
    console.error('Error in GET /api/admin/users:', error);
    return ApiError.internal('Failed to fetch users', error);
  }
}

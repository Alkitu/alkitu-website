import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApiSuccess, ApiError } from '@/lib/api/response';
import { z } from 'zod';

// Query parameters validation schema
const QuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(['all', 'pending', 'active', 'inactive', 'unsubscribed']).default('all'),
  locale: z.enum(['all', 'en', 'es']).default('all'),
  search: z.string().nullable().optional(),
});

/**
 * GET /api/admin/newsletter-subscribers
 *
 * List newsletter subscribers with pagination and filters
 *
 * Query Parameters:
 * - page: number (default: 1)
 * - limit: number (default: 20, max: 100)
 * - status: 'all' | 'pending' | 'active' | 'inactive' | 'unsubscribed' (default: 'all')
 * - locale: 'all' | 'en' | 'es' (default: 'all')
 * - search: string (optional) - Search by email
 *
 * Returns:
 * - subscribers: array of subscriber objects
 * - pagination: { total, totalPages, currentPage, limit }
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check admin authentication
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return ApiError.unauthorized('Authentication required');
    }

    // Verify user is admin
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!adminUser) {
      return ApiError.forbidden('Admin access required');
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = {
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      status: searchParams.get('status'),
      locale: searchParams.get('locale'),
      search: searchParams.get('search'),
    };

    const result = QuerySchema.safeParse(queryParams);

    if (!result.success) {
      return ApiError.validationError(result.error);
    }

    const { page, limit, status, locale, search } = result.data;

    // Build Supabase query
    let query = supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact' });

    // Apply status filter
    if (status !== 'all') {
      query = query.eq('status', status);
    }

    // Apply locale filter
    if (locale !== 'all') {
      query = query.eq('locale', locale);
    }

    // Apply search filter
    if (search && search.trim()) {
      query = query.ilike('email', `%${search.trim()}%`);
    }

    // Get total count for pagination
    const { count: totalCount } = await query;
    const total = totalCount || 0;

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Execute query
    const { data: subscribers, error } = await query;

    if (error) {
      console.error('Error fetching subscribers:', error);
      return ApiError.internalError('Failed to fetch subscribers');
    }

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);

    return ApiSuccess.ok({
      subscribers: subscribers || [],
      pagination: {
        total,
        totalPages,
        currentPage: page,
        limit,
      },
    });

  } catch (error) {
    console.error('Admin newsletter subscribers list error:', error);
    return ApiError.internalError('An unexpected error occurred');
  }
}

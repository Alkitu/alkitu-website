import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApiSuccess, ApiError } from '@/lib/api/response';
import type { CategoryWithProjectCount } from '@/lib/types';

/**
 * GET /api/admin/categories
 * Get all categories with optional project count
 *
 * Query params:
 * - include_count: boolean (default: true) - Include project count for each category
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify admin authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return ApiError.badRequest('Authentication required');
    }

    // Verify user is admin
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', user.id)
      .single();

    if (adminError || !adminUser) {
      return ApiError.badRequest('Admin access required');
    }

    // Get query params
    const searchParams = request.nextUrl.searchParams;
    const includeCount = searchParams.get('include_count') !== 'false';

    if (includeCount) {
      // Get categories with project count
      const { data: categories, error } = await supabase
        .from('categories')
        .select(`
          *,
          project_categories (
            id
          )
        `)
        .order('name_en', { ascending: true });

      if (error) {
        console.error('Database error:', error);
        return ApiError.database('Failed to fetch categories', error);
      }

      // Transform data to include project_count
      const categoriesWithCount: CategoryWithProjectCount[] = (categories || []).map((category: any) => ({
        id: category.id,
        name_en: category.name_en,
        name_es: category.name_es,
        slug: category.slug,
        created_at: category.created_at,
        updated_at: category.updated_at,
        project_count: category.project_categories?.length || 0,
      }));

      return ApiSuccess.ok(
        { categories: categoriesWithCount },
        'Categories retrieved successfully'
      );
    } else {
      // Get categories without count
      const { data: categories, error } = await supabase
        .from('categories')
        .select('*')
        .order('name_en', { ascending: true });

      if (error) {
        console.error('Database error:', error);
        return ApiError.database('Failed to fetch categories', error);
      }

      return ApiSuccess.ok(
        { categories: categories || [] },
        'Categories retrieved successfully'
      );
    }
  } catch (error) {
    console.error('Error in GET /api/admin/categories:', error);
    return ApiError.internal('Internal server error', error);
  }
}

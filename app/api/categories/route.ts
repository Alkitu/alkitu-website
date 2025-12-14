import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApiSuccess, ApiError } from '@/lib/api/response';
import type { Category } from '@/lib/types';

/**
 * GET /api/categories
 * Get all categories (public endpoint)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get categories ordered by name
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
  } catch (error) {
    console.error('Error in GET /api/categories:', error);
    return ApiError.internal('Internal server error', error);
  }
}

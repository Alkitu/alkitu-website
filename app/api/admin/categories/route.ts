import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { ApiSuccess, ApiError } from '@/lib/api/response';
import type { CategoryWithProjectCount, CreateProjectCategoryInput } from '@/lib/types';

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

/**
 * Helper function to generate slug from text
 */
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * POST /api/admin/categories
 * Create a new project category
 */
export async function POST(request: NextRequest) {
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

    // Define Zod schema for validation
    const CreateCategorySchema = z.object({
      name_en: z.string().min(1, 'English name is required').max(100, 'English name must be at most 100 characters'),
      name_es: z.string().min(1, 'Spanish name is required').max(100, 'Spanish name must be at most 100 characters'),
      slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be in kebab-case format').optional(),
    });

    // Parse and validate request body
    const body = await request.json();
    const validationResult = CreateCategorySchema.safeParse(body);

    if (!validationResult.success) {
      return ApiError.validationError(validationResult.error);
    }

    const validatedData: CreateProjectCategoryInput = validationResult.data;

    // Auto-generate slug if not provided
    const slug = validatedData.slug || generateSlug(validatedData.name_en);

    // Insert new category
    const { data: newCategory, error: insertError } = await supabase
      .from('categories')
      .insert({
        name_en: validatedData.name_en,
        name_es: validatedData.name_es,
        slug: slug,
      })
      .select()
      .single();

    if (insertError) {
      // Handle unique constraint violations
      if (insertError.code === '23505') { // Postgres unique violation code
        const constraintMatch = insertError.message.match(/Key \((\w+)\)=/);
        const field = constraintMatch ? constraintMatch[1] : 'field';

        let message = 'A category with this value already exists';
        if (field === 'name_en') {
          message = 'A category with this English name already exists';
        } else if (field === 'name_es') {
          message = 'A category with this Spanish name already exists';
        } else if (field === 'slug') {
          message = 'A category with this slug already exists';
        }

        return new Response(
          JSON.stringify({
            success: false,
            error: {
              code: 'DUPLICATE_CATEGORY',
              message: message,
              timestamp: new Date().toISOString(),
            },
          }),
          { status: 409, headers: { 'Content-Type': 'application/json' } }
        );
      }

      console.error('Database error:', insertError);
      return ApiError.database('Failed to create category', insertError);
    }

    return ApiSuccess.created(
      { category: newCategory },
      'Category created successfully'
    );
  } catch (error) {
    console.error('Error in POST /api/admin/categories:', error);
    return ApiError.internal('Internal server error', error);
  }
}

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { ApiSuccess, ApiError } from '@/lib/api/response';
import type { UpdateProjectCategoryInput, CategoryWithProjectCount } from '@/lib/types';

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
 * GET /api/admin/categories/[id]
 * Get a single category by ID with project count
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

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

    // Validate UUID
    const uuidSchema = z.string().uuid();
    const uuidValidation = uuidSchema.safeParse(id);

    if (!uuidValidation.success) {
      return ApiError.badRequest('Invalid category ID format');
    }

    // Get category with project count
    const { data: category, error } = await supabase
      .from('categories')
      .select(`
        *,
        project_categories (
          id
        )
      `)
      .eq('id', id)
      .single();

    if (error || !category) {
      return ApiError.notFound('Category not found');
    }

    // Transform data to include project_count
    const categoryWithCount: CategoryWithProjectCount = {
      id: category.id,
      name_en: category.name_en,
      name_es: category.name_es,
      slug: category.slug,
      created_at: category.created_at,
      updated_at: category.updated_at,
      project_count: category.project_categories?.length || 0,
    };

    return ApiSuccess.ok(
      { category: categoryWithCount },
      'Category retrieved successfully'
    );
  } catch (error) {
    console.error('Error in GET /api/admin/categories/[id]:', error);
    return ApiError.internal('Internal server error', error);
  }
}

/**
 * PATCH /api/admin/categories/[id]
 * Update a category
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

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

    // Validate UUID
    const uuidSchema = z.string().uuid();
    const uuidValidation = uuidSchema.safeParse(id);

    if (!uuidValidation.success) {
      return ApiError.badRequest('Invalid category ID format');
    }

    // Define Zod schema for update validation
    const UpdateCategorySchema = z.object({
      name_en: z.string().min(1, 'English name is required').max(100, 'English name must be at most 100 characters').optional(),
      name_es: z.string().min(1, 'Spanish name is required').max(100, 'Spanish name must be at most 100 characters').optional(),
      slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be in kebab-case format').optional(),
    });

    // Parse and validate request body
    const body = await request.json();
    const validationResult = UpdateCategorySchema.safeParse(body);

    if (!validationResult.success) {
      return ApiError.validationError(validationResult.error);
    }

    const validatedData: UpdateProjectCategoryInput = validationResult.data;

    // Build update object
    const updateData: any = {};

    if (validatedData.name_en !== undefined) {
      updateData.name_en = validatedData.name_en;
    }

    if (validatedData.name_es !== undefined) {
      updateData.name_es = validatedData.name_es;
    }

    // Handle slug logic: regenerate if name_en changed but slug not provided
    if (validatedData.slug !== undefined) {
      updateData.slug = validatedData.slug;
    } else if (validatedData.name_en !== undefined) {
      // Regenerate slug from new name_en
      updateData.slug = generateSlug(validatedData.name_en);
    }

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return ApiError.badRequest('No valid fields to update');
    }

    // Update category
    const { data: updatedCategory, error: updateError } = await supabase
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      // Handle unique constraint violations
      if (updateError.code === '23505') {
        const constraintMatch = updateError.message.match(/Key \((\w+)\)=/);
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

      console.error('Database error:', updateError);
      return ApiError.database('Failed to update category', updateError);
    }

    if (!updatedCategory) {
      return ApiError.notFound('Category not found');
    }

    return ApiSuccess.ok(
      { category: updatedCategory },
      'Category updated successfully'
    );
  } catch (error) {
    console.error('Error in PATCH /api/admin/categories/[id]:', error);
    return ApiError.internal('Internal server error', error);
  }
}

/**
 * DELETE /api/admin/categories/[id]
 * Delete a category (only if not in use by any projects)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

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

    // Validate UUID
    const uuidSchema = z.string().uuid();
    const uuidValidation = uuidSchema.safeParse(id);

    if (!uuidValidation.success) {
      return ApiError.badRequest('Invalid category ID format');
    }

    // Check if category has associated projects
    const { count, error: countError } = await supabase
      .from('project_categories')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', id);

    if (countError) {
      console.error('Database error:', countError);
      return ApiError.database('Failed to check category usage', countError);
    }

    if (count && count > 0) {
      return ApiError.badRequest(
        `Cannot delete category. It is used by ${count} project(s).`
      );
    }

    // Delete category
    const { error: deleteError } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Database error:', deleteError);
      return ApiError.database('Failed to delete category', deleteError);
    }

    return ApiSuccess.ok(
      { id },
      'Category deleted successfully'
    );
  } catch (error) {
    console.error('Error in DELETE /api/admin/categories/[id]:', error);
    return ApiError.internal('Internal server error', error);
  }
}

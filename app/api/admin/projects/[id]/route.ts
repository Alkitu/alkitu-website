import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { ApiSuccess, ApiError } from '@/lib/api/response';
import type { ProjectWithCategories, UpdateProjectInput } from '@/lib/types';

// UUID validation schema
const uuidSchema = z.string().uuid('Invalid project ID format');

// Update project schema
const UpdateProjectSchema = z.object({
  slug: z.string().min(1).optional(),
  title_en: z.string().min(1).optional(),
  title_es: z.string().min(1).optional(),
  description_en: z.string().min(1).optional(),
  description_es: z.string().min(1).optional(),
  about_en: z.string().nullable().optional(),
  about_es: z.string().nullable().optional(),
  image: z.string().url().optional(),
  gallery: z.array(z.string().url()).optional(),
  tags: z.array(z.string()).optional(),
  urls: z.array(z.object({
    name: z.string(),
    url: z.string().url(),
    active: z.boolean().optional(),
    fallback: z.string().optional(),
  })).optional(),
  is_active: z.boolean().optional(),
  display_order: z.number().int().optional(),
  category_ids: z.array(z.string().uuid()).optional(),
});

/**
 * GET /api/admin/projects/[id]
 * Get a single project by ID with its categories
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    // Validate ID
    const idValidation = uuidSchema.safeParse(id);
    if (!idValidation.success) {
      return ApiError.validationError(idValidation.error);
    }

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

    // Get project with categories
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_categories (
          category_id,
          categories (
            id,
            name_en,
            name_es,
            slug
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return ApiError.notFound('Project not found');
      }
      console.error('Database error:', error);
      return ApiError.database('Failed to fetch project', error);
    }

    // Transform data
    const project: ProjectWithCategories = {
      id: data.id,
      legacy_id: data.legacy_id,
      slug: data.slug,
      title_en: data.title_en,
      title_es: data.title_es,
      description_en: data.description_en,
      description_es: data.description_es,
      about_en: data.about_en,
      about_es: data.about_es,
      image: data.image,
      gallery: data.gallery || [],
      tags: data.tags || [],
      urls: data.urls || [],
      is_active: data.is_active,
      display_order: data.display_order,
      created_at: data.created_at,
      updated_at: data.updated_at,
      categories: (data.project_categories || [])
        .map((pc: any) => pc.categories)
        .filter((c: any) => c !== null),
    };

    return ApiSuccess.ok({ project }, 'Project retrieved successfully');
  } catch (error) {
    console.error('Error in GET /api/admin/projects/[id]:', error);
    return ApiError.internal('Internal server error', error);
  }
}

/**
 * PATCH /api/admin/projects/[id]
 * Update a project by ID
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    // Validate ID
    const idValidation = uuidSchema.safeParse(id);
    if (!idValidation.success) {
      return ApiError.validationError(idValidation.error);
    }

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

    // Parse and validate request body
    const body = await request.json();
    const validationResult = UpdateProjectSchema.safeParse(body);

    if (!validationResult.success) {
      return ApiError.validationError(validationResult.error);
    }

    const updateData: UpdateProjectInput = validationResult.data;
    const { category_ids, ...projectData } = updateData;

    // Update project
    const { data: updatedProject, error: updateError } = await supabase
      .from('projects')
      .update(projectData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      if (updateError.code === 'PGRST116') {
        return ApiError.notFound('Project not found');
      }
      console.error('Database error:', updateError);
      return ApiError.database('Failed to update project', updateError);
    }

    // Update categories if provided
    if (category_ids !== undefined) {
      // Delete existing associations
      const { error: deleteError } = await supabase
        .from('project_categories')
        .delete()
        .eq('project_id', id);

      if (deleteError) {
        console.error('Error deleting project categories:', deleteError);
      }

      // Insert new associations
      if (category_ids.length > 0) {
        const associations = category_ids.map((category_id) => ({
          project_id: id,
          category_id,
        }));

        const { error: insertError } = await supabase
          .from('project_categories')
          .insert(associations);

        if (insertError) {
          console.error('Error inserting project categories:', insertError);
          return ApiError.database('Failed to update project categories', insertError);
        }
      }
    }

    // Fetch updated project with categories
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_categories (
          category_id,
          categories (
            id,
            name_en,
            name_es,
            slug
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Database error:', error);
      return ApiError.database('Failed to fetch updated project', error);
    }

    // Transform data
    const project: ProjectWithCategories = {
      id: data.id,
      legacy_id: data.legacy_id,
      slug: data.slug,
      title_en: data.title_en,
      title_es: data.title_es,
      description_en: data.description_en,
      description_es: data.description_es,
      about_en: data.about_en,
      about_es: data.about_es,
      image: data.image,
      gallery: data.gallery || [],
      tags: data.tags || [],
      urls: data.urls || [],
      is_active: data.is_active,
      display_order: data.display_order,
      created_at: data.created_at,
      updated_at: data.updated_at,
      categories: (data.project_categories || [])
        .map((pc: any) => pc.categories)
        .filter((c: any) => c !== null),
    };

    return ApiSuccess.ok({ project }, 'Project updated successfully');
  } catch (error) {
    console.error('Error in PATCH /api/admin/projects/[id]:', error);
    return ApiError.internal('Internal server error', error);
  }
}

/**
 * DELETE /api/admin/projects/[id]
 * Delete a project by ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    // Validate ID
    const idValidation = uuidSchema.safeParse(id);
    if (!idValidation.success) {
      return ApiError.validationError(idValidation.error);
    }

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

    // Delete project (cascade will delete project_categories)
    const { error } = await supabase.from('projects').delete().eq('id', id);

    if (error) {
      if (error.code === 'PGRST116') {
        return ApiError.notFound('Project not found');
      }
      console.error('Database error:', error);
      return ApiError.database('Failed to delete project', error);
    }

    return ApiSuccess.ok({ id }, 'Project deleted successfully');
  } catch (error) {
    console.error('Error in DELETE /api/admin/projects/[id]:', error);
    return ApiError.internal('Internal server error', error);
  }
}

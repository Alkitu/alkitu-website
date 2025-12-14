import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { ApiSuccess, ApiError } from '@/lib/api/response';
import type { ProjectWithCategories, ProjectsListResponse } from '@/lib/types';

// Query params validation schema
const QuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  category_slug: z.string().optional(),
  search: z.string().optional(),
});

/**
 * GET /api/projects
 * Get all active projects (public endpoint)
 *
 * Query params:
 * - page: number (default: 1)
 * - limit: number (default: 20, max: 100)
 * - category_slug: string (category slug for filtering)
 * - search: string (searches in title_en, title_es, description_en, description_es)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Parse and validate query params
    const searchParams = request.nextUrl.searchParams;
    const queryParams = {
      page: searchParams.get('page') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
      category_slug: searchParams.get('category_slug') ?? undefined,
      search: searchParams.get('search') ?? undefined,
    };

    const validationResult = QuerySchema.safeParse(queryParams);
    if (!validationResult.success) {
      return ApiError.validationError(validationResult.error);
    }

    const { page, limit, category_slug, search } = validationResult.data;

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // First, get category_id if category_slug is provided
    let category_id: string | undefined;
    if (category_slug) {
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', category_slug)
        .single();

      if (category) {
        category_id = category.id;
      }
    }

    // Build query
    let query = supabase
      .from('projects')
      .select(`
        *,
        project_categories${category_id ? '!inner' : ''} (
          category_id,
          categories (
            id,
            name_en,
            name_es,
            slug
          )
        )
      `, { count: 'exact' })
      .eq('is_active', true);

    // Apply category filter
    if (category_id) {
      query = query.eq('project_categories.category_id', category_id);
    }

    // Apply search filter
    if (search) {
      query = query.or(`title_en.ilike.%${search}%,title_es.ilike.%${search}%,description_en.ilike.%${search}%,description_es.ilike.%${search}%`);
    }

    // Apply sorting by display_order
    query = query.order('display_order', { ascending: true });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Database error:', error);
      return ApiError.database('Failed to fetch projects', error);
    }

    // Transform data to include categories array
    const projects: ProjectWithCategories[] = (data || []).map((project: any) => ({
      id: project.id,
      legacy_id: project.legacy_id,
      slug: project.slug,
      title_en: project.title_en,
      title_es: project.title_es,
      description_en: project.description_en,
      description_es: project.description_es,
      about_en: project.about_en,
      about_es: project.about_es,
      image: project.image,
      gallery: project.gallery || [],
      tags: project.tags || [],
      urls: project.urls || [],
      is_active: project.is_active,
      display_order: project.display_order,
      created_at: project.created_at,
      updated_at: project.updated_at,
      categories: (project.project_categories || [])
        .map((pc: any) => pc.categories)
        .filter((c: any) => c !== null),
    }));

    const response: ProjectsListResponse = {
      projects,
      pagination: {
        total: count || 0,
        page,
        limit,
        total_pages: Math.ceil((count || 0) / limit),
      },
    };

    return ApiSuccess.ok(response, 'Projects retrieved successfully');
  } catch (error) {
    console.error('Error in GET /api/projects:', error);
    return ApiError.internal('Internal server error', error);
  }
}

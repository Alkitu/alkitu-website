import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { ApiSuccess, ApiError } from '@/lib/api/response';
import type { ProjectWithCategories, ProjectsListResponse, CreateProjectInput } from '@/lib/types';

// Query params validation schema
const QuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  category_id: z.string().uuid().optional(),
  is_active: z.enum(['true', 'false']).optional(),
  search: z.string().optional(),
  sort_by: z.enum(['created_at', 'updated_at', 'display_order', 'title_en', 'title_es']).optional().default('display_order'),
  sort_order: z.enum(['asc', 'desc']).optional().default('asc'),
});

// Create project schema
const CreateProjectSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
  title_en: z.string().min(1, 'English title is required'),
  title_es: z.string().min(1, 'Spanish title is required'),
  description_en: z.string().min(1, 'English description is required'),
  description_es: z.string().min(1, 'Spanish description is required'),
  about_en: z.string().nullable().optional(),
  about_es: z.string().nullable().optional(),
  image: z.string().url('Image must be a valid URL'),
  gallery: z.array(z.string().url()).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
  urls: z.array(z.object({
    name: z.string(),
    url: z.string().url(),
    active: z.boolean().optional(),
    fallback: z.string().optional(),
  })).optional().default([]),
  is_active: z.boolean().optional().default(true),
  display_order: z.number().int().optional().default(0),
  category_ids: z.array(z.string().uuid()).min(1, 'At least one category is required'),
});

/**
 * GET /api/admin/projects
 * Get all projects with optional filters and pagination
 *
 * Query params:
 * - page: number (default: 1)
 * - limit: number (default: 20, max: 100)
 * - category_id: string (UUID)
 * - is_active: boolean
 * - search: string (searches in title_en, title_es, description_en, description_es)
 * - sort_by: 'created_at' | 'updated_at' | 'display_order' | 'title_en' | 'title_es' (default: 'display_order')
 * - sort_order: 'asc' | 'desc' (default: 'asc')
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

    // Parse and validate query params
    const searchParams = request.nextUrl.searchParams;
    const queryParams = {
      page: searchParams.get('page') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
      category_id: searchParams.get('category_id') ?? undefined,
      is_active: searchParams.get('is_active') ?? undefined,
      search: searchParams.get('search') ?? undefined,
      sort_by: searchParams.get('sort_by') ?? undefined,
      sort_order: searchParams.get('sort_order') ?? undefined,
    };

    const validationResult = QuerySchema.safeParse(queryParams);
    if (!validationResult.success) {
      return ApiError.validationError(validationResult.error);
    }

    const { page, limit, category_id, is_active, search, sort_by, sort_order } = validationResult.data;

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

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
      `, { count: 'exact' });

    // Apply filters
    if (category_id) {
      query = query.eq('project_categories.category_id', category_id);
    }

    if (is_active !== undefined) {
      query = query.eq('is_active', is_active === 'true');
    }

    if (search) {
      query = query.or(`title_en.ilike.%${search}%,title_es.ilike.%${search}%,description_en.ilike.%${search}%,description_es.ilike.%${search}%`);
    }

    // Apply sorting
    query = query.order(sort_by, { ascending: sort_order === 'asc' });

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
    console.error('Error in GET /api/admin/projects:', error);
    return ApiError.internal('Internal server error', error);
  }
}

/**
 * POST /api/admin/projects
 * Create a new project
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

    // Parse and validate request body
    const body = await request.json();
    const validationResult = CreateProjectSchema.safeParse(body);

    if (!validationResult.success) {
      return ApiError.validationError(validationResult.error);
    }

    const createData: CreateProjectInput = validationResult.data;
    const { category_ids, ...projectData } = createData;

    // Create project
    const { data: newProject, error: createError } = await supabase
      .from('projects')
      .insert(projectData)
      .select()
      .single();

    if (createError) {
      console.error('Database error:', createError);
      return ApiError.database('Failed to create project', createError);
    }

    // Create project-category associations
    if (category_ids.length > 0) {
      const associations = category_ids.map((category_id) => ({
        project_id: newProject.id,
        category_id,
      }));

      const { error: insertError } = await supabase
        .from('project_categories')
        .insert(associations);

      if (insertError) {
        console.error('Error inserting project categories:', insertError);
        // Rollback: delete the project
        await supabase.from('projects').delete().eq('id', newProject.id);
        return ApiError.database('Failed to create project categories', insertError);
      }
    }

    // Fetch created project with categories
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
      .eq('id', newProject.id)
      .single();

    if (error) {
      console.error('Database error:', error);
      return ApiError.database('Failed to fetch created project', error);
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

    return ApiSuccess.created({ project }, 'Project created successfully');
  } catch (error) {
    console.error('Error in POST /api/admin/projects:', error);
    return ApiError.internal('Internal server error', error);
  }
}

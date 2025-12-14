import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApiSuccess, ApiError } from '@/lib/api/response';
import type { ProjectWithCategories } from '@/lib/types';

/**
 * GET /api/projects/[slug]
 * Get a single project by slug (public endpoint)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = await createClient();

    // Fetch project with categories
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
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return ApiError.notFound('Project not found');
    }

    // Transform data to include categories array
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
    console.error('Error in GET /api/projects/[slug]:', error);
    return ApiError.internal('Internal server error', error);
  }
}

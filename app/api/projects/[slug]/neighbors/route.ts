import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApiSuccess, ApiError } from '@/lib/api/response';

/**
 * GET /api/projects/[slug]/neighbors
 * Get previous and next projects by display_order (for navigation)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = await createClient();

    // Get current project's display_order
    const { data: current, error: currentError } = await supabase
      .from('projects')
      .select('display_order')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (currentError || !current) {
      return ApiError.notFound('Project not found');
    }

    const order = current.display_order;

    // Get previous project (lower display_order, or wrap to last)
    const { data: prev } = await supabase
      .from('projects')
      .select('slug, title_en, title_es, image')
      .eq('is_active', true)
      .lt('display_order', order)
      .order('display_order', { ascending: false })
      .limit(1)
      .single();

    // Get next project (higher display_order, or wrap to first)
    const { data: next } = await supabase
      .from('projects')
      .select('slug, title_en, title_es, image')
      .eq('is_active', true)
      .gt('display_order', order)
      .order('display_order', { ascending: true })
      .limit(1)
      .single();

    // Wrap around: if no prev, get the last project; if no next, get the first
    let prevProject = prev;
    let nextProject = next;

    if (!prevProject) {
      const { data: last } = await supabase
        .from('projects')
        .select('slug, title_en, title_es, image')
        .eq('is_active', true)
        .neq('slug', slug)
        .order('display_order', { ascending: false })
        .limit(1)
        .single();
      prevProject = last;
    }

    if (!nextProject) {
      const { data: first } = await supabase
        .from('projects')
        .select('slug, title_en, title_es, image')
        .eq('is_active', true)
        .neq('slug', slug)
        .order('display_order', { ascending: true })
        .limit(1)
        .single();
      nextProject = first;
    }

    return ApiSuccess.ok({
      prev: prevProject,
      next: nextProject,
    }, 'Neighbors retrieved successfully');
  } catch (error) {
    console.error('Error in GET /api/projects/[slug]/neighbors:', error);
    return ApiError.internal('Internal server error', error);
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/admin/contact-submissions
 *
 * Fetches contact form submissions with filtering and pagination
 *
 * Query Parameters:
 * - page: Page number (default: 1)
 * - perPage: Items per page (default: 10)
 * - sortOrder: 'asc' | 'desc' (default: 'desc')
 * - search: Search term for name, email, or subject
 * - status: Filter by status ('pending' | 'read' | 'replied' | 'archived')
 *
 * Returns:
 * {
 *   data: {
 *     submissions: ContactSubmission[],
 *     total: number,
 *     page: number,
 *     perPage: number
 *   }
 * }
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify admin authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify user is admin
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', user.id)
      .single();

    if (adminError || !adminUser) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    // Parse query parameters
    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const perPage = parseInt(searchParams.get('perPage') || '10', 10);
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    // Build query
    let query = supabase
      .from('contact_submissions')
      .select('*', { count: 'exact' });

    // Apply search filter
    if (search && search.trim()) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,subject.ilike.%${search}%`);
    }

    // Apply status filter
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    // Apply sorting
    query = query.order('created_at', { ascending: sortOrder === 'asc' });

    // Apply pagination
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    query = query.range(from, to);

    // Execute query
    const { data: submissions, error, count } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch contact submissions', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: {
        submissions: submissions || [],
        total: count || 0,
        page,
        perPage,
      }
    });

  } catch (error) {
    console.error('Unexpected error in GET /api/admin/contact-submissions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

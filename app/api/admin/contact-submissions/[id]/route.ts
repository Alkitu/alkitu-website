import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const updateStatusSchema = z.object({
  status: z.enum(['pending', 'read', 'replied', 'archived']),
});

/**
 * PATCH /api/admin/contact-submissions/[id]
 *
 * Updates the status of a contact form submission
 *
 * Body:
 * {
 *   status: 'pending' | 'read' | 'replied' | 'archived'
 * }
 *
 * Returns:
 * {
 *   data: {
 *     id: string,
 *     status: string,
 *     updated_at: string
 *   }
 * }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // Parse request body
    const body = await request.json();
    const validationResult = updateStatusSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid data',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { status } = validationResult.data;
    const { id } = await params;

    // Update submission status
    const { data: updatedSubmission, error: updateError } = await supabase
      .from('contact_submissions')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('id, status, updated_at')
      .single();

    if (updateError) {
      console.error('Database error:', updateError);

      if (updateError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Contact submission not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to update contact submission', details: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: updatedSubmission,
    });

  } catch (error) {
    console.error('Unexpected error in PATCH /api/admin/contact-submissions/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

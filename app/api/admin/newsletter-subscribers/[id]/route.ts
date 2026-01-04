import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApiSuccess, ApiError } from '@/lib/api/response';

/**
 * DELETE /api/admin/newsletter-subscribers/[id]
 *
 * Delete a newsletter subscriber by ID
 *
 * Path Parameters:
 * - id: UUID of the subscriber to delete
 *
 * Returns:
 * - Success message
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return ApiError.badRequest('Invalid subscriber ID format');
    }

    const supabase = await createClient();

    // Check admin authentication
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return ApiError.unauthorized('Authentication required');
    }

    // Verify user is admin
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!adminUser) {
      return ApiError.forbidden('Admin access required');
    }

    // Check if subscriber exists
    const { data: existingSubscriber, error: fetchError } = await supabase
      .from('newsletter_subscribers')
      .select('id, email')
      .eq('id', id)
      .single();

    if (fetchError || !existingSubscriber) {
      return ApiError.notFound('Subscriber not found');
    }

    // Delete the subscriber
    const { error: deleteError } = await supabase
      .from('newsletter_subscribers')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting subscriber:', deleteError);
      return ApiError.internalError('Failed to delete subscriber');
    }

    return ApiSuccess.ok(
      { id, email: existingSubscriber.email },
      'Subscriber deleted successfully'
    );

  } catch (error) {
    console.error('Delete newsletter subscriber error:', error);
    return ApiError.internalError('An unexpected error occurred');
  }
}

import { NextRequest } from 'next/server';
import { ApiSuccess, ApiError } from '@/lib/api/response';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (!user || authError) {
      return ApiError.badRequest('Not authenticated');
    }

    // Update last_login_at timestamp
    const { error: updateError } = await supabase
      .from('admin_users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', user.id);

    if (updateError) {
      return ApiError.database('Failed to update last login', updateError);
    }

    return ApiSuccess.ok({ updated: true }, 'Last login updated successfully');
  } catch (error) {
    console.error('Error in POST /api/admin/update-last-login:', error);
    return ApiError.internal('Failed to update last login', error);
  }
}

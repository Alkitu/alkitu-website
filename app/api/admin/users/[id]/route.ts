import { NextRequest } from 'next/server';
import { z } from 'zod';
import { ApiSuccess, ApiError } from '@/lib/api/response';
import { createClient } from '@/lib/supabase/server';

// Update user schema
const UpdateUserSchema = z.object({
  full_name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (!user || authError) {
      return ApiError.badRequest('Not authenticated');
    }

    // Check admin status
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', user.id)
      .single();

    if (!adminUser || adminError) {
      return ApiError.badRequest('Unauthorized: Admin access required');
    }

    // Fetch user
    const { data: targetUser, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !targetUser) {
      return ApiError.notFound('User not found');
    }

    return ApiSuccess.ok(targetUser, 'User fetched successfully');
  } catch (error) {
    console.error('Error in GET /api/admin/users/[id]:', error);
    return ApiError.internal('Failed to fetch user', error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (!user || authError) {
      return ApiError.badRequest('Not authenticated');
    }

    // Check admin status
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', user.id)
      .single();

    if (!adminUser || adminError) {
      return ApiError.badRequest('Unauthorized: Admin access required');
    }

    // Validate input
    const validationResult = UpdateUserSchema.safeParse(body);

    if (!validationResult.success) {
      return ApiError.validationError(validationResult.error);
    }

    const { full_name, email, password } = validationResult.data;

    // Only allow password change for the logged-in user
    if (password && id !== user.id) {
      return ApiError.badRequest('You can only change your own password');
    }

    // Update admin_users table
    const updateData: any = {};
    if (full_name !== undefined) updateData.full_name = full_name;
    if (email !== undefined) updateData.email = email;

    if (Object.keys(updateData).length > 0) {
      const { error: updateError } = await supabase
        .from('admin_users')
        .update(updateData)
        .eq('id', id);

      if (updateError) {
        return ApiError.database('Failed to update user', updateError);
      }
    }

    // Update password in auth.users if provided
    if (password) {
      const { error: passwordError } = await supabase.auth.updateUser({
        password,
      });

      if (passwordError) {
        return ApiError.database('Failed to update password', passwordError);
      }
    }

    // Fetch updated user
    const { data: updatedUser, error: fetchError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      return ApiError.database('Failed to fetch updated user', fetchError);
    }

    return ApiSuccess.ok(updatedUser, 'User updated successfully');
  } catch (error) {
    console.error('Error in PATCH /api/admin/users/[id]:', error);
    return ApiError.internal('Failed to update user', error);
  }
}

/**
 * API Route: Delete Profile Photo
 *
 * DELETE /api/admin/profiles/delete-photo
 *
 * Deletes profile photo from Vercel Blob Storage.
 * Only authenticated admin users can delete their own photos (or super admins can delete any).
 *
 * @requires Authentication - User must be logged in as admin
 * @storage Vercel Blob - Deletes from 'profile-photos' folder
 */

// ... imports
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PhotoDeleteSchema } from '@/lib/schemas/profiles';

/**
 * DELETE - Delete profile photo from Supabase Storage
 *
 * Request body: { url: string }
 * Response: { success: boolean, message: string }
 */
export async function DELETE(request: NextRequest) {
  try {
    // =====================================================
    // Step 1: Verify Authentication
    // =====================================================

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'You must be logged in to delete photos',
        },
        { status: 401 }
      );
    }

    // Verify user is admin
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('id, role')
      .eq('id', user.id)
      .single();

    if (adminError || !adminUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'Forbidden',
          message: 'Only admin users can delete photos',
        },
        { status: 403 }
      );
    }

    const isSuperAdmin = adminUser.role === 'super_admin';

    // =====================================================
    // Step 2: Parse and Validate Request
    // =====================================================

    const body = await request.json();
    const validationResult = PhotoDeleteSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation Error',
          message: 'Invalid request',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { url } = validationResult.data;

    // =====================================================
    // Step 3: Verify Ownership (unless super admin)
    // =====================================================

    if (!isSuperAdmin) {
      // Check if the photo URL belongs to the current user's profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('user_id, photo_url')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        return NextResponse.json(
          {
            success: false,
            error: 'Not Found',
            message: 'Profile not found',
          },
          { status: 404 }
        );
      }

      if (profile.photo_url !== url) {
        return NextResponse.json(
          {
            success: false,
            error: 'Forbidden',
            message: 'You can only delete your own photos',
          },
          { status: 403 }
        );
      }
    }

    // =====================================================
    // Step 4: Delete from Supabase Storage
    // =====================================================

    try {
      // Extract file path from URL
      // URL format: .../storage/v1/object/public/profile-photos/filename.ext
      const urlParts = url.split('/profile-photos/');
      if (urlParts.length < 2) {
         console.warn('[Delete Photo] Could not extract path from URL:', url);
      } else {
        const filePath = urlParts[1];
        
        const { error: deleteError } = await supabase.storage
          .from('profile-photos')
          .remove([filePath]);

        if (deleteError) {
           console.error('[Delete Photo] Storage deletion failed:', deleteError);
           // We continue to update DB even if storage fails (orphan handling)
        }
      }
    } catch (storageError) {
      console.warn('[Delete Photo] Storage operation failed:', storageError);
    }

    // =====================================================
    // Step 5: Update Database (remove photo_url)
    // =====================================================

    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ photo_url: null })
      .eq('photo_url', url);

    if (updateError) {
      console.error('[Delete Photo] Database update failed:', updateError);
      return NextResponse.json(
        {
          success: false,
          error: 'Database Error',
          message: 'Failed to update profile after deleting photo',
        },
        { status: 500 }
      );
    }

    // =====================================================
    // Step 6: Return Response
    // =====================================================

    return NextResponse.json(
      {
        success: true,
        message: 'Photo deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Delete Photo API Error]:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
        message: 'An unexpected error occurred while deleting the photo',
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS - CORS preflight
 */
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}

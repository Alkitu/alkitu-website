/**
 * API Route: Get and Update User Profile
 *
 * GET    /api/admin/profiles/[id] - Get full profile (owner or super admin)
 * PATCH  /api/admin/profiles/[id] - Update profile (owner or super admin)
 *
 * @requires Authentication - User must be logged in as admin
 * @permissions Owner can access/update own profile, super admins can access/update any profile
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ProfileIdParamSchema, UpdateProfileSchema } from '@/lib/schemas/profiles';

/**
 * GET - Retrieve full user profile
 *
 * URL params: { id: UUID }
 * Response: Full profile with all fields (including private ones)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
          message: 'You must be logged in to view profiles',
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
          message: 'Only admin users can access this endpoint',
        },
        { status: 403 }
      );
    }

    const isSuperAdmin = adminUser.role === 'super_admin';

    // =====================================================
    // Step 2: Validate Parameters
    // =====================================================

    const resolvedParams = await params;
    const validationResult = ProfileIdParamSchema.safeParse({ id: resolvedParams.id });

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation Error',
          message: 'Invalid profile ID',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { id: profileId } = validationResult.data;

    // =====================================================
    // Step 3: Fetch Profile
    // =====================================================

    // First, get the profile to check ownership
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', profileId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not Found',
          message: 'Profile not found',
        },
        { status: 404 }
      );
    }

    // =====================================================
    // Step 4: Check Permissions
    // =====================================================

    const isOwner = profile.user_id === user.id;

    if (!isOwner && !isSuperAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: 'Forbidden',
          message: 'You can only view your own profile',
        },
        { status: 403 }
      );
    }

    // =====================================================
    // Step 5: Return Profile
    // =====================================================

    return NextResponse.json(
      {
        success: true,
        message: 'Profile retrieved successfully',
        data: profile,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Get Profile API Error]:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
        message: 'An unexpected error occurred while retrieving the profile',
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH - Update user profile
 *
 * URL params: { id: UUID }
 * Request body: Partial profile data (UpdateProfileInput)
 * Response: Updated profile
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
          message: 'You must be logged in to update profiles',
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
          message: 'Only admin users can update profiles',
        },
        { status: 403 }
      );
    }

    const isSuperAdmin = adminUser.role === 'super_admin';

    // =====================================================
    // Step 2: Validate Parameters and Body
    // =====================================================

    const resolvedParams = await params;
    const paramValidation = ProfileIdParamSchema.safeParse({ id: resolvedParams.id });

    if (!paramValidation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation Error',
          message: 'Invalid profile ID',
          details: paramValidation.error.issues,
        },
        { status: 400 }
      );
    }

    const { id: profileId } = paramValidation.data;

    const body = await request.json();
    const bodyValidation = UpdateProfileSchema.safeParse(body);

    if (!bodyValidation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation Error',
          message: 'Invalid profile data',
          details: bodyValidation.error.issues,
        },
        { status: 400 }
      );
    }

    const updateData = bodyValidation.data;

    // =====================================================
    // Step 3: Check Profile Exists and Permissions
    // =====================================================

    const { data: existingProfile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('user_id')
      .eq('id', profileId)
      .single();

    if (fetchError || !existingProfile) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not Found',
          message: 'Profile not found',
        },
        { status: 404 }
      );
    }

    const isOwner = existingProfile.user_id === user.id;

    if (!isOwner && !isSuperAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: 'Forbidden',
          message: 'You can only update your own profile',
        },
        { status: 403 }
      );
    }

    // =====================================================
    // Step 4: Update Profile
    // =====================================================

    const { data: updatedProfile, error: updateError } = await supabase
      .from('user_profiles')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', profileId)
      .select()
      .single();

    if (updateError) {
      console.error('[Update Profile] Database error:', updateError);
      return NextResponse.json(
        {
          success: false,
          error: 'Database Error',
          message: 'Failed to update profile',
          details: updateError.message,
        },
        { status: 500 }
      );
    }

    // =====================================================
    // Step 5: Return Updated Profile
    // =====================================================

    return NextResponse.json(
      {
        success: true,
        message: 'Profile updated successfully',
        data: updatedProfile,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Update Profile API Error]:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
        message: 'An unexpected error occurred while updating the profile',
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
        'Access-Control-Allow-Methods': 'GET, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}

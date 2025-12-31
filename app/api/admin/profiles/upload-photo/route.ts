/**
 * API Route: Upload Profile Photo
 *
 * POST /api/admin/profiles/upload-photo
 *
 * Handles profile photo uploads to Vercel Blob Storage.
 * Only authenticated admin users can upload photos.
 *
 * @requires Authentication - User must be logged in as admin
 * @storage Vercel Blob - Photos stored in 'profile-photos' folder
 */

// ... imports
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PhotoUploadSchema } from '@/lib/schemas/profiles';

/**
 * POST - Upload profile photo to Supabase Storage
 *
 * Request body: FormData with 'file' field
 * Response: { url, pathname, contentType, uploadedAt }
 */
export async function POST(request: NextRequest) {
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
          message: 'You must be logged in to upload photos',
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
          message: 'Only admin users can upload photos',
        },
        { status: 403 }
      );
    }

    // =====================================================
    // Step 2: Parse and Validate File
    // =====================================================

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation Error',
          message: 'No file provided',
        },
        { status: 400 }
      );
    }

    // Validate file metadata
    const validationResult = PhotoUploadSchema.safeParse({
      filename: file.name,
      contentType: file.type,
      size: file.size,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation Error',
          message: 'Invalid file',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    // =====================================================
    // Step 3: Upload to Supabase Storage
    // =====================================================

    // Generate unique filename: {userId}_{timestamp}_{originalFilename}
    const timestamp = Date.now();
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${user.id}_${timestamp}_${sanitizedFilename}`;

    // Upload file
    const { error: uploadError } = await supabase.storage
      .from('profile-photos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('[Upload Photo] Storage error:', uploadError);
      throw new Error(`Storage upload failed: ${uploadError.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(filePath);

    // =====================================================
    // Step 4: Return Response
    // =====================================================

    return NextResponse.json(
      {
        success: true,
        message: 'Photo uploaded successfully',
        data: {
          url: publicUrl,
          pathname: filePath,
          contentType: file.type,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[Upload Photo API Error]:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
        message: 'An unexpected error occurred while uploading the photo',
        details: error instanceof Error ? error.message : String(error),
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
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}

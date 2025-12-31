/**
 * API Route: Public User Profile
 *
 * GET /api/profiles/[username] - Get public profile by username
 *
 * @public No authentication required
 * @privacy Returns only fields marked as public via privacy toggles
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAnalyticsClient } from '@/lib/supabase/analytics';
import { UsernameParamSchema } from '@/lib/schemas/profiles';
import type {
  PublicUserProfile,
  ProfileUrl,
  ProfileRole,
  ProfilePhoneNumber,
  ProfileEmail,
  ProfileSkill,
  ProfileLanguage,
  ProfileAddress,
} from '@/lib/types/profiles';

/**
 * Filter array items based on is_public flag
 */
function filterPublicItems<T extends { is_public: boolean }>(items: T[]): T[] {
  return items.filter((item) => item.is_public);
}

/**
 * GET - Retrieve public profile by username
 *
 * URL params: { username: string }
 * Response: Public profile data (privacy-filtered)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    // =====================================================
    // Step 1: Validate Parameters
    // =====================================================

    const resolvedParams = await params;
    const validationResult = UsernameParamSchema.safeParse({
      username: resolvedParams.username,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation Error',
          message: 'Invalid username',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { username } = validationResult.data;

    // =====================================================
    // Step 2: Fetch Profile
    // =====================================================

    // Use analytics client (no auth required)
    const supabase = createAnalyticsClient();

    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not Found',
          message: `Profile with username "${username}" not found`,
        },
        { status: 404 }
      );
    }

    // =====================================================
    // Step 3: Apply Privacy Filtering
    // =====================================================

    // Filter personal information
    const first_name = profile.first_name_is_public ? profile.first_name : null;
    const last_name = profile.last_name_is_public ? profile.last_name : null;
    const pronouns = profile.pronouns_is_public ? profile.pronouns : null;
    const date_of_birth = profile.date_of_birth_is_public ? profile.date_of_birth : null;

    // Filter bio
    const bio = profile.bio_is_public ? profile.bio : null;

    // Filter professional information
    const job_title = profile.job_title_is_public ? profile.job_title : null;
    const department = profile.department_is_public ? profile.department : null;

    // Filter location
    const location = profile.location_is_public ? profile.location : null;

    // Filter array-item-level privacy
    const urls = filterPublicItems<ProfileUrl>(profile.urls || []);
    const roles = filterPublicItems<ProfileRole>(profile.roles || []);
    const phone_numbers = filterPublicItems<ProfilePhoneNumber>(profile.phone_numbers || []);
    const emails = filterPublicItems<ProfileEmail>(profile.emails || []);
    const hard_skills = filterPublicItems<ProfileSkill>(profile.hard_skills || []);
    const soft_skills = filterPublicItems<ProfileSkill>(profile.soft_skills || []);
    const languages = filterPublicItems<ProfileLanguage>(profile.languages || []);
    const addresses = filterPublicItems<ProfileAddress>(profile.addresses || []);

    // Build public profile (exclude private fields)
    const publicProfile: PublicUserProfile = {
      username: profile.username,

      // Photos & Banner (always public)
      photo_url: profile.photo_url,
      banner_url: profile.banner_url,

      // Personal Information (privacy-filtered)
      first_name,
      last_name,
      display_name: profile.display_name, // Always public if set
      pronouns,
      date_of_birth,

      // Bio
      bio,

      // Professional Information (privacy-filtered)
      job_title,
      department,

      // Location (privacy-filtered)
      location,
      remote_work: profile.remote_work || false,
      timezone: profile.timezone || 'America/New_York',

      // JSONB Arrays (privacy-filtered)
      urls,
      roles,
      phone_numbers,
      emails,
      hard_skills,
      soft_skills,
      languages,
      addresses,

      // Visual Preferences (always public)
      profile_color: profile.profile_color || '#00BB31',
      theme_preference: profile.theme_preference || 'system',
    };

    // =====================================================
    // Step 4: Return Public Profile
    // =====================================================

    return NextResponse.json(
      {
        success: true,
        message: 'Public profile retrieved successfully',
        data: publicProfile,
      },
      {
        status: 200,
        headers: {
          // Cache for 5 minutes
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error('[Get Public Profile API Error]:', error);

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
 * OPTIONS - CORS preflight
 */
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*', // Public endpoint
      },
    }
  );
}

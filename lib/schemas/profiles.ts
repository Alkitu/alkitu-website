/**
 * User Profiles Validation Schemas
 *
 * Zod schemas for validating profile data in API routes and forms.
 * Ensures data integrity and provides type-safe validation.
 */

import { z } from 'zod';

// =====================================================
// Basic Field Validators
// =====================================================

/**
 * URL validator with protocol requirement
 */
const urlSchema = z
  .string()
  .url({ message: 'Must be a valid URL' })
  .min(1, 'URL is required')
  .max(500, 'URL must be less than 500 characters');

/**
 * Email validator
 */
const emailSchema = z
  .string()
  .email({ message: 'Must be a valid email address' })
  .min(1, 'Email is required')
  .max(100, 'Email must be less than 100 characters');

/**
 * Phone number validator (international format)
 * Accepts: +1234567890, +12 345 678 90, (123) 456-7890, etc.
 */
const phoneSchema = z
  .string()
  .min(1, 'Phone number is required')
  .max(20, 'Phone number must be less than 20 characters')
  .regex(
    /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/,
    'Must be a valid phone number'
  );

/**
 * Username validator (lowercase, alphanumeric, hyphens, underscores)
 */
const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must be less than 30 characters')
  .regex(
    /^[a-z0-9_-]+$/,
    'Username can only contain lowercase letters, numbers, hyphens, and underscores'
  );

/**
 * Bio validator (no character limit)
 */
const bioSchema = z
  .string()
  .optional()
  .nullable();

/**
 * Department validator
 */
const departmentSchema = z
  .string()
  .min(1, 'Department is required')
  .max(100, 'Department must be less than 100 characters')
  .optional()
  .nullable();

/**
 * Role name validator
 */
const roleNameSchema = z
  .string()
  .min(1, 'Role is required')
  .max(100, 'Role must be less than 100 characters');

/**
 * URL name validator (label for URL)
 */
const urlNameSchema = z
  .string()
  .min(1, 'URL name is required')
  .max(50, 'URL name must be less than 50 characters');

/**
 * Name field validator (first/last name)
 */
const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(100, 'Name must be less than 100 characters')
  .optional()
  .nullable();

/**
 * Display name validator
 */
const displayNameSchema = z
  .string()
  .min(1, 'Display name is required')
  .max(100, 'Display name must be less than 100 characters')
  .optional()
  .nullable();

/**
 * Pronouns validator
 */
const pronounsSchema = z
  .string()
  .min(1, 'Pronouns are required')
  .max(50, 'Pronouns must be less than 50 characters')
  .optional()
  .nullable();

/**
 * Date validator (ISO date string)
 */
const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be a valid date (YYYY-MM-DD)')
  .optional()
  .nullable();

/**
 * Timezone validator
 */
const timezoneSchema = z
  .string()
  .min(1, 'Timezone is required')
  .optional();

/**
 * Job title validator
 */
const jobTitleSchema = z
  .string()
  .min(1, 'Job title is required')
  .max(100, 'Job title must be less than 100 characters')
  .optional()
  .nullable();

/**
 * Location validator
 */
const locationSchema = z
  .string()
  .min(1, 'Location is required')
  .max(100, 'Location must be less than 100 characters')
  .optional()
  .nullable();

/**
 * Hex color validator (#RRGGBB)
 */
const hexColorSchema = z
  .string()
  .regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color (#RRGGBB)')
  .optional();

/**
 * Language preference validator (ISO language code)
 */
const languagePreferenceSchema = z
  .string()
  .length(2, 'Must be a 2-letter language code')
  .optional();

// =====================================================
// JSONB Array Item Schemas
// =====================================================

/**
 * Profile URL schema
 * Validates: { urlName: string, url: string, display_order: number, is_public: boolean }
 */
export const ProfileUrlSchema = z.object({
  urlName: urlNameSchema,
  url: urlSchema,
  display_order: z.number().int().min(0),
  is_public: z.boolean().default(false),
});

/**
 * Profile Role schema
 * Validates: { role: string, display_order: number, is_public: boolean }
 */
export const ProfileRoleSchema = z.object({
  role: roleNameSchema,
  display_order: z.number().int().min(0),
  is_public: z.boolean().default(false),
});

/**
 * Profile Phone Number schema
 * Validates: { type: 'work' | 'personal', number: string, is_public: boolean }
 */
export const ProfilePhoneNumberSchema = z.object({
  type: z.enum(['work', 'personal']),
  number: phoneSchema,
  is_public: z.boolean().default(false),
});

/**
 * Profile Email schema
 * Validates: { type: 'work' | 'personal', email: string, is_public: boolean }
 */
export const ProfileEmailSchema = z.object({
  type: z.enum(['work', 'personal']),
  email: emailSchema,
  is_public: z.boolean().default(false),
});

/**
 * Profile Skill schema
 * Validates: { skill: string, display_order: number, is_public: boolean }
 */
export const ProfileSkillSchema = z.object({
  skill: z.string().min(1, 'Skill name is required').max(100, 'Skill name must be less than 100 characters'),
  display_order: z.number().int().min(0),
  is_public: z.boolean().default(true),
});

/**
 * Profile Language schema
 * Validates: { language: string, proficiency: 'native' | 'fluent' | 'intermediate' | 'basic', display_order: number, is_public: boolean }
 */
export const ProfileLanguageSchema = z.object({
  language: z.string().min(1, 'Language name is required').max(100, 'Language name must be less than 100 characters'),
  proficiency: z.enum(['native', 'fluent', 'intermediate', 'basic']),
  display_order: z.number().int().min(0),
  is_public: z.boolean().default(true),
});

/**
 * Profile Address schema
 * Validates: { type: 'office' | 'home', address: string, is_public: boolean }
 */
export const ProfileAddressSchema = z.object({
  type: z.enum(['office', 'home']),
  address: z.string().min(1, 'Address is required').max(300, 'Address must be less than 300 characters'),
  is_public: z.boolean().default(false),
});

// =====================================================
// Array Validators
// =====================================================

/**
 * URLs array validator (max 10 URLs)
 */
const urlsArraySchema = z
  .array(ProfileUrlSchema)
  .max(10, 'Maximum 10 URLs allowed')
  .default([]);

/**
 * Roles array validator (max 5 roles)
 */
const rolesArraySchema = z
  .array(ProfileRoleSchema)
  .max(5, 'Maximum 5 roles allowed')
  .default([]);

/**
 * Phone numbers array validator (max 3 phone numbers)
 */
const phoneNumbersArraySchema = z
  .array(ProfilePhoneNumberSchema)
  .max(3, 'Maximum 3 phone numbers allowed')
  .default([]);

/**
 * Emails array validator (max 3 emails)
 */
const emailsArraySchema = z
  .array(ProfileEmailSchema)
  .max(3, 'Maximum 3 emails allowed')
  .default([]);

/**
 * Hard skills array validator (no limit)
 */
const hardSkillsArraySchema = z
  .array(ProfileSkillSchema)
  .default([]);

/**
 * Soft skills array validator (no limit)
 */
const softSkillsArraySchema = z
  .array(ProfileSkillSchema)
  .default([]);

/**
 * Languages array validator (max 10 languages)
 */
const languagesArraySchema = z
  .array(ProfileLanguageSchema)
  .max(10, 'Maximum 10 languages allowed')
  .default([]);

/**
 * Addresses array validator (max 5 addresses)
 */
const addressesArraySchema = z
  .array(ProfileAddressSchema)
  .max(5, 'Maximum 5 addresses allowed')
  .default([]);

// =====================================================
// Profile CRUD Schemas
// =====================================================

/**
 * Schema for creating a new profile
 * All fields are optional except arrays (which default to [])
 */
export const CreateProfileSchema = z.object({
  photo_url: z.string().url().optional().nullable(),
  bio: bioSchema,
  bio_is_public: z.boolean().default(false),
  department: departmentSchema,
  department_is_public: z.boolean().default(false),
  urls: urlsArraySchema,
  roles: rolesArraySchema,
  phone_numbers: phoneNumbersArraySchema,
  emails: emailsArraySchema,
});

/**
 * Schema for updating an existing profile
 * All fields are optional (partial update support)
 */
export const UpdateProfileSchema = z.object({
  // Photo & Banner
  photo_url: z.string().url().optional().nullable(),
  banner_url: z.string().url().optional().nullable(),

  // Personal Information
  first_name: nameSchema,
  first_name_is_public: z.boolean().optional(),
  last_name: nameSchema,
  last_name_is_public: z.boolean().optional(),
  display_name: displayNameSchema,
  pronouns: pronounsSchema,
  pronouns_is_public: z.boolean().optional(),
  date_of_birth: dateSchema,
  date_of_birth_is_public: z.boolean().optional(),

  // Bio
  bio: bioSchema,
  bio_is_public: z.boolean().optional(),

  // Professional Information
  job_title: jobTitleSchema,
  job_title_is_public: z.boolean().optional(),
  department: departmentSchema,
  department_is_public: z.boolean().optional(),

  // Location
  location: locationSchema,
  location_is_public: z.boolean().optional(),
  remote_work: z.boolean().optional(),
  timezone: timezoneSchema,

  // JSONB Arrays
  urls: urlsArraySchema.optional(),
  roles: rolesArraySchema.optional(),
  phone_numbers: phoneNumbersArraySchema.optional(),
  emails: emailsArraySchema.optional(),
  hard_skills: hardSkillsArraySchema.optional(),
  soft_skills: softSkillsArraySchema.optional(),
  languages: languagesArraySchema.optional(),
  addresses: addressesArraySchema.optional(),

  // Preferences
  language_preference: languagePreferenceSchema,
  theme_preference: z.enum(['light', 'dark', 'system']).optional(),
  profile_color: hexColorSchema,
  profile_visibility: z.enum(['public', 'private', 'team_only']).optional(),
  show_activity_status: z.boolean().optional(),
});

/**
 * Schema for updating username (admin only)
 * Separate from regular updates due to uniqueness constraint
 */
export const UpdateUsernameSchema = z.object({
  username: usernameSchema,
});

// =====================================================
// Photo Upload Schemas
// =====================================================

/**
 * Schema for photo upload request
 * Validates file metadata
 */
export const PhotoUploadSchema = z.object({
  filename: z.string().min(1, 'Filename is required'),
  contentType: z
    .string()
    .regex(/^image\/(jpeg|jpg|png|webp|gif)$/, 'Only image files are allowed (JPEG, PNG, WebP, GIF)'),
  size: z
    .number()
    .positive('File size must be positive')
    .max(10 * 1024 * 1024, 'File size must be less than 10MB'), // 10MB max
});

/**
 * Schema for photo delete request
 */
export const PhotoDeleteSchema = z.object({
  url: z.string().url('Must be a valid URL'),
});

// =====================================================
// Query Parameter Schemas
// =====================================================

/**
 * Schema for profile list query params (admin)
 */
export const ProfileListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  department: z.string().optional(),
  role: z.enum(['admin', 'super_admin']).optional(),
});

/**
 * Schema for username parameter
 */
export const UsernameParamSchema = z.object({
  username: usernameSchema,
});

/**
 * Schema for profile ID parameter
 */
export const ProfileIdParamSchema = z.object({
  id: z.string().uuid('Must be a valid UUID'),
});

// =====================================================
// Response Schemas (for type inference)
// =====================================================

/**
 * Schema for profile response
 * Used for type inference in API responses
 */
export const ProfileResponseSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  username: usernameSchema,
  photo_url: z.string().url().nullable(),
  bio: bioSchema,
  bio_is_public: z.boolean(),
  department: departmentSchema,
  department_is_public: z.boolean(),
  urls: urlsArraySchema,
  roles: rolesArraySchema,
  phone_numbers: phoneNumbersArraySchema,
  emails: emailsArraySchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

/**
 * Schema for public profile response (privacy-filtered)
 */
export const PublicProfileResponseSchema = z.object({
  username: usernameSchema,
  photo_url: z.string().url().nullable(),
  bio: z.string().nullable(),
  department: z.string().nullable(),
  urls: z.array(ProfileUrlSchema),
  roles: z.array(ProfileRoleSchema),
  phone_numbers: z.array(ProfilePhoneNumberSchema),
  emails: z.array(ProfileEmailSchema),
});

// =====================================================
// Type Inference Helpers
// =====================================================

/**
 * Infer TypeScript type from Zod schema
 */
export type CreateProfileInput = z.infer<typeof CreateProfileSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
export type UpdateUsernameInput = z.infer<typeof UpdateUsernameSchema>;
export type PhotoUploadInput = z.infer<typeof PhotoUploadSchema>;
export type PhotoDeleteInput = z.infer<typeof PhotoDeleteSchema>;
export type ProfileListQuery = z.infer<typeof ProfileListQuerySchema>;
export type UsernameParam = z.infer<typeof UsernameParamSchema>;
export type ProfileIdParam = z.infer<typeof ProfileIdParamSchema>;
export type ProfileResponse = z.infer<typeof ProfileResponseSchema>;
export type PublicProfileResponse = z.infer<typeof PublicProfileResponseSchema>;

// =====================================================
// Validation Error Helpers
// =====================================================

/**
 * Format Zod errors for API responses
 */
export function formatZodErrors(error: z.ZodError): Record<string, string[]> {
  const formatted: Record<string, string[]> = {};

  error.issues.forEach((err) => {
    const path = err.path.join('.');
    if (!formatted[path]) {
      formatted[path] = [];
    }
    formatted[path].push(err.message);
  });

  return formatted;
}

/**
 * Check if value is a valid Zod error
 */
export function isZodError(error: unknown): error is z.ZodError {
  return error instanceof z.ZodError;
}

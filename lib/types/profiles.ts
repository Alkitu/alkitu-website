/**
 * User Profiles Types
 *
 * Type definitions for the professional/company profile module.
 * Supports granular privacy controls at field and array-item levels.
 */

// =====================================================
// Enums
// =====================================================

/**
 * Contact type for phone numbers and emails
 */
export type ContactType = 'work' | 'personal';

/**
 * User role in admin system
 */
export type UserRole = 'admin' | 'super_admin';

/**
 * Address type for contact information
 */
export type AddressType = 'office' | 'home';

/**
 * Language proficiency level
 */
export type LanguageProficiency = 'native' | 'fluent' | 'intermediate' | 'basic';

/**
 * Skill level
 */
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

/**
 * Profile visibility setting
 */
export type ProfileVisibility = 'public' | 'private' | 'team_only';

/**
 * Theme preference
 */
export type ThemePreference = 'light' | 'dark' | 'system';

/**
 * Skill / experience / education category grouping used by the profile sidebar
 */
export type SkillCategory =
  | 'ai_consulting'
  | 'engineering'
  | 'testing_cicd'
  | 'design_marketing'
  | 'other';

// =====================================================
// Bilingual text
// =====================================================

/**
 * Bilingual free text, EN/ES
 * Example: { en: "AI Consultant", es: "Consultor de IA" }
 */
export interface LocalizedText {
  en: string;
  es: string;
}

/**
 * Resolve a LocalizedText for a given locale, falling back to the other locale
 * or an empty string.
 */
export function localizeText(
  text: LocalizedText | null | undefined,
  locale: 'en' | 'es'
): string {
  if (!text) return '';
  return text[locale] || text.en || text.es || '';
}

// =====================================================
// JSONB Array Item Interfaces
// =====================================================

/**
 * URL entry with display order and privacy toggle
 * Example: { urlName: "LinkedIn", url: "https://linkedin.com/in/...", display_order: 0, is_public: true }
 */
export interface ProfileUrl {
  urlName: string;
  url: string;
  display_order: number;
  is_public: boolean;
}

/**
 * Role entry with display order and privacy toggle
 * Example: { role: "Frontend Developer", display_order: 0, is_public: true }
 */
export interface ProfileRole {
  role: string;
  display_order: number;
  is_public: boolean;
}

/**
 * Phone number entry with type and privacy toggle
 * Example: { type: "work", number: "+1234567890", display_order: 0, is_public: false }
 */
export interface ProfilePhoneNumber {
  type: ContactType;
  number: string;
  display_order: number;
  is_public: boolean;
}

/**
 * Email entry with type and privacy toggle
 * Example: { type: "personal", email: "user@example.com", display_order: 0, is_public: true }
 */
export interface ProfileEmail {
  type: ContactType;
  email: string;
  display_order: number;
  is_public: boolean;
}

/**
 * Skill entry with display order and privacy toggle
 * Example: { skill: {en:"React",es:"React"}, level: "advanced", category: "engineering", display_order: 0, is_public: true }
 */
export interface ProfileSkill {
  skill: LocalizedText;
  level: SkillLevel;
  category: SkillCategory;
  display_order: number;
  is_public: boolean;
}

/**
 * Language entry with proficiency, display order, and privacy toggle
 * `language_code` (ISO 639-1) drives localized display via Intl.DisplayNames; `language`
 * is the free-text fallback for languages without a code.
 * Example: { language: "Spanish", language_code: "es", proficiency: "native", display_order: 0, is_public: true }
 */
export interface ProfileLanguage {
  language: string;
  language_code?: string;
  proficiency: LanguageProficiency;
  display_order: number;
  is_public: boolean;
}

/**
 * Address entry with type and privacy toggle
 * Example: { type: "office", address: "123 Main St, City, Country", display_order: 0, is_public: false }
 */
export interface ProfileAddress {
  type: AddressType;
  address: string;
  display_order: number;
  is_public: boolean;
}

/**
 * Work experience entry
 * Example: { company: "Acme", role: {en:"Engineer",es:"Ingeniero"}, location: "Madrid", start_date: "2020-01-01", end_date: null, is_current: true, bullets: {en:[...],es:[...]}, tech: ["React"], display_order: 0, is_public: true }
 */
export interface ProfileExperience {
  company: string;
  role: LocalizedText;
  location: string | null;
  start_date: string; // ISO date string
  end_date: string | null; // null = current
  is_current: boolean;
  bullets: {
    en: string[];
    es: string[];
  };
  tech: string[] | null;
  display_order: number;
  is_public: boolean;
}

/**
 * Education entry
 * Example: { school: "MIT", degree: {en:"CS",es:"CS"}, location: "Boston", start_date: "2018-09-01", end_date: "2022-06-01", display_order: 0, is_public: true }
 */
export interface ProfileEducation {
  school: string;
  degree: LocalizedText;
  location: string | null;
  start_date: string;
  end_date: string | null;
  display_order: number;
  is_public: boolean;
}

// =====================================================
// Main User Profile Interface
// =====================================================

/**
 * Complete user profile from database
 */
export interface UserProfile {
  id: string;
  user_id: string;
  username: string;

  // Photo & Banner
  photo_url: string | null;
  banner_url: string | null;

  // Personal Information
  first_name: string | null;
  first_name_is_public: boolean;
  last_name: string | null;
  last_name_is_public: boolean;
  display_name: string | null;
  pronouns: string | null;
  pronouns_is_public: boolean;
  date_of_birth: string | null; // ISO date string
  date_of_birth_is_public: boolean;

  // Bio
  bio: LocalizedText;
  bio_is_public: boolean;

  // Professional Information
  job_title: LocalizedText;
  job_title_is_public: boolean;
  department: string | null;
  department_is_public: boolean;

  // Location
  location: string | null;
  location_is_public: boolean;
  remote_work: boolean;
  timezone: string;

  // JSONB Arrays
  urls: ProfileUrl[];
  roles: ProfileRole[];
  phone_numbers: ProfilePhoneNumber[];
  emails: ProfileEmail[];
  hard_skills: ProfileSkill[];
  soft_skills: ProfileSkill[];
  languages: ProfileLanguage[];
  addresses: ProfileAddress[];
  experience: ProfileExperience[];
  education: ProfileEducation[];

  // Preferences
  language_preference: string;
  theme_preference: ThemePreference;
  profile_color: string;
  profile_visibility: ProfileVisibility;
  show_activity_status: boolean;

  // Metrics
  profile_completion_percentage: number;
  profile_views_count: number;
  last_profile_view_at: string | null;
  last_activity_at: string | null;

  // Timestamps
  created_at: string;
  updated_at: string;
}

/**
 * Public profile (filtered based on privacy toggles)
 * Used for public profile pages
 */
export interface PublicUserProfile {
  username: string;

  // Photos & Banner
  photo_url: string | null;
  banner_url: string | null;

  // Personal Information (privacy-filtered)
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
  pronouns: string | null;
  date_of_birth: string | null;

  // Bio
  bio: LocalizedText;

  // Professional Information (privacy-filtered)
  job_title: LocalizedText;
  department: string | null;

  // Location (privacy-filtered)
  location: string | null;
  remote_work: boolean;
  timezone: string;

  // JSONB Arrays (privacy-filtered at item level)
  urls: ProfileUrl[];
  roles: ProfileRole[];
  phone_numbers: ProfilePhoneNumber[];
  emails: ProfileEmail[];
  hard_skills: ProfileSkill[];
  soft_skills: ProfileSkill[];
  languages: ProfileLanguage[];
  addresses: ProfileAddress[];
  experience: ProfileExperience[];
  education: ProfileEducation[];

  // Visual Preferences (always public)
  profile_color: string;
  theme_preference: ThemePreference;
}

// =====================================================
// Input Types for Forms
// =====================================================

/**
 * Data for creating a new profile
 * Note: user_id and username are auto-generated server-side
 */
export interface CreateProfileInput {
  photo_url?: string | null;
  bio?: LocalizedText;
  bio_is_public?: boolean;
  department?: string | null;
  department_is_public?: boolean;
  urls?: ProfileUrl[];
  roles?: ProfileRole[];
  phone_numbers?: ProfilePhoneNumber[];
  emails?: ProfileEmail[];
}

/**
 * Data for updating an existing profile
 * All fields are optional
 */
export interface UpdateProfileInput {
  // Photo & Banner
  photo_url?: string | null;
  banner_url?: string | null;

  // Personal Information
  first_name?: string | null;
  first_name_is_public?: boolean;
  last_name?: string | null;
  last_name_is_public?: boolean;
  display_name?: string | null;
  pronouns?: string | null;
  pronouns_is_public?: boolean;
  date_of_birth?: string | null;
  date_of_birth_is_public?: boolean;

  // Bio
  bio?: LocalizedText;
  bio_is_public?: boolean;

  // Professional Information
  job_title?: LocalizedText;
  job_title_is_public?: boolean;
  department?: string | null;
  department_is_public?: boolean;

  // Location
  location?: string | null;
  location_is_public?: boolean;
  remote_work?: boolean;
  timezone?: string;

  // JSONB Arrays
  urls?: ProfileUrl[];
  roles?: ProfileRole[];
  phone_numbers?: ProfilePhoneNumber[];
  emails?: ProfileEmail[];
  hard_skills?: ProfileSkill[];
  soft_skills?: ProfileSkill[];
  languages?: ProfileLanguage[];
  addresses?: ProfileAddress[];
  experience?: ProfileExperience[];
  education?: ProfileEducation[];

  // Preferences
  language_preference?: string;
  theme_preference?: ThemePreference;
  profile_color?: string;
  profile_visibility?: ProfileVisibility;
  show_activity_status?: boolean;
}

// =====================================================
// Photo Upload Types
// =====================================================

/**
 * Response from photo upload endpoint
 */
export interface PhotoUploadResponse {
  url: string;
  pathname: string;
  contentType: string;
  uploadedAt: string;
}

/**
 * Request to delete photo
 */
export interface PhotoDeleteRequest {
  url: string;
}

// =====================================================
// Admin User with Profile
// =====================================================

/**
 * Admin user with their profile
 * Used in admin panels to show user + profile data
 */
export interface AdminUserWithProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  last_login: string | null;
  profile: UserProfile | null;
}

// =====================================================
// Autocomplete Suggestions
// =====================================================

/**
 * Common department suggestions for autocomplete
 * Users can still enter custom values
 */
export const DEPARTMENT_SUGGESTIONS = [
  'Engineering',
  'Design',
  'Product',
  'Marketing',
  'Sales',
  'Operations',
  'Finance',
  'Human Resources',
  'Customer Support',
  'Legal',
  'Research & Development',
  'Quality Assurance',
  'Data Science',
  'DevOps',
  'Security',
] as const;

/**
 * Common role suggestions for autocomplete
 * Users can still enter custom values
 */
export const ROLE_SUGGESTIONS = [
  // Engineering
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Mobile Developer',
  'DevOps Engineer',
  'Site Reliability Engineer',
  'Software Architect',
  'Engineering Manager',
  'CTO',

  // Design
  'UI Designer',
  'UX Designer',
  'Product Designer',
  'Graphic Designer',
  'Design Lead',
  'Creative Director',

  // Product
  'Product Manager',
  'Product Owner',
  'Head of Product',
  'CPO',

  // Business
  'CEO',
  'COO',
  'CFO',
  'Founder',
  'Co-Founder',
  'Business Analyst',
  'Strategy Consultant',

  // Marketing
  'Marketing Manager',
  'Content Writer',
  'SEO Specialist',
  'Social Media Manager',
  'Brand Manager',
  'CMO',

  // Sales
  'Sales Representative',
  'Account Executive',
  'Sales Manager',
  'Business Development',
  'Chief Revenue Officer',

  // Other
  'Project Manager',
  'Scrum Master',
  'Data Analyst',
  'Data Scientist',
  'QA Engineer',
  'Technical Writer',
  'Customer Success Manager',
] as const;

/**
 * Type for department suggestions
 */
export type DepartmentSuggestion = typeof DEPARTMENT_SUGGESTIONS[number];

/**
 * Type for role suggestions
 */
export type RoleSuggestion = typeof ROLE_SUGGESTIONS[number];

// =====================================================
// Utility Types
// =====================================================

/**
 * Extract privacy-controlled fields from profile
 */
export type PrivacyControlledField =
  | 'bio'
  | 'department'
  | 'urls'
  | 'roles'
  | 'phone_numbers'
  | 'emails';

/**
 * Map of field to its privacy toggle property
 */
export const PRIVACY_TOGGLE_FIELDS = {
  bio: 'bio_is_public',
  department: 'department_is_public',
} as const;

/**
 * Fields that are always public (no privacy toggle)
 */
export type AlwaysPublicField = 'username' | 'photo_url';

/**
 * Profile validation errors
 */
export interface ProfileValidationError {
  field: string;
  message: string;
}

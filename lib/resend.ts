import { Resend } from 'resend';

/**
 * RESEND Email Client Configuration
 *
 * This module provides a configured RESEND client for sending transactional emails.
 * Email settings (from, to, cc, bcc) are stored in Supabase `email_settings` table
 * and can be configured via /admin/settings page.
 *
 * Environment Variables Required:
 * - RESEND_API_KEY: API key from resend.com
 * - EMAIL_FROM: Default sender email (fallback if DB settings not available)
 * - EMAIL_DOMAIN: Allowed email domain (default: alkitu.com)
 */

// Validate environment variables
if (!process.env.RESEND_API_KEY) {
  throw new Error(
    'RESEND_API_KEY is not defined in environment variables. ' +
    'Please add it to .env.local and Vercel environment variables.'
  );
}

// Initialize RESEND client
export const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * RESEND configuration constants
 * These are fallback values used when database settings are not available
 */
export const RESEND_CONFIG = {
  /** Default sender email address */
  fromEmail: process.env.EMAIL_FROM || 'info@alkitu.com',

  /** Allowed email domain for sender addresses */
  emailDomain: process.env.EMAIL_DOMAIN || 'alkitu.com',

  /** Enable/disable email sending (useful for development) */
  enabled: process.env.RESEND_ENABLED !== 'false',
} as const;

/**
 * Email Settings Interface
 * Matches the structure of the `email_settings` table in Supabase
 */
export interface EmailSettings {
  id: string;
  from_email: string;
  to_emails: string[];
  cc_emails: string[];
  bcc_emails: string[];
  email_domain: string;
  created_at: string;
  updated_at: string;
}

/**
 * Contact Form Email Data
 * Data structure for sending contact form notification emails
 */
export interface ContactFormEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
  locale: 'en' | 'es';
  submittedAt: string;
}

/**
 * Validates that an email address belongs to the allowed domain
 *
 * @param email - Email address to validate
 * @param domain - Allowed domain (default: alkitu.com)
 * @returns true if email ends with @domain
 */
export function validateEmailDomain(email: string, domain: string = RESEND_CONFIG.emailDomain): boolean {
  return email.endsWith(`@${domain}`);
}

/**
 * Formats email array for RESEND API
 * Filters out invalid or empty emails
 *
 * @param emails - Array of email addresses
 * @returns Filtered array of valid email addresses
 */
export function formatEmailArray(emails: string[] | null | undefined): string[] {
  if (!emails || !Array.isArray(emails)) {
    return [];
  }

  return emails.filter((email) => {
    // Basic email validation
    return email && email.includes('@') && email.includes('.');
  });
}

/**
 * Gets email settings from database
 * Falls back to environment variables if database query fails
 *
 * @param supabase - Supabase client (authenticated)
 * @returns Email settings object or null if error
 */
export async function getEmailSettings(supabase: any): Promise<EmailSettings | null> {
  try {
    const { data, error } = await supabase
      .from('email_settings')
      .select('*')
      .single();

    if (error) {
      console.error('Failed to fetch email settings:', error);
      return null;
    }

    return data as EmailSettings;
  } catch (error) {
    console.error('Error fetching email settings:', error);
    return null;
  }
}

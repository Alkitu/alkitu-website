import { z } from 'zod';

/**
 * Zod schema for contact form validation
 *
 * Validates contact form submissions including:
 * - Name (required, 2-100 characters)
 * - Email (required, valid email format)
 * - Subject (required, 5-200 characters)
 * - Message (required, 10-2000 characters)
 * - Locale (optional, defaults to 'es')
 *
 * Used by:
 * - POST /api/contact/submit endpoint
 * - Frontend form validation
 */
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres / Name must be at least 2 characters')
    .max(100, 'El nombre no puede exceder 100 caracteres / Name cannot exceed 100 characters')
    .trim(),

  email: z
    .string()
    .email('Formato de email inválido / Invalid email format')
    .min(5, 'El email debe tener al menos 5 caracteres / Email must be at least 5 characters')
    .max(255, 'El email no puede exceder 255 caracteres / Email cannot exceed 255 characters')
    .toLowerCase()
    .trim(),

  subject: z
    .string()
    .min(5, 'El asunto debe tener al menos 5 caracteres / Subject must be at least 5 characters')
    .max(200, 'El asunto no puede exceder 200 caracteres / Subject cannot exceed 200 characters')
    .trim(),

  message: z
    .string()
    .min(10, 'El mensaje debe tener al menos 10 caracteres / Message must be at least 10 characters')
    .max(2000, 'El mensaje no puede exceder 2000 caracteres / Message cannot exceed 2000 characters')
    .trim(),

  locale: z
    .enum(['en', 'es'])
    .optional()
    .default('es'),
});

/**
 * TypeScript type inferred from the Zod schema
 * Use this type for type-safe form handling
 */
export type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * Schema for validating contact submission with metadata
 * This includes additional fields captured by the API (user_agent, ip_address)
 *
 * Used by:
 * - Database insertion
 * - Admin panel display
 */
export const contactSubmissionSchema = contactFormSchema.extend({
  user_agent: z.string().optional(),
  ip_address: z.string().optional(),
  status: z.enum(['pending', 'read', 'replied', 'archived']).default('pending'),
});

/**
 * TypeScript type for complete contact submission (with metadata)
 */
export type ContactSubmission = z.infer<typeof contactSubmissionSchema>;

/**
 * Schema for updating contact submission status (admin operations)
 *
 * Used by:
 * - PATCH /api/admin/contact-submissions/[id] endpoint
 */
export const updateContactSubmissionSchema = z.object({
  status: z.enum(['pending', 'read', 'replied', 'archived']),
});

/**
 * TypeScript type for status updates
 */
export type UpdateContactSubmissionData = z.infer<typeof updateContactSubmissionSchema>;

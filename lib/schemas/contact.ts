import { z } from 'zod';

/**
 * Zod schema for contact form validation
 *
 * Matches the multi-step frontend form that sends FormData with:
 * - name, email, projectType, companySize, budget (strings)
 * - productCategories, functionalities (JSON-stringified arrays)
 * - message, locale (strings)
 *
 * Used by:
 * - POST /api/contact/submit endpoint
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

  projectType: z.string().optional(),

  companySize: z.string().optional(),

  budget: z.string().optional(),

  productCategories: z.any().optional(),

  functionalities: z.any().optional(),

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
 */
export type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * Schema for validating contact submission with metadata
 *
 * Used by:
 * - Database insertion
 * - Admin panel display
 */
export const contactSubmissionSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  subject: z.string().optional(),
  message: z.string(),
  locale: z.enum(['en', 'es']).default('es'),
  user_agent: z.string().optional(),
  ip_address: z.string().optional(),
  status: z.enum(['pending', 'read', 'replied', 'archived']).default('pending'),
  form_data: z.record(z.string(), z.unknown()).optional(),
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

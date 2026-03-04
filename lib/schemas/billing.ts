/**
 * Billing Zod Schemas
 *
 * Validation schemas for the billing module API routes.
 * Used for: settings, clients, products, invoices, and invoice lines.
 */

import { z } from 'zod';

// =====================================================
// Shared Validators
// =====================================================

const nifValidator = z.string().min(1, 'NIF es obligatorio').max(20);
const nameValidator = z.string().min(1, 'Nombre es obligatorio').max(255);

// =====================================================
// Billing Settings Schema
// =====================================================

export const billingSettingsSchema = z.object({
  company_name: nameValidator,
  nif: nifValidator,
  address_line1: z.string().max(255).optional().nullable(),
  address_line2: z.string().max(255).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  postal_code: z.string().max(10).optional().nullable(),
  province: z.string().max(100).optional().nullable(),
  country: z.string().max(2).default('ES'),
  email: z.string().email('Email no valido').optional().nullable(),
  phone: z.string().max(20).optional().nullable(),
  logo_url: z.string().url('URL no valida').optional().nullable(),
  verifacti_api_key: z.string().optional().nullable(),
  default_series: z.string().max(10).default('F'),
  default_payment_terms: z.coerce.number().int().min(0).max(365).default(30),
  default_tax_rate: z.coerce.number().min(0).max(100).default(21),
  invoice_footer_es: z.string().max(1000).optional().nullable(),
  invoice_footer_en: z.string().max(1000).optional().nullable(),
  bank_iban: z.string().max(34).optional().nullable(),
  bank_swift: z.string().max(11).optional().nullable(),
  stripe_enabled: z.boolean().default(false).optional(),
  stripe_auto_invoice: z.boolean().default(false).optional(),
  stripe_auto_issue: z.boolean().default(false).optional(),
  stripe_secret_key: z.string().nullable().optional(),
  stripe_webhook_secret: z.string().nullable().optional(),
});

export type BillingSettingsInput = z.infer<typeof billingSettingsSchema>;

// =====================================================
// Billing Client Schema
// =====================================================

export const billingClientSchema = z.object({
  name: nameValidator,
  nif: nifValidator,
  email: z.string().email('Email no valido').optional().nullable(),
  phone: z.string().max(20).optional().nullable(),
  address_line1: z.string().max(255).optional().nullable(),
  address_line2: z.string().max(255).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  postal_code: z.string().max(10).optional().nullable(),
  province: z.string().max(100).optional().nullable(),
  country: z.string().max(2).default('ES'),
  notes: z.string().max(2000).optional().nullable(),
  is_active: z.boolean().default(true),
});

export type BillingClientInput = z.infer<typeof billingClientSchema>;

// =====================================================
// Billing Product Schema
// =====================================================

export const billingProductSchema = z.object({
  name: nameValidator,
  description: z.string().max(1000).optional().nullable(),
  default_price: z.coerce.number().min(0).optional().nullable(),
  tax_rate: z.coerce.number().min(0).max(100).default(21),
  tax_type: z.enum(['IVA', 'IGIC', 'IRPF']).default('IVA'),
  unit: z.enum(['service', 'hour', 'unit']).default('service'),
  active: z.boolean().default(true),
});

export type BillingProductInput = z.infer<typeof billingProductSchema>;

// =====================================================
// Invoice Line Schema
// =====================================================

export const invoiceLineSchema = z.object({
  product_id: z.string().uuid().optional().nullable(),
  description: z.string().min(1, 'Descripcion es obligatoria').max(500),
  quantity: z.coerce.number().min(0.0001, 'Cantidad debe ser mayor a 0'),
  unit_price: z.coerce.number().min(0, 'Precio debe ser mayor o igual a 0'),
  tax_rate: z.coerce.number().min(0).max(100).default(21),
  tax_type: z.enum(['IVA', 'IGIC', 'IRPF']).default('IVA'),
});

export type InvoiceLineInput = z.infer<typeof invoiceLineSchema>;

// =====================================================
// Create Invoice Schema
// =====================================================

export const createInvoiceSchema = z.object({
  series: z.string().max(10).default('F'),
  invoice_type: z.enum(['F1', 'F2', 'F3', 'R1', 'R2', 'R3', 'R4', 'R5']).default('F1'),
  description: z.string().max(500).optional().nullable(),
  due_date: z.string().optional().nullable(),
  client_id: z.string().uuid('ID de cliente no valido'),
  notes: z.string().max(2000).optional().nullable(),
  corrected_invoice_id: z.string().uuid().optional().nullable(),
  correction_reason: z.string().max(500).optional().nullable(),
  correction_type: z.enum(['S', 'I']).optional().nullable(),
  lines: z.array(invoiceLineSchema).min(1, 'Se requiere al menos una linea'),
});

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;

// =====================================================
// Update Invoice Schema (draft only)
// =====================================================

export const updateInvoiceSchema = z.object({
  description: z.string().max(500).optional().nullable(),
  due_date: z.string().optional().nullable(),
  client_id: z.string().uuid().optional(),
  notes: z.string().max(2000).optional().nullable(),
  lines: z.array(invoiceLineSchema).min(1).optional(),
});

export type UpdateInvoiceInput = z.infer<typeof updateInvoiceSchema>;

// =====================================================
// Query Schemas
// =====================================================

export const billingClientsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().nullable().optional(),
  active: z.enum(['all', 'true', 'false']).default('all'),
});

export const billingProductsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().nullable().optional(),
  active: z.enum(['all', 'true', 'false']).default('all'),
});

export const billingInvoicesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(['all', 'draft', 'issued', 'paid', 'voided']).default('all'),
  search: z.string().nullable().optional(),
  client_id: z.string().uuid().nullable().optional(),
  date_from: z.string().nullable().optional(),
  date_to: z.string().nullable().optional(),
});

// =====================================================
// Payment Schema
// =====================================================

export const markAsPaidSchema = z.object({
  payment_method: z.enum(['transfer', 'card', 'cash', 'check', 'other']),
  payment_date: z.string().optional(),
});

export type MarkAsPaidInput = z.infer<typeof markAsPaidSchema>;

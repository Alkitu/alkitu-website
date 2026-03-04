/**
 * Billing Module Types
 *
 * TypeScript interfaces for the VeriFACTU-compliant billing system.
 * Covers settings, clients, products, invoices, and invoice lines.
 */

// =====================================================
// Enums (Union Types)
// =====================================================

/** Invoice status lifecycle */
export type InvoiceStatus = 'draft' | 'issued' | 'paid' | 'voided';

/** VeriFACTU invoice types */
export type InvoiceType = 'F1' | 'F2' | 'F3' | 'R1' | 'R2' | 'R3' | 'R4' | 'R5';

/** Tax types supported */
export type TaxType = 'IVA' | 'IGIC' | 'IRPF';

/** Product unit of measure */
export type ProductUnit = 'service' | 'hour' | 'unit';

/** Verifacti submission status */
export type VerifactiInvoiceStatus = 'Pendiente' | 'Correcto' | 'Incorrecto' | 'Anulado';

/** Correction type for rectificativas */
export type CorrectionType = 'S' | 'I';

/** Payment methods */
export type PaymentMethod = 'transfer' | 'card' | 'cash' | 'check' | 'other';

// =====================================================
// Database Row Types
// =====================================================

/** billing_settings table row */
export interface BillingSettings {
  id: string;
  company_name: string;
  nif: string;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  postal_code: string | null;
  province: string | null;
  country: string;
  email: string | null;
  phone: string | null;
  logo_url: string | null;
  verifacti_api_key: string | null;
  default_series: string;
  next_invoice_number: number;
  default_payment_terms: number;
  default_tax_rate: number;
  invoice_footer_es: string | null;
  invoice_footer_en: string | null;
  bank_iban: string | null;
  bank_swift: string | null;
  stripe_enabled: boolean;
  stripe_auto_invoice: boolean;
  stripe_auto_issue: boolean;
  stripe_secret_key: string | null;
  stripe_webhook_secret: string | null;
  created_at: string;
  updated_at: string;
}

/** billing_clients table row */
export interface BillingClient {
  id: string;
  name: string;
  nif: string;
  email: string | null;
  phone: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  postal_code: string | null;
  province: string | null;
  country: string;
  notes: string | null;
  is_active: boolean;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

/** billing_products table row */
export interface BillingProduct {
  id: string;
  name: string;
  description: string | null;
  default_price: number | null;
  tax_rate: number;
  tax_type: TaxType;
  unit: ProductUnit;
  active: boolean;
  created_at: string;
  updated_at: string;
}

/** billing_invoices table row */
export interface BillingInvoice {
  id: string;
  series: string;
  number: number;
  invoice_type: InvoiceType;
  description: string | null;
  issue_date: string;
  due_date: string | null;
  client_id: string | null;
  client_name: string;
  client_nif: string;
  subtotal: number;
  tax_amount: number;
  total: number;
  status: InvoiceStatus;
  payment_method: PaymentMethod | null;
  payment_date: string | null;
  verifacti_uuid: string | null;
  verifacti_status: VerifactiInvoiceStatus | null;
  verifacti_qr: string | null;
  verifacti_url: string | null;
  verifacti_huella: string | null;
  corrected_invoice_id: string | null;
  correction_reason: string | null;
  correction_type: CorrectionType | null;
  stripe_payment_intent_id: string | null;
  stripe_checkout_session_id: string | null;
  stripe_payment_link_url: string | null;
  stripe_charge_id: string | null;
  stripe_invoice_id: string | null;
  stripe_subscription_id: string | null;
  stripe_refund_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

/** billing_invoice_lines table row */
export interface BillingInvoiceLine {
  id: string;
  invoice_id: string;
  product_id: string | null;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  tax_type: TaxType;
  line_total: number;
  tax_amount: number;
  sort_order: number;
  created_at: string;
}

// =====================================================
// Extended Types (with relationships)
// =====================================================

/** Invoice with its line items */
export interface InvoiceWithLines extends BillingInvoice {
  billing_invoice_lines: BillingInvoiceLine[];
}

/** Invoice with client data and line items */
export interface InvoiceWithClientAndLines extends BillingInvoice {
  billing_invoice_lines: BillingInvoiceLine[];
  billing_clients: BillingClient | null;
}

// =====================================================
// Input Types (for create/update operations)
// =====================================================

/** Input for creating a new client */
export interface CreateClientInput {
  name: string;
  nif: string;
  email?: string;
  phone?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  postal_code?: string;
  province?: string;
  country?: string;
  notes?: string;
}

/** Input for creating a new product */
export interface CreateProductInput {
  name: string;
  description?: string;
  default_price?: number;
  tax_rate?: number;
  tax_type?: TaxType;
  unit?: ProductUnit;
}

/** Input for a single invoice line */
export interface CreateInvoiceLineInput {
  product_id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  tax_type?: TaxType;
}

/** Input for creating a new invoice */
export interface CreateInvoiceInput {
  series?: string;
  invoice_type?: InvoiceType;
  description?: string;
  due_date?: string;
  client_id: string;
  notes?: string;
  corrected_invoice_id?: string;
  correction_reason?: string;
  correction_type?: CorrectionType;
  lines: CreateInvoiceLineInput[];
}

/** Input for updating billing settings */
export interface UpdateBillingSettingsInput {
  company_name: string;
  nif: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  postal_code?: string;
  province?: string;
  country?: string;
  email?: string;
  phone?: string;
  logo_url?: string;
  verifacti_api_key?: string;
  default_series?: string;
  default_payment_terms?: number;
  default_tax_rate?: number;
  invoice_footer_es?: string;
  invoice_footer_en?: string;
  bank_iban?: string;
  bank_swift?: string;
}

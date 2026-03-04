/**
 * Stripe Integration Types
 *
 * TypeScript interfaces for the Stripe <-> Billing integration.
 */

/** Stripe event record for idempotency tracking */
export interface StripeEventRecord {
  id: string;
  stripe_event_id: string;
  event_type: string;
  processed: boolean;
  processing_result: Record<string, unknown> | null;
  error_message: string | null;
  raw_payload: Record<string, unknown>;
  created_at: string;
  processed_at: string | null;
}

/** Stripe subscription tracking */
export interface StripeSubscription {
  id: string;
  stripe_subscription_id: string;
  client_id: string;
  stripe_customer_id: string;
  status: string;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  default_invoice_type: string;
  description: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

/** Stripe settings stored in billing_settings */
export interface StripeSettings {
  stripe_enabled: boolean;
  stripe_auto_invoice: boolean;
  stripe_auto_issue: boolean;
}

/** Input for creating a Checkout Session from an invoice */
export interface CreateCheckoutInput {
  invoice_id: string;
}

/** Result of creating a Checkout Session */
export interface CheckoutSessionResult {
  checkout_url: string;
  session_id: string;
}

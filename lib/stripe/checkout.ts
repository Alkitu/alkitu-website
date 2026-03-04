/**
 * Stripe Checkout Sessions
 *
 * Creates Stripe-hosted Checkout Sessions from billing invoices.
 * Following Stripe best practices:
 * - Use CheckoutSessions API (not PaymentIntents directly)
 * - Stripe-hosted checkout (redirect, not embedded)
 * - Dynamic payment methods (don't pass payment_method_types)
 */

import type Stripe from 'stripe';
import { getStripeWithDbKey, STRIPE_CURRENCY, toCents } from './client';
import { createClient } from '@/lib/supabase/server';
import type { BillingInvoice, BillingInvoiceLine, BillingClient } from '@/lib/types/billing';

/**
 * Get or create a Stripe Customer for a billing client.
 * Stores stripe_customer_id on the billing_clients row.
 */
export async function getOrCreateStripeCustomer(
  client: BillingClient
): Promise<string> {
  // If already linked, return existing ID
  const existingId = (client as BillingClient & { stripe_customer_id?: string }).stripe_customer_id;
  if (existingId) {
    return existingId;
  }

  const stripe = await getStripeWithDbKey();

  // Search for existing customer by email
  if (client.email) {
    const existing = await stripe.customers.list({
      email: client.email,
      limit: 1,
    });
    if (existing.data.length > 0) {
      // Link to billing_clients
      const supabase = await createClient();
      await supabase
        .from('billing_clients')
        .update({ stripe_customer_id: existing.data[0].id })
        .eq('id', client.id);
      return existing.data[0].id;
    }
  }

  // Create new customer
  const customer = await stripe.customers.create({
    name: client.name,
    email: client.email || undefined,
    phone: client.phone || undefined,
    metadata: {
      billing_client_id: client.id,
      nif: client.nif,
    },
    address: client.address_line1
      ? {
          line1: client.address_line1,
          line2: client.address_line2 || undefined,
          city: client.city || undefined,
          state: client.province || undefined,
          postal_code: client.postal_code || undefined,
          country: client.country || undefined,
        }
      : undefined,
  });

  // Save to billing_clients
  const supabase = await createClient();
  await supabase
    .from('billing_clients')
    .update({ stripe_customer_id: customer.id })
    .eq('id', client.id);

  return customer.id;
}

/**
 * Create a Stripe Checkout Session for an existing billing invoice.
 * Returns the checkout URL and session ID.
 */
export async function createCheckoutForInvoice(
  invoice: BillingInvoice,
  lines: BillingInvoiceLine[],
  client: BillingClient | null,
  baseUrl: string
): Promise<{ checkoutUrl: string; sessionId: string }> {
  const stripe = await getStripeWithDbKey();

  // Map invoice lines to Stripe line_items
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = lines.map(
    (line) => ({
      price_data: {
        currency: STRIPE_CURRENCY,
        unit_amount: toCents(line.unit_price),
        product_data: {
          name: line.description,
        },
      },
      quantity: line.quantity,
    })
  );

  // Build session params
  const params: Stripe.Checkout.SessionCreateParams = {
    mode: 'payment',
    line_items: lineItems,
    metadata: {
      billing_invoice_id: invoice.id,
    },
    success_url: `${baseUrl}/admin/billing/invoices/${invoice.id}?payment=success`,
    cancel_url: `${baseUrl}/admin/billing/invoices/${invoice.id}?payment=cancelled`,
    // Dynamic payment methods - don't pass payment_method_types (Stripe best practice)
  };

  // Link to Stripe Customer if client exists
  if (client) {
    const customerId = await getOrCreateStripeCustomer(client);
    params.customer = customerId;
  } else if (invoice.client_name) {
    // Fallback: use email if no customer
    params.customer_email = undefined;
  }

  const session = await stripe.checkout.sessions.create(params);

  if (!session.url) {
    throw new Error('Stripe did not return a checkout URL');
  }

  // Save checkout session info on the invoice
  const supabase = await createClient();
  await supabase
    .from('billing_invoices')
    .update({
      stripe_checkout_session_id: session.id,
      stripe_payment_link_url: session.url,
    })
    .eq('id', invoice.id);

  return {
    checkoutUrl: session.url,
    sessionId: session.id,
  };
}

/**
 * Stripe Invoice Sync
 *
 * Auto-generates billing invoices from Stripe payments.
 * Handles:
 * - checkout.session.completed without linked invoice (external payments)
 * - invoice.paid for subscriptions (Billing API)
 */

import type Stripe from 'stripe';
import { getStripeWithDbKey, fromCents } from './client';
import { createClient } from '@/lib/supabase/server';
import type { InvoiceType } from '@/lib/types/billing';

/**
 * Extract PaymentIntent ID from a Stripe Invoice.
 * In newer API versions, payment_intent is nested under payments.data[].payment.
 */
function extractPaymentIntentId(invoice: Stripe.Invoice): string | null {
  const payment = invoice.payments?.data?.[0]?.payment;
  if (!payment) return null;
  if (payment.type === 'payment_intent' && payment.payment_intent) {
    return typeof payment.payment_intent === 'string'
      ? payment.payment_intent
      : payment.payment_intent.id;
  }
  return null;
}

/** Threshold in cents: above 40000 (400 EUR) -> F1, else F2 */
const F2_THRESHOLD_CENTS = 40000;

/**
 * Determine invoice type based on total amount.
 * Spanish law allows simplified invoice (F2) for amounts <= 400 EUR.
 */
export function determineInvoiceType(totalCents: number): InvoiceType {
  return totalCents > F2_THRESHOLD_CENTS ? 'F1' : 'F2';
}

/**
 * Resolve or create a billing_client from a Stripe Customer.
 * Returns the billing_client ID.
 */
export async function resolveOrCreateClient(
  stripeCustomer: Stripe.Customer
): Promise<string> {
  const supabase = await createClient();

  // Check if we already have a client with this stripe_customer_id
  const { data: existing } = await supabase
    .from('billing_clients')
    .select('id')
    .eq('stripe_customer_id', stripeCustomer.id)
    .single();

  if (existing) return existing.id;

  // Check by email
  if (stripeCustomer.email) {
    const { data: byEmail } = await supabase
      .from('billing_clients')
      .select('id')
      .eq('email', stripeCustomer.email)
      .single();

    if (byEmail) {
      // Link existing client to Stripe customer
      await supabase
        .from('billing_clients')
        .update({ stripe_customer_id: stripeCustomer.id })
        .eq('id', byEmail.id);
      return byEmail.id;
    }
  }

  // Create new client
  const { data: newClient, error } = await supabase
    .from('billing_clients')
    .insert({
      name: stripeCustomer.name || stripeCustomer.email || 'Stripe Customer',
      nif: (stripeCustomer.metadata?.nif) || 'PENDING',
      email: stripeCustomer.email || null,
      phone: stripeCustomer.phone || null,
      address_line1: stripeCustomer.address?.line1 || null,
      address_line2: stripeCustomer.address?.line2 || null,
      city: stripeCustomer.address?.city || null,
      postal_code: stripeCustomer.address?.postal_code || null,
      province: stripeCustomer.address?.state || null,
      country: stripeCustomer.address?.country || 'ES',
      stripe_customer_id: stripeCustomer.id,
    })
    .select('id')
    .single();

  if (error || !newClient) {
    throw new Error(`Failed to create billing client: ${error?.message}`);
  }

  return newClient.id;
}

/**
 * Get the next invoice number and increment it atomically.
 */
async function getNextInvoiceNumber(): Promise<{ series: string; number: number }> {
  const supabase = await createClient();

  const { data: settings, error } = await supabase
    .from('billing_settings')
    .select('default_series, next_invoice_number')
    .limit(1)
    .single();

  if (error || !settings) {
    throw new Error('Billing settings not found');
  }

  const series = settings.default_series || 'F';
  const number = settings.next_invoice_number || 1;

  // Increment
  await supabase
    .from('billing_settings')
    .update({ next_invoice_number: number + 1 })
    .eq('default_series', series);

  return { series, number };
}

/**
 * Create a billing invoice from a completed Stripe Checkout Session.
 * Used when a payment arrives without a linked billing_invoice_id.
 */
export async function createInvoiceFromCheckoutSession(
  session: Stripe.Checkout.Session
): Promise<string> {
  const stripe = await getStripeWithDbKey();
  const supabase = await createClient();

  // Expand line items from the session
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    limit: 100,
  });

  // Resolve client
  let clientId: string | null = null;
  let clientName = 'Stripe Customer';
  let clientNif = 'PENDING';

  if (session.customer) {
    const customer = await stripe.customers.retrieve(
      typeof session.customer === 'string' ? session.customer : session.customer.id
    );
    if (!customer.deleted) {
      clientId = await resolveOrCreateClient(customer as Stripe.Customer);
      clientName = customer.name || customer.email || 'Stripe Customer';
      clientNif = customer.metadata?.nif || 'PENDING';
    }
  }

  const totalCents = session.amount_total || 0;
  const invoiceType = determineInvoiceType(totalCents);
  const { series, number } = await getNextInvoiceNumber();

  // Calculate totals
  const total = fromCents(totalCents);
  // Approximate: assume 21% IVA standard
  const subtotal = Math.round((total / 1.21) * 100) / 100;
  const taxAmount = Math.round((total - subtotal) * 100) / 100;

  // Create invoice
  const { data: invoice, error: invoiceError } = await supabase
    .from('billing_invoices')
    .insert({
      series,
      number,
      invoice_type: invoiceType,
      description: `Stripe payment ${session.id}`,
      issue_date: new Date().toISOString().split('T')[0],
      client_id: clientId,
      client_name: clientName,
      client_nif: clientNif,
      subtotal,
      tax_amount: taxAmount,
      total,
      status: 'paid',
      payment_method: 'card',
      payment_date: new Date().toISOString().split('T')[0],
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id:
        typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent?.id || null,
    })
    .select('id')
    .single();

  if (invoiceError || !invoice) {
    throw new Error(`Failed to create invoice: ${invoiceError?.message}`);
  }

  // Create invoice lines from Stripe line items
  const invoiceLines = lineItems.data.map((item, index) => ({
    invoice_id: invoice.id,
    description: item.description || 'Stripe item',
    quantity: item.quantity || 1,
    unit_price: fromCents(item.price?.unit_amount || 0),
    tax_rate: 21,
    tax_type: 'IVA' as const,
    line_total: fromCents(item.amount_total - (item.amount_tax || 0)),
    tax_amount: fromCents(item.amount_tax || 0),
    sort_order: index,
  }));

  if (invoiceLines.length > 0) {
    await supabase.from('billing_invoice_lines').insert(invoiceLines);
  }

  return invoice.id;
}

/**
 * Create a billing invoice from a paid Stripe Invoice (subscriptions).
 */
export async function createInvoiceFromStripeInvoice(
  stripeInvoice: Stripe.Invoice
): Promise<string> {
  const stripe = await getStripeWithDbKey();
  const supabase = await createClient();

  // Resolve client
  let clientId: string | null = null;
  let clientName = 'Stripe Customer';
  let clientNif = 'PENDING';

  if (stripeInvoice.customer) {
    const customerId =
      typeof stripeInvoice.customer === 'string'
        ? stripeInvoice.customer
        : stripeInvoice.customer.id;
    const customer = await stripe.customers.retrieve(customerId);
    if (!customer.deleted) {
      clientId = await resolveOrCreateClient(customer as Stripe.Customer);
      clientName = customer.name || customer.email || 'Stripe Customer';
      clientNif = customer.metadata?.nif || 'PENDING';
    }
  }

  const totalCents = stripeInvoice.amount_paid || 0;
  const invoiceType = determineInvoiceType(totalCents);
  const { series, number } = await getNextInvoiceNumber();

  const total = fromCents(totalCents);
  const subtotal = Math.round((total / 1.21) * 100) / 100;
  const taxAmount = Math.round((total - subtotal) * 100) / 100;

  const subDetails = stripeInvoice.parent?.subscription_details;
  const subscriptionId = subDetails
    ? (typeof subDetails.subscription === 'string'
        ? subDetails.subscription
        : subDetails.subscription?.id || null)
    : null;

  const { data: invoice, error: invoiceError } = await supabase
    .from('billing_invoices')
    .insert({
      series,
      number,
      invoice_type: invoiceType,
      description: stripeInvoice.description || `Subscription invoice ${stripeInvoice.id}`,
      issue_date: new Date().toISOString().split('T')[0],
      client_id: clientId,
      client_name: clientName,
      client_nif: clientNif,
      subtotal,
      tax_amount: taxAmount,
      total,
      status: 'paid',
      payment_method: 'card',
      payment_date: new Date().toISOString().split('T')[0],
      stripe_invoice_id: stripeInvoice.id,
      stripe_subscription_id: subscriptionId,
      stripe_payment_intent_id: extractPaymentIntentId(stripeInvoice),
    })
    .select('id')
    .single();

  if (invoiceError || !invoice) {
    throw new Error(`Failed to create invoice: ${invoiceError?.message}`);
  }

  // Create lines from Stripe invoice line items
  const stripeLines = stripeInvoice.lines?.data || [];
  const invoiceLines = stripeLines.map((line, index) => ({
    invoice_id: invoice.id,
    description: line.description || 'Subscription item',
    quantity: line.quantity || 1,
    unit_price: line.pricing?.unit_amount_decimal
      ? parseFloat(line.pricing.unit_amount_decimal) / 100
      : fromCents(line.amount || 0),
    tax_rate: 21,
    tax_type: 'IVA' as const,
    line_total: fromCents(line.amount || 0),
    tax_amount: fromCents((line.taxes?.[0]?.amount) || 0),
    sort_order: index,
  }));

  if (invoiceLines.length > 0) {
    await supabase.from('billing_invoice_lines').insert(invoiceLines);
  }

  return invoice.id;
}

/**
 * Auto-issue an invoice to VeriFACTi if settings allow it.
 * Reuses the existing issue endpoint logic.
 */
export async function autoIssueToVerifacti(invoiceId: string): Promise<void> {
  const supabase = await createClient();

  // Check settings
  const { data: settings } = await supabase
    .from('billing_settings')
    .select('stripe_auto_issue, verifacti_api_key')
    .limit(1)
    .single();

  if (!settings?.stripe_auto_issue || !settings?.verifacti_api_key) {
    return; // Auto-issue disabled or no API key
  }

  // Call the issue endpoint internally
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';

    await fetch(`${baseUrl}/api/admin/billing/invoices/${invoiceId}/issue`, {
      method: 'POST',
    });
  } catch (error) {
    console.error('Auto-issue to VeriFACTi failed:', error);
  }
}

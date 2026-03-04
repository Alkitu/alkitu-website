import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import {
  verifyAndParseEvent,
  isEventProcessed,
  recordEvent,
  markEventProcessed,
  createInvoiceFromCheckoutSession,
  createInvoiceFromStripeInvoice,
  autoIssueToVerifacti,
  handleRefund,
  handleSubscriptionCreated,
  handleSubscriptionUpdated,
  handleSubscriptionDeleted,
} from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

/**
 * Stripe Webhook Handler
 *
 * Public endpoint (no admin auth). Stripe signs every request.
 * Following Stripe best practices:
 * - Verify signature with raw body
 * - Return 200 immediately
 * - Idempotency via stripe_events table
 * - Only listen to events we need
 */
export async function POST(request: Request) {
  // 1. Read raw body (CRITICAL for signature verification)
  const rawBody = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  // 2. Verify signature (Stripe best practice)
  let event: Stripe.Event;
  try {
    event = await verifyAndParseEvent(rawBody, signature);
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // 3. Idempotency: skip if already processed
  if (await isEventProcessed(event.id)) {
    return NextResponse.json({ received: true, skipped: true });
  }

  // 4. Record event before processing
  await recordEvent(event);

  // 5. Return 200 immediately (Stripe best practice)
  //    Process async below — if handler errors, the event is logged.
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case 'charge.refunded':
        await handleChargeRefunded(event.data.object as Stripe.Charge);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
    }

    await markEventProcessed(event.id, { success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Stripe webhook processing error [${event.type}]:`, message);
    await markEventProcessed(event.id, { success: false, error: message });
  }

  return NextResponse.json({ received: true });
}

/**
 * Handle checkout.session.completed
 * Two paths:
 * A) Has metadata.billing_invoice_id -> mark existing invoice as paid
 * B) No linked invoice -> auto-generate invoice if enabled
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const supabase = await createClient();
  const billingInvoiceId = session.metadata?.billing_invoice_id;

  if (billingInvoiceId) {
    // Path A: Mark existing invoice as paid
    await supabase
      .from('billing_invoices')
      .update({
        status: 'paid',
        payment_method: 'card',
        payment_date: new Date().toISOString().split('T')[0],
        stripe_payment_intent_id:
          typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.payment_intent?.id || null,
        stripe_charge_id: null, // Will be set from payment_intent if needed
      })
      .eq('id', billingInvoiceId);
    return;
  }

  // Path B: Auto-generate invoice
  const { data: settings } = await supabase
    .from('billing_settings')
    .select('stripe_auto_invoice, stripe_auto_issue')
    .limit(1)
    .single();

  if (!settings?.stripe_auto_invoice) {
    return; // Auto-invoice disabled
  }

  const invoiceId = await createInvoiceFromCheckoutSession(session);

  if (settings.stripe_auto_issue) {
    await autoIssueToVerifacti(invoiceId);
  }
}

/**
 * Handle invoice.paid (subscriptions)
 * Auto-generate billing invoice for recurring payments.
 */
async function handleInvoicePaid(stripeInvoice: Stripe.Invoice) {
  // Only process subscription invoices
  const isSubscription = stripeInvoice.billing_reason?.startsWith('subscription');
  if (!isSubscription) return;

  const supabase = await createClient();

  // Check settings
  const { data: settings } = await supabase
    .from('billing_settings')
    .select('stripe_auto_invoice, stripe_auto_issue')
    .limit(1)
    .single();

  if (!settings?.stripe_auto_invoice) return;

  // Check if we already have an invoice for this Stripe invoice
  const { data: existing } = await supabase
    .from('billing_invoices')
    .select('id')
    .eq('stripe_invoice_id', stripeInvoice.id)
    .single();

  if (existing) return; // Already processed

  const invoiceId = await createInvoiceFromStripeInvoice(stripeInvoice);

  if (settings.stripe_auto_issue) {
    await autoIssueToVerifacti(invoiceId);
  }
}

/**
 * Handle charge.refunded
 * Creates a rectificativa R1 invoice with negative amounts.
 */
async function handleChargeRefunded(charge: Stripe.Charge) {
  await handleRefund(charge);
}

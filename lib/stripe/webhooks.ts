/**
 * Stripe Webhook Utilities
 *
 * Signature verification, idempotency checks, and event recording.
 * Following Stripe best practices:
 * - Verify signature with raw body (not parsed JSON)
 * - Return 200 immediately before processing
 * - Track event IDs for idempotency
 */

import type Stripe from 'stripe';
import { getStripe, getWebhookSecret } from './client';
import { createClient } from '@/lib/supabase/server';

/**
 * Verify Stripe webhook signature and parse event.
 * MUST receive raw body string, not parsed JSON.
 * Reads webhook secret from DB first, falling back to env var.
 */
export async function verifyAndParseEvent(
  rawBody: string,
  signature: string
): Promise<Stripe.Event> {
  const webhookSecret = await getWebhookSecret();
  if (!webhookSecret) {
    throw new Error('Stripe Webhook Secret no configurado (ni en BD ni como STRIPE_WEBHOOK_SECRET env var)');
  }

  const stripe = getStripe();
  return stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
}

/**
 * Check if an event has already been processed (idempotency).
 */
export async function isEventProcessed(stripeEventId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('stripe_events')
    .select('id, processed')
    .eq('stripe_event_id', stripeEventId)
    .single();

  return !!data?.processed;
}

/**
 * Record a new Stripe event for idempotency tracking.
 */
export async function recordEvent(event: Stripe.Event): Promise<void> {
  const supabase = await createClient();
  await supabase.from('stripe_events').upsert(
    {
      stripe_event_id: event.id,
      event_type: event.type,
      processed: false,
      raw_payload: event as unknown as Record<string, unknown>,
    },
    { onConflict: 'stripe_event_id' }
  );
}

/**
 * Mark an event as processed with its result.
 */
export async function markEventProcessed(
  stripeEventId: string,
  result: { success: boolean; error?: string; data?: Record<string, unknown> }
): Promise<void> {
  const supabase = await createClient();
  await supabase
    .from('stripe_events')
    .update({
      processed: true,
      processing_result: result as unknown as Record<string, unknown>,
      error_message: result.error || null,
      processed_at: new Date().toISOString(),
    })
    .eq('stripe_event_id', stripeEventId);
}

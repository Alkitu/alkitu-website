/**
 * Stripe SDK Singleton
 *
 * Initializes and exports the Stripe SDK with pinned API version.
 * Uses server-side only (STRIPE_SECRET_KEY has no NEXT_PUBLIC_ prefix).
 *
 * Supports reading the secret key from:
 * 1. billing_settings.stripe_secret_key (DB)
 * 2. STRIPE_SECRET_KEY environment variable (fallback)
 */

import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

let stripeInstance: Stripe | null = null;
let stripeInstanceKey: string | null = null;

/**
 * Get a Stripe instance. Optionally pass a key to use instead of env var.
 * If the key changes, the singleton is invalidated and recreated.
 */
export function getStripe(key?: string): Stripe {
  const effectiveKey = key || process.env.STRIPE_SECRET_KEY;
  if (!effectiveKey) {
    throw new Error('Stripe secret key is not configured (neither in DB nor as STRIPE_SECRET_KEY env var)');
  }

  // Invalidate singleton if key changed
  if (stripeInstance && stripeInstanceKey !== effectiveKey) {
    stripeInstance = null;
    stripeInstanceKey = null;
  }

  if (!stripeInstance) {
    stripeInstance = new Stripe(effectiveKey, {
      typescript: true,
    });
    stripeInstanceKey = effectiveKey;
  }
  return stripeInstance;
}

/**
 * Read stripe_secret_key from billing_settings, falling back to env var.
 * Returns null if neither is configured.
 */
export async function getStripeKey(): Promise<string | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('billing_settings')
      .select('stripe_secret_key')
      .limit(1)
      .single();

    if (data?.stripe_secret_key) {
      return data.stripe_secret_key;
    }
  } catch {
    // DB read failed, fall through to env var
  }

  return process.env.STRIPE_SECRET_KEY || null;
}

/**
 * Read stripe_webhook_secret from billing_settings, falling back to env var.
 * Returns null if neither is configured.
 */
export async function getWebhookSecret(): Promise<string | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('billing_settings')
      .select('stripe_webhook_secret')
      .limit(1)
      .single();

    if (data?.stripe_webhook_secret) {
      return data.stripe_webhook_secret;
    }
  } catch {
    // DB read failed, fall through to env var
  }

  return process.env.STRIPE_WEBHOOK_SECRET || null;
}

/**
 * Get a Stripe instance using the key from DB (with env var fallback).
 * Convenience wrapper for routes that need DB-sourced keys.
 */
export async function getStripeWithDbKey(): Promise<Stripe> {
  const key = await getStripeKey();
  if (!key) {
    throw new Error('Stripe secret key is not configured (neither in DB nor as STRIPE_SECRET_KEY env var)');
  }
  return getStripe(key);
}

export const STRIPE_CURRENCY = 'eur' as const;

/** Convert EUR amount (e.g. 99.99) to Stripe cents (9999) */
export function toCents(amount: number): number {
  return Math.round(amount * 100);
}

/** Convert Stripe cents (9999) to EUR amount (99.99) */
export function fromCents(cents: number): number {
  return cents / 100;
}

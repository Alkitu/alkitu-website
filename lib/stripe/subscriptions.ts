/**
 * Stripe Subscription Lifecycle
 *
 * Syncs Stripe subscription events with the stripe_subscriptions table.
 * Follows Stripe Billing APIs best practices.
 */

import type Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

/**
 * Handle subscription created event.
 */
export async function handleSubscriptionCreated(
  subscription: Stripe.Subscription
): Promise<void> {
  const supabase = await createClient();

  const customerId =
    typeof subscription.customer === 'string'
      ? subscription.customer
      : subscription.customer.id;

  // Find billing client by stripe_customer_id
  const { data: client } = await supabase
    .from('billing_clients')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  await supabase.from('stripe_subscriptions').upsert(
    {
      stripe_subscription_id: subscription.id,
      client_id: client?.id || null,
      stripe_customer_id: customerId,
      status: subscription.status,
      current_period_start: subscription.start_date
        ? new Date(subscription.start_date * 1000).toISOString()
        : null,
      current_period_end: subscription.ended_at
        ? new Date(subscription.ended_at * 1000).toISOString()
        : null,
      cancel_at_period_end: subscription.cancel_at_period_end,
      description: subscription.description || null,
      metadata: (subscription.metadata || {}) as Record<string, unknown>,
    },
    { onConflict: 'stripe_subscription_id' }
  );
}

/**
 * Handle subscription updated event.
 */
export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
): Promise<void> {
  const supabase = await createClient();

  await supabase
    .from('stripe_subscriptions')
    .update({
      status: subscription.status,
      current_period_start: subscription.start_date
        ? new Date(subscription.start_date * 1000).toISOString()
        : null,
      current_period_end: subscription.ended_at
        ? new Date(subscription.ended_at * 1000).toISOString()
        : null,
      cancel_at_period_end: subscription.cancel_at_period_end,
      description: subscription.description || null,
      metadata: (subscription.metadata || {}) as Record<string, unknown>,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);
}

/**
 * Handle subscription deleted event.
 */
export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
): Promise<void> {
  const supabase = await createClient();

  await supabase
    .from('stripe_subscriptions')
    .update({
      status: 'canceled',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);
}

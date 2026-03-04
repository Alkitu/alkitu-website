/**
 * Stripe Refund Handler
 *
 * Creates rectificativa (R1) invoices from Stripe refunds.
 * A charge.refunded event triggers creation of a corrective invoice
 * with negative line amounts.
 */

import type Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';
import { fromCents } from './client';
import type { BillingInvoiceLine } from '@/lib/types/billing';

/**
 * Handle a charge.refunded event.
 * Finds the original invoice by stripe_payment_intent_id and creates
 * a rectificativa R1 with negative amounts.
 */
export async function handleRefund(charge: Stripe.Charge): Promise<string | null> {
  const supabase = await createClient();

  if (!charge.payment_intent) {
    console.error('Refund: charge has no payment_intent');
    return null;
  }

  const paymentIntentId =
    typeof charge.payment_intent === 'string'
      ? charge.payment_intent
      : charge.payment_intent.id;

  // Find the original invoice
  const { data: originalInvoice } = await supabase
    .from('billing_invoices')
    .select('*, billing_invoice_lines(*)')
    .eq('stripe_payment_intent_id', paymentIntentId)
    .single();

  if (!originalInvoice) {
    console.error(`Refund: no invoice found for payment_intent ${paymentIntentId}`);
    return null;
  }

  const lines = originalInvoice.billing_invoice_lines as BillingInvoiceLine[];

  // Calculate refund proportion
  const refundedAmountCents = charge.amount_refunded || 0;
  const originalAmountCents = charge.amount || 0;
  const isFullRefund = refundedAmountCents >= originalAmountCents;
  const refundRatio = isFullRefund ? 1 : refundedAmountCents / originalAmountCents;

  // Get next invoice number
  const { data: settings } = await supabase
    .from('billing_settings')
    .select('default_series, next_invoice_number')
    .limit(1)
    .single();

  if (!settings) {
    throw new Error('Billing settings not found');
  }

  const series = settings.default_series || 'F';
  const number = settings.next_invoice_number || 1;

  // Increment number
  await supabase
    .from('billing_settings')
    .update({ next_invoice_number: number + 1 })
    .eq('default_series', series);

  // Calculate negative totals
  const subtotal = -Math.abs(Math.round(originalInvoice.subtotal * refundRatio * 100) / 100);
  const taxAmount = -Math.abs(Math.round(originalInvoice.tax_amount * refundRatio * 100) / 100);
  const total = -Math.abs(fromCents(refundedAmountCents));

  // Get the latest refund ID
  const refundId = charge.refunds?.data?.[0]?.id || null;

  // Create rectificativa invoice
  const { data: rectificativa, error } = await supabase
    .from('billing_invoices')
    .insert({
      series,
      number,
      invoice_type: 'R1',
      description: `Rectificativa por reembolso Stripe ${refundId || charge.id}`,
      issue_date: new Date().toISOString().split('T')[0],
      client_id: originalInvoice.client_id,
      client_name: originalInvoice.client_name,
      client_nif: originalInvoice.client_nif,
      subtotal,
      tax_amount: taxAmount,
      total,
      status: 'paid',
      payment_method: 'card',
      payment_date: new Date().toISOString().split('T')[0],
      corrected_invoice_id: originalInvoice.id,
      correction_reason: isFullRefund ? 'Reembolso total' : 'Reembolso parcial',
      correction_type: 'I', // Por diferencias
      stripe_payment_intent_id: paymentIntentId,
      stripe_charge_id: charge.id,
      stripe_refund_id: refundId,
    })
    .select('id')
    .single();

  if (error || !rectificativa) {
    throw new Error(`Failed to create rectificativa: ${error?.message}`);
  }

  // Create negative line items
  const rectificativaLines = lines.map((line, index) => ({
    invoice_id: rectificativa.id,
    description: line.description,
    quantity: line.quantity,
    unit_price: -Math.abs(Math.round(line.unit_price * refundRatio * 100) / 100),
    tax_rate: line.tax_rate,
    tax_type: line.tax_type,
    line_total: -Math.abs(Math.round(line.line_total * refundRatio * 100) / 100),
    tax_amount: -Math.abs(Math.round(line.tax_amount * refundRatio * 100) / 100),
    sort_order: index,
  }));

  if (rectificativaLines.length > 0) {
    await supabase.from('billing_invoice_lines').insert(rectificativaLines);
  }

  return rectificativa.id;
}

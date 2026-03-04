import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApiSuccess, ApiError } from '@/lib/api/response';
import { createCheckoutForInvoice } from '@/lib/stripe/checkout';
import type { BillingInvoiceLine, BillingClient } from '@/lib/types/billing';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * POST /api/admin/billing/invoices/[id]/checkout
 * Create a Stripe Checkout Session for an issued invoice.
 * Returns the checkout URL for redirect.
 */
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();

    // Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return ApiError.unauthorized('Authentication required');

    const { data: adminUser } = await supabase
      .from('admin_users').select('id').eq('id', user.id).single();
    if (!adminUser) return ApiError.forbidden('Admin access required');

    // Check Stripe is enabled
    const { data: settings } = await supabase
      .from('billing_settings')
      .select('stripe_enabled')
      .limit(1)
      .single();

    if (!settings?.stripe_enabled) {
      return ApiError.badRequest('Stripe no esta habilitado. Activalo en Configuracion.');
    }

    // Fetch invoice with lines
    const { data: invoice, error: invoiceError } = await supabase
      .from('billing_invoices')
      .select('*, billing_invoice_lines(*)')
      .eq('id', id)
      .single();

    if (invoiceError || !invoice) {
      return ApiError.notFound('Factura no encontrada');
    }

    if (invoice.status !== 'issued') {
      return ApiError.badRequest('Solo se pueden crear enlaces de pago para facturas emitidas');
    }

    if (invoice.stripe_checkout_session_id) {
      // Return existing URL if session already created
      return ApiSuccess.ok({
        checkout_url: invoice.stripe_payment_link_url,
        session_id: invoice.stripe_checkout_session_id,
      }, 'Enlace de pago ya existente');
    }

    const lines = invoice.billing_invoice_lines as BillingInvoiceLine[];
    if (!lines || lines.length === 0) {
      return ApiError.badRequest('La factura no tiene lineas');
    }

    // Fetch client if exists
    let client: BillingClient | null = null;
    if (invoice.client_id) {
      const { data: clientData } = await supabase
        .from('billing_clients')
        .select('*')
        .eq('id', invoice.client_id)
        .single();
      client = clientData;
    }

    // Determine base URL
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    // Create Checkout Session
    const result = await createCheckoutForInvoice(invoice, lines, client, baseUrl);

    return ApiSuccess.created({
      checkout_url: result.checkoutUrl,
      session_id: result.sessionId,
    }, 'Enlace de pago creado');
  } catch (error) {
    console.error('Checkout creation error:', error);
    const message = error instanceof Error ? error.message : 'Error al crear enlace de pago';
    return ApiError.internal(message);
  }
}

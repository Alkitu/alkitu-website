import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/utils/rate-limiter';

/**
 * Verifacti Webhook Handler
 *
 * Public endpoint (no admin auth) — Verifacti calls this to notify
 * us of invoice processing results. We find the invoice by its
 * verifacti_uuid and update verifacti_status accordingly.
 */
export async function POST(request: Request) {
  try {
    // Rate limiting: 60 requests per minute per IP
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateCheck = checkRateLimit(`verifacti-webhook:${ip}`, {
      maxRequests: 60,
      windowMs: 60_000,
    });
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Verifacti sends: { uuid, estado, huella?, csv?, qr?, errores? }
    const { uuid, estado, huella, qr } = body;

    if (!uuid || !estado) {
      return NextResponse.json(
        { error: 'Missing required fields: uuid, estado' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Find invoice by verifacti_uuid
    const { data: invoice, error: findError } = await supabase
      .from('billing_invoices')
      .select('id, verifacti_status')
      .eq('verifacti_uuid', uuid)
      .single();

    if (findError || !invoice) {
      // Return 200 anyway to prevent Verifacti from retrying
      // The invoice may not exist in our system
      return NextResponse.json({ received: true, matched: false });
    }

    // Build update payload
    const updateData: Record<string, unknown> = {
      verifacti_status: estado,
    };

    if (huella) {
      updateData.verifacti_huella = huella;
    }

    if (qr) {
      updateData.verifacti_qr = qr;
    }

    // Update invoice
    const { error: updateError } = await supabase
      .from('billing_invoices')
      .update(updateData)
      .eq('id', invoice.id);

    if (updateError) {
      console.error('Webhook: failed to update invoice:', updateError);
      return NextResponse.json(
        { error: 'Failed to update invoice' },
        { status: 500 }
      );
    }

    return NextResponse.json({ received: true, matched: true });
  } catch (error) {
    console.error('Verifacti webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { createClient } from '@/lib/supabase/server';
import { ApiSuccess, ApiError } from '@/lib/api/response';
import { generateInvoicePDF } from '@/lib/billing/pdf/generate-pdf';
import { sendInvoiceEmail } from '@/lib/billing/email/send-invoice';
import type { BillingInvoice, BillingInvoiceLine, BillingSettings, BillingClient } from '@/lib/types/billing';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return ApiError.unauthorized();
    }
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', user.id)
      .single();
    if (!adminUser) {
      return ApiError.forbidden();
    }

    // Fetch invoice
    const { data: invoice, error: invError } = await supabase
      .from('billing_invoices')
      .select('*')
      .eq('id', id)
      .single();

    if (invError || !invoice) {
      return ApiError.notFound('Invoice not found');
    }

    // Only allow sending issued or paid invoices
    if (invoice.status === 'draft') {
      return ApiError.badRequest('Cannot send a draft invoice. Issue it first.');
    }

    // Determine recipient email
    let recipientEmail: string | null = null;

    // Try to get body for explicit email override
    try {
      const body = await request.json();
      if (body.email) {
        recipientEmail = body.email;
      }
    } catch {
      // No body provided, use client email
    }

    // Fallback to client email
    if (!recipientEmail && invoice.client_id) {
      const { data: client } = await supabase
        .from('billing_clients')
        .select('email')
        .eq('id', invoice.client_id)
        .single();

      recipientEmail = (client as BillingClient | null)?.email || null;
    }

    if (!recipientEmail) {
      return ApiError.badRequest('No recipient email. Provide an email or set one on the client.');
    }

    // Fetch lines
    const { data: lines } = await supabase
      .from('billing_invoice_lines')
      .select('*')
      .eq('invoice_id', id)
      .order('sort_order', { ascending: true });

    // Fetch settings
    const { data: settings } = await supabase
      .from('billing_settings')
      .select('*')
      .limit(1)
      .single();

    if (!settings) {
      return ApiError.badRequest('Billing settings not configured');
    }

    // Generate PDF
    const pdfBuffer = await generateInvoicePDF(
      invoice as BillingInvoice,
      (lines || []) as BillingInvoiceLine[],
      settings as BillingSettings
    );

    // Send email
    const result = await sendInvoiceEmail({
      invoice: invoice as BillingInvoice,
      settings: settings as BillingSettings,
      pdfBuffer,
      recipientEmail,
    });

    if (!result.success) {
      return ApiError.internal(`Failed to send email: ${result.error}`);
    }

    return ApiSuccess.ok(
      { sentTo: recipientEmail },
      'Invoice email sent successfully'
    );
  } catch (error) {
    console.error('Send invoice email error:', error);
    return ApiError.internal('Error sending invoice email', error);
  }
}

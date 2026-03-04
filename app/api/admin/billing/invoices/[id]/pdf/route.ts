import { createClient } from '@/lib/supabase/server';
import { generateInvoicePDF } from '@/lib/billing/pdf/generate-pdf';
import type { BillingInvoice, BillingInvoiceLine, BillingSettings } from '@/lib/types/billing';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response('Unauthorized', { status: 401 });
    }
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', user.id)
      .single();
    if (!adminUser) {
      return new Response('Forbidden', { status: 403 });
    }

    // Fetch invoice
    const { data: invoice, error: invError } = await supabase
      .from('billing_invoices')
      .select('*')
      .eq('id', id)
      .single();

    if (invError || !invoice) {
      return new Response('Invoice not found', { status: 404 });
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
      return new Response('Billing settings not configured', { status: 400 });
    }

    const pdfBuffer = await generateInvoicePDF(
      invoice as BillingInvoice,
      (lines || []) as BillingInvoiceLine[],
      settings as BillingSettings
    );

    const invoiceNumber = `${invoice.series}-${String(invoice.number).padStart(4, '0')}`;

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="factura-${invoiceNumber}.pdf"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return new Response('Error generating PDF', { status: 500 });
  }
}

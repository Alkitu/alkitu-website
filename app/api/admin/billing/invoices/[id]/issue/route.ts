import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApiSuccess, ApiError } from '@/lib/api/response';
import { createInvoice as verifactiCreateInvoice } from '@/lib/verifacti/client';
import { buildVerifactiCreateRequest, formatVerifactiDate } from '@/lib/verifacti/mapper';
import type { BillingInvoiceLine, BillingClient, BillingSettings } from '@/lib/types/billing';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * POST /api/admin/billing/invoices/[id]/issue
 * Submit a draft invoice to Verifacti and mark as issued.
 */
export async function POST(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return ApiError.unauthorized('Authentication required');

    const { data: adminUser } = await supabase
      .from('admin_users').select('id').eq('id', user.id).single();
    if (!adminUser) return ApiError.forbidden('Admin access required');

    // Fetch invoice with lines
    const { data: invoice, error: invoiceError } = await supabase
      .from('billing_invoices')
      .select('*, billing_invoice_lines(*)')
      .eq('id', id)
      .single();

    if (invoiceError || !invoice) return ApiError.notFound('Factura no encontrada');
    if (invoice.status !== 'draft') {
      return ApiError.badRequest('Solo se pueden emitir facturas en borrador');
    }

    const lines = invoice.billing_invoice_lines as BillingInvoiceLine[];
    if (!lines || lines.length === 0) {
      return ApiError.badRequest('La factura no tiene lineas');
    }

    // Fetch billing settings (for Verifacti API key)
    const { data: settings } = await supabase
      .from('billing_settings')
      .select('*')
      .limit(1)
      .single();

    if (!settings?.verifacti_api_key) {
      return ApiError.badRequest('Clave API de Verifacti no configurada. Ve a Configuracion.');
    }

    // Fetch client data
    let client: BillingClient | null = null;
    if (invoice.client_id) {
      const { data: clientData } = await supabase
        .from('billing_clients')
        .select('*')
        .eq('id', invoice.client_id)
        .single();
      client = clientData;
    }

    // Build Verifacti request
    const verifactiPayload = buildVerifactiCreateRequest(
      invoice,
      lines,
      client as BillingClient,
      settings as BillingSettings
    );

    // Handle corrective invoice reference
    if (invoice.invoice_type.startsWith('R') && invoice.corrected_invoice_id) {
      const { data: correctedInvoice } = await supabase
        .from('billing_invoices')
        .select('series, number, issue_date')
        .eq('id', invoice.corrected_invoice_id)
        .single();

      if (correctedInvoice) {
        verifactiPayload.factura_rectificada = {
          serie_factura: correctedInvoice.series,
          numero_factura: String(correctedInvoice.number),
          fecha_expedicion: formatVerifactiDate(new Date(correctedInvoice.issue_date)),
        };
      }
    }

    // Submit to Verifacti
    const verifactiResponse = await verifactiCreateInvoice(
      settings.verifacti_api_key,
      verifactiPayload
    );

    // Update invoice with Verifacti data
    const { data: updatedInvoice, error: updateError } = await supabase
      .from('billing_invoices')
      .update({
        status: 'issued',
        issue_date: new Date().toISOString().split('T')[0],
        verifacti_uuid: verifactiResponse.uuid || null,
        verifacti_status: verifactiResponse.estado || 'Pendiente',
        verifacti_qr: verifactiResponse.qr || null,
        verifacti_url: verifactiResponse.url || null,
        verifacti_huella: verifactiResponse.huella || null,
      })
      .eq('id', id)
      .select('*, billing_invoice_lines(*)')
      .single();

    if (updateError) {
      return ApiError.database('Factura enviada a Verifacti pero error al actualizar BD', updateError);
    }

    return ApiSuccess.ok(updatedInvoice, 'Factura emitida y enviada a VeriFactu');
  } catch (error) {
    console.error('Invoice issue error:', error);
    const message = error instanceof Error ? error.message : 'Error al emitir factura';
    return ApiError.internal(message);
  }
}

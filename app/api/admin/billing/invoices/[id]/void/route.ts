import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApiSuccess, ApiError } from '@/lib/api/response';
import { cancelInvoice as verifactiCancelInvoice } from '@/lib/verifacti/client';
import { formatVerifactiDate } from '@/lib/verifacti/mapper';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * POST /api/admin/billing/invoices/[id]/void
 * Cancel an invoice at Verifacti and mark as voided.
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

    // Fetch invoice
    const { data: invoice } = await supabase
      .from('billing_invoices')
      .select('*')
      .eq('id', id)
      .single();

    if (!invoice) return ApiError.notFound('Factura no encontrada');
    if (invoice.status === 'voided') {
      return ApiError.badRequest('La factura ya esta anulada');
    }
    if (invoice.status === 'draft') {
      return ApiError.badRequest('No se puede anular una factura en borrador. Eliminala directamente.');
    }

    // Fetch billing settings
    const { data: settings } = await supabase
      .from('billing_settings')
      .select('verifacti_api_key')
      .limit(1)
      .single();

    if (!settings?.verifacti_api_key) {
      return ApiError.badRequest('Clave API de Verifacti no configurada');
    }

    // Cancel at Verifacti using serie + numero + fecha
    await verifactiCancelInvoice(settings.verifacti_api_key, {
      serie: invoice.series,
      numero: String(invoice.number),
      fecha_expedicion: formatVerifactiDate(new Date(invoice.issue_date)),
    });

    // Update invoice status
    const { data: updatedInvoice, error: updateError } = await supabase
      .from('billing_invoices')
      .update({
        status: 'voided',
        verifacti_status: 'Anulado',
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      return ApiError.database('Factura anulada en Verifacti pero error al actualizar BD', updateError);
    }

    return ApiSuccess.ok(updatedInvoice, 'Factura anulada correctamente');
  } catch (error) {
    console.error('Invoice void error:', error);
    const message = error instanceof Error ? error.message : 'Error al anular factura';
    return ApiError.internal(message);
  }
}

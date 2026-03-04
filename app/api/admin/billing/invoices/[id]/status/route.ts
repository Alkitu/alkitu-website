import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApiSuccess, ApiError } from '@/lib/api/response';
import { checkStatus as verifactiCheckStatus } from '@/lib/verifacti/client';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * POST /api/admin/billing/invoices/[id]/status
 * Check Verifacti status for an issued invoice and update DB.
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

    const { data: invoice } = await supabase
      .from('billing_invoices')
      .select('id, verifacti_uuid, verifacti_status, status')
      .eq('id', id)
      .single();

    if (!invoice) return ApiError.notFound('Factura no encontrada');
    if (!invoice.verifacti_uuid) {
      return ApiError.badRequest('Esta factura no ha sido enviada a VeriFactu');
    }

    const { data: settings } = await supabase
      .from('billing_settings')
      .select('verifacti_api_key')
      .limit(1)
      .single();

    if (!settings?.verifacti_api_key) {
      return ApiError.badRequest('Clave API de Verifacti no configurada');
    }

    const statusResponse = await verifactiCheckStatus(
      settings.verifacti_api_key,
      invoice.verifacti_uuid
    );

    // Update if status changed
    if (statusResponse.estado !== invoice.verifacti_status) {
      await supabase
        .from('billing_invoices')
        .update({ verifacti_status: statusResponse.estado })
        .eq('id', id);
    }

    return ApiSuccess.ok({
      verifacti_uuid: invoice.verifacti_uuid,
      verifacti_status: statusResponse.estado,
      details: statusResponse,
    }, 'Estado actualizado');
  } catch (error) {
    console.error('Invoice status check error:', error);
    const message = error instanceof Error ? error.message : 'Error al consultar estado';
    return ApiError.internal(message);
  }
}

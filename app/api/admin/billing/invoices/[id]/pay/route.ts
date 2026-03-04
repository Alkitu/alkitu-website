import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApiSuccess, ApiError } from '@/lib/api/response';
import { markAsPaidSchema } from '@/lib/schemas/billing';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * POST /api/admin/billing/invoices/[id]/pay
 * Mark an issued invoice as paid.
 */
export async function POST(request: NextRequest, context: RouteContext) {
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
      .select('id, status')
      .eq('id', id)
      .single();

    if (!invoice) return ApiError.notFound('Factura no encontrada');
    if (invoice.status === 'paid') {
      return ApiError.badRequest('La factura ya esta marcada como pagada');
    }
    if (invoice.status !== 'issued') {
      return ApiError.badRequest('Solo se pueden marcar como pagadas facturas emitidas');
    }

    const body = await request.json();
    const result = markAsPaidSchema.safeParse(body);
    if (!result.success) return ApiError.validationError(result.error);

    const { data: updatedInvoice, error } = await supabase
      .from('billing_invoices')
      .update({
        status: 'paid',
        payment_method: result.data.payment_method,
        payment_date: result.data.payment_date || new Date().toISOString().split('T')[0],
      })
      .eq('id', id)
      .select()
      .single();

    if (error) return ApiError.database('Error al marcar factura como pagada', error);

    return ApiSuccess.ok(updatedInvoice, 'Factura marcada como pagada');
  } catch (error) {
    console.error('Invoice pay error:', error);
    return ApiError.internal('An unexpected error occurred');
  }
}

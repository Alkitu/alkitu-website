import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApiSuccess, ApiError } from '@/lib/api/response';
import { billingClientSchema } from '@/lib/schemas/billing';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/admin/billing/clients/[id]
 */
export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return ApiError.unauthorized('Authentication required');

    const { data: adminUser } = await supabase
      .from('admin_users').select('id').eq('id', user.id).single();
    if (!adminUser) return ApiError.forbidden('Admin access required');

    const { data: client, error } = await supabase
      .from('billing_clients')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !client) return ApiError.notFound('Cliente no encontrado');

    return ApiSuccess.ok(client);
  } catch (error) {
    console.error('Billing client GET error:', error);
    return ApiError.internal('An unexpected error occurred');
  }
}

/**
 * PATCH /api/admin/billing/clients/[id]
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return ApiError.unauthorized('Authentication required');

    const { data: adminUser } = await supabase
      .from('admin_users').select('id').eq('id', user.id).single();
    if (!adminUser) return ApiError.forbidden('Admin access required');

    const body = await request.json();
    const result = billingClientSchema.partial().safeParse(body);
    if (!result.success) return ApiError.validationError(result.error);

    const { data: client, error } = await supabase
      .from('billing_clients')
      .update(result.data)
      .eq('id', id)
      .select()
      .single();

    if (error) return ApiError.database('Failed to update client', error);
    if (!client) return ApiError.notFound('Cliente no encontrado');

    return ApiSuccess.ok(client, 'Cliente actualizado correctamente');
  } catch (error) {
    console.error('Billing client PATCH error:', error);
    return ApiError.internal('An unexpected error occurred');
  }
}

/**
 * DELETE /api/admin/billing/clients/[id]
 */
export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return ApiError.unauthorized('Authentication required');

    const { data: adminUser } = await supabase
      .from('admin_users').select('id').eq('id', user.id).single();
    if (!adminUser) return ApiError.forbidden('Admin access required');

    // Check if client has invoices
    const { count } = await supabase
      .from('billing_invoices')
      .select('id', { count: 'exact', head: true })
      .eq('client_id', id);

    if (count && count > 0) {
      return ApiError.conflict(`No se puede eliminar: el cliente tiene ${count} factura(s) asociada(s)`);
    }

    const { error } = await supabase
      .from('billing_clients')
      .delete()
      .eq('id', id);

    if (error) return ApiError.database('Failed to delete client', error);

    return ApiSuccess.ok(null, 'Cliente eliminado correctamente');
  } catch (error) {
    console.error('Billing client DELETE error:', error);
    return ApiError.internal('An unexpected error occurred');
  }
}

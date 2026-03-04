import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApiSuccess, ApiError } from '@/lib/api/response';
import { billingProductSchema } from '@/lib/schemas/billing';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/admin/billing/products/[id]
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

    const { data: product, error } = await supabase
      .from('billing_products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !product) return ApiError.notFound('Producto no encontrado');

    return ApiSuccess.ok(product);
  } catch (error) {
    console.error('Billing product GET error:', error);
    return ApiError.internal('An unexpected error occurred');
  }
}

/**
 * PATCH /api/admin/billing/products/[id]
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
    const result = billingProductSchema.partial().safeParse(body);
    if (!result.success) return ApiError.validationError(result.error);

    const { data: product, error } = await supabase
      .from('billing_products')
      .update(result.data)
      .eq('id', id)
      .select()
      .single();

    if (error) return ApiError.database('Failed to update product', error);
    if (!product) return ApiError.notFound('Producto no encontrado');

    return ApiSuccess.ok(product, 'Producto actualizado correctamente');
  } catch (error) {
    console.error('Billing product PATCH error:', error);
    return ApiError.internal('An unexpected error occurred');
  }
}

/**
 * DELETE /api/admin/billing/products/[id]
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

    const { error } = await supabase
      .from('billing_products')
      .delete()
      .eq('id', id);

    if (error) return ApiError.database('Failed to delete product', error);

    return ApiSuccess.ok(null, 'Producto eliminado correctamente');
  } catch (error) {
    console.error('Billing product DELETE error:', error);
    return ApiError.internal('An unexpected error occurred');
  }
}

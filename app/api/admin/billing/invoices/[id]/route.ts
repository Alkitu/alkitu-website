import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApiSuccess, ApiError } from '@/lib/api/response';
import { updateInvoiceSchema } from '@/lib/schemas/billing';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/admin/billing/invoices/[id]
 * Fetch single invoice with lines
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

    const { data: invoice, error } = await supabase
      .from('billing_invoices')
      .select('*, billing_invoice_lines(*)')
      .eq('id', id)
      .single();

    if (error || !invoice) return ApiError.notFound('Factura no encontrada');

    // Sort lines by sort_order
    if (invoice.billing_invoice_lines) {
      invoice.billing_invoice_lines.sort(
        (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order
      );
    }

    return ApiSuccess.ok(invoice);
  } catch (error) {
    console.error('Billing invoice GET error:', error);
    return ApiError.internal('An unexpected error occurred');
  }
}

/**
 * PATCH /api/admin/billing/invoices/[id]
 * Update a draft invoice. Cannot update issued/paid/voided.
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

    // Check invoice exists and is draft
    const { data: existing } = await supabase
      .from('billing_invoices')
      .select('id, status')
      .eq('id', id)
      .single();

    if (!existing) return ApiError.notFound('Factura no encontrada');
    if (existing.status !== 'draft') {
      return ApiError.badRequest('Solo se pueden editar facturas en borrador');
    }

    const body = await request.json();
    const result = updateInvoiceSchema.safeParse(body);
    if (!result.success) return ApiError.validationError(result.error);

    const { lines, ...invoiceUpdate } = result.data;

    // If client_id is being changed, update denormalized fields
    if (invoiceUpdate.client_id) {
      const { data: client } = await supabase
        .from('billing_clients')
        .select('name, nif')
        .eq('id', invoiceUpdate.client_id)
        .single();

      if (!client) return ApiError.badRequest('Cliente no encontrado');

      Object.assign(invoiceUpdate, {
        client_name: client.name,
        client_nif: client.nif,
      });
    }

    // If lines are provided, replace them
    if (lines && lines.length > 0) {
      // Calculate new totals
      const processedLines = lines.map((line, index) => {
        const lineTotal = Number((line.quantity * line.unit_price).toFixed(2));
        const taxAmount = Number((lineTotal * (line.tax_rate / 100)).toFixed(2));
        return {
          invoice_id: id,
          description: line.description,
          product_id: line.product_id || null,
          quantity: line.quantity,
          unit_price: line.unit_price,
          tax_rate: line.tax_rate,
          tax_type: line.tax_type || 'IVA',
          line_total: lineTotal,
          tax_amount: taxAmount,
          sort_order: index,
        };
      });

      const subtotal = processedLines.reduce((sum, l) => sum + l.line_total, 0);
      const taxAmount = processedLines.reduce((sum, l) => sum + l.tax_amount, 0);
      const total = Number((subtotal + taxAmount).toFixed(2));

      Object.assign(invoiceUpdate, {
        subtotal: Number(subtotal.toFixed(2)),
        tax_amount: Number(taxAmount.toFixed(2)),
        total,
      });

      // Delete old lines and insert new ones
      await supabase.from('billing_invoice_lines').delete().eq('invoice_id', id);

      const { error: linesError } = await supabase
        .from('billing_invoice_lines')
        .insert(processedLines);

      if (linesError) return ApiError.database('Error al actualizar lineas', linesError);
    }

    // Update invoice
    const { data: invoice, error } = await supabase
      .from('billing_invoices')
      .update(invoiceUpdate)
      .eq('id', id)
      .select('*, billing_invoice_lines(*)')
      .single();

    if (error) return ApiError.database('Error al actualizar factura', error);
    if (!invoice) return ApiError.notFound('Factura no encontrada');

    return ApiSuccess.ok(invoice, 'Factura actualizada correctamente');
  } catch (error) {
    console.error('Billing invoice PATCH error:', error);
    return ApiError.internal('An unexpected error occurred');
  }
}

/**
 * DELETE /api/admin/billing/invoices/[id]
 * Delete a draft invoice only.
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

    // Check invoice exists and is draft
    const { data: existing } = await supabase
      .from('billing_invoices')
      .select('id, status')
      .eq('id', id)
      .single();

    if (!existing) return ApiError.notFound('Factura no encontrada');
    if (existing.status !== 'draft') {
      return ApiError.badRequest('Solo se pueden eliminar facturas en borrador');
    }

    const { error } = await supabase
      .from('billing_invoices')
      .delete()
      .eq('id', id);

    if (error) return ApiError.database('Error al eliminar factura', error);

    return ApiSuccess.ok(null, 'Factura eliminada correctamente');
  } catch (error) {
    console.error('Billing invoice DELETE error:', error);
    return ApiError.internal('An unexpected error occurred');
  }
}

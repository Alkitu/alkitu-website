import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApiSuccess, ApiError } from '@/lib/api/response';
import { createInvoiceSchema, billingInvoicesQuerySchema } from '@/lib/schemas/billing';

/**
 * GET /api/admin/billing/invoices
 * List invoices with pagination, filters (status, date, client, search)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return ApiError.unauthorized('Authentication required');

    const { data: adminUser } = await supabase
      .from('admin_users').select('id').eq('id', user.id).single();
    if (!adminUser) return ApiError.forbidden('Admin access required');

    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const query = billingInvoicesQuerySchema.safeParse(searchParams);
    if (!query.success) return ApiError.validationError(query.error);

    const { page, limit, status, search, client_id, date_from, date_to } = query.data;
    const offset = (page - 1) * limit;

    let baseQuery = supabase
      .from('billing_invoices')
      .select('*', { count: 'exact' });

    if (status !== 'all') {
      baseQuery = baseQuery.eq('status', status);
    }
    if (search) {
      baseQuery = baseQuery.or(
        `client_name.ilike.%${search}%,client_nif.ilike.%${search}%,description.ilike.%${search}%`
      );
    }
    if (client_id) {
      baseQuery = baseQuery.eq('client_id', client_id);
    }
    if (date_from) {
      baseQuery = baseQuery.gte('issue_date', date_from);
    }
    if (date_to) {
      baseQuery = baseQuery.lte('issue_date', date_to);
    }

    const { data: invoices, count, error } = await baseQuery
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) return ApiError.database('Failed to fetch invoices', error);

    return ApiSuccess.ok({
      invoices: invoices || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Billing invoices GET error:', error);
    return ApiError.internal('An unexpected error occurred');
  }
}

/**
 * POST /api/admin/billing/invoices
 * Create a new invoice with lines. Auto-assigns next number.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return ApiError.unauthorized('Authentication required');

    const { data: adminUser } = await supabase
      .from('admin_users').select('id').eq('id', user.id).single();
    if (!adminUser) return ApiError.forbidden('Admin access required');

    const body = await request.json();
    const result = createInvoiceSchema.safeParse(body);
    if (!result.success) return ApiError.validationError(result.error);

    const { lines, ...invoiceData } = result.data;

    // Fetch client data to denormalize onto invoice
    const { data: client, error: clientError } = await supabase
      .from('billing_clients')
      .select('name, nif')
      .eq('id', invoiceData.client_id)
      .single();

    if (clientError || !client) return ApiError.badRequest('Cliente no encontrado');

    // Get next invoice number (uses DB function with FOR UPDATE lock)
    const { data: nextNum, error: numError } = await supabase
      .rpc('get_next_invoice_number', { p_series: invoiceData.series || 'F' });

    if (numError || nextNum === null) {
      return ApiError.database('Error al obtener numero de factura', numError);
    }

    // Calculate line totals
    const processedLines = lines.map((line, index) => {
      const lineTotal = Number((line.quantity * line.unit_price).toFixed(2));
      const taxAmount = Number((lineTotal * (line.tax_rate / 100)).toFixed(2));
      return {
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

    // Insert invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from('billing_invoices')
      .insert({
        series: invoiceData.series || 'F',
        number: nextNum,
        invoice_type: invoiceData.invoice_type || 'F1',
        description: invoiceData.description || null,
        issue_date: new Date().toISOString().split('T')[0],
        due_date: invoiceData.due_date || null,
        client_id: invoiceData.client_id,
        client_name: client.name,
        client_nif: client.nif,
        subtotal: Number(subtotal.toFixed(2)),
        tax_amount: Number(taxAmount.toFixed(2)),
        total,
        status: 'draft',
        notes: invoiceData.notes || null,
        corrected_invoice_id: invoiceData.corrected_invoice_id || null,
        correction_reason: invoiceData.correction_reason || null,
        correction_type: invoiceData.correction_type || null,
      })
      .select()
      .single();

    if (invoiceError || !invoice) {
      return ApiError.database('Error al crear factura', invoiceError);
    }

    // Insert invoice lines
    const linesWithInvoiceId = processedLines.map((line) => ({
      ...line,
      invoice_id: invoice.id,
    }));

    const { error: linesError } = await supabase
      .from('billing_invoice_lines')
      .insert(linesWithInvoiceId);

    if (linesError) {
      // Rollback: delete the invoice (cascade deletes lines)
      await supabase.from('billing_invoices').delete().eq('id', invoice.id);
      return ApiError.database('Error al crear lineas de factura', linesError);
    }

    // Re-fetch with lines
    const { data: fullInvoice } = await supabase
      .from('billing_invoices')
      .select('*, billing_invoice_lines(*)')
      .eq('id', invoice.id)
      .single();

    return ApiSuccess.created(fullInvoice, 'Factura creada correctamente');
  } catch (error) {
    console.error('Billing invoices POST error:', error);
    return ApiError.internal('An unexpected error occurred');
  }
}

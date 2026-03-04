import { createClient } from '@/lib/supabase/server';
import { ApiSuccess, ApiError } from '@/lib/api/response';

/**
 * GET /api/admin/billing/reports?type=income|tax&year=2026&period=monthly|quarterly|yearly
 *
 * Returns billing reports for the admin dashboard.
 */
export async function GET(request: Request) {
  try {
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

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'income';
    const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()));
    const period = searchParams.get('period') || 'monthly';

    if (type === 'income') {
      return await getIncomeReport(supabase, year, period);
    } else if (type === 'tax') {
      return await getTaxReport(supabase, year, period);
    } else if (type === 'summary') {
      return await getSummaryReport(supabase);
    }

    return ApiError.badRequest('Invalid report type. Use: income, tax, or summary');
  } catch (error) {
    return ApiError.internal('Error generating report', error);
  }
}

async function getIncomeReport(supabase: Awaited<ReturnType<typeof createClient>>, year: number, period: string) {
  let groupBy: string;
  let dateFormat: string;

  switch (period) {
    case 'quarterly':
      groupBy = `EXTRACT(QUARTER FROM issue_date::date)`;
      dateFormat = 'quarter';
      break;
    case 'yearly':
      groupBy = `EXTRACT(YEAR FROM issue_date::date)`;
      dateFormat = 'year';
      break;
    default: // monthly
      groupBy = `EXTRACT(MONTH FROM issue_date::date)`;
      dateFormat = 'month';
      break;
  }

  const { data, error } = await supabase.rpc('get_income_report', {
    p_year: year,
    p_period: dateFormat,
  });

  // If the RPC doesn't exist, fall back to a raw query approach
  if (error) {
    // Fallback: fetch all issued/paid invoices for the year and aggregate in JS
    const { data: invoices, error: invError } = await supabase
      .from('billing_invoices')
      .select('issue_date, subtotal, tax_amount, total, status')
      .in('status', ['issued', 'paid'])
      .gte('issue_date', `${year}-01-01`)
      .lte('issue_date', `${year}-12-31`)
      .order('issue_date', { ascending: true });

    if (invError) {
      return ApiError.database('Error fetching invoices for report', invError);
    }

    const periodData = aggregateByPeriod(invoices || [], period);
    return ApiSuccess.ok({ year, period, data: periodData });
  }

  return ApiSuccess.ok({ year, period, data });
}

async function getTaxReport(supabase: Awaited<ReturnType<typeof createClient>>, year: number, period: string) {
  // Fetch all invoice lines with their invoice data for the year
  const { data: invoices, error: invError } = await supabase
    .from('billing_invoices')
    .select('id, issue_date, status, billing_invoice_lines(tax_rate, tax_type, line_total, tax_amount)')
    .in('status', ['issued', 'paid'])
    .gte('issue_date', `${year}-01-01`)
    .lte('issue_date', `${year}-12-31`)
    .order('issue_date', { ascending: true });

  if (invError) {
    return ApiError.database('Error fetching tax data', invError);
  }

  const taxData = aggregateTaxByPeriod(invoices || [], period);
  return ApiSuccess.ok({ year, period, data: taxData });
}

async function getSummaryReport(supabase: Awaited<ReturnType<typeof createClient>>) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // Total invoices by status
  const { data: statusCounts } = await supabase
    .from('billing_invoices')
    .select('status');

  const counts = {
    total: statusCounts?.length || 0,
    draft: statusCounts?.filter(i => i.status === 'draft').length || 0,
    issued: statusCounts?.filter(i => i.status === 'issued').length || 0,
    paid: statusCounts?.filter(i => i.status === 'paid').length || 0,
    voided: statusCounts?.filter(i => i.status === 'voided').length || 0,
  };

  // Revenue this year
  const { data: yearInvoices } = await supabase
    .from('billing_invoices')
    .select('total, subtotal, tax_amount')
    .in('status', ['issued', 'paid'])
    .gte('issue_date', `${currentYear}-01-01`)
    .lte('issue_date', `${currentYear}-12-31`);

  const yearRevenue = (yearInvoices || []).reduce((sum, inv) => sum + Number(inv.total), 0);
  const yearSubtotal = (yearInvoices || []).reduce((sum, inv) => sum + Number(inv.subtotal), 0);
  const yearTax = (yearInvoices || []).reduce((sum, inv) => sum + Number(inv.tax_amount), 0);

  // Revenue this month
  const monthStart = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`;
  const nextMonth = currentMonth === 12
    ? `${currentYear + 1}-01-01`
    : `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`;

  const { data: monthInvoices } = await supabase
    .from('billing_invoices')
    .select('total')
    .in('status', ['issued', 'paid'])
    .gte('issue_date', monthStart)
    .lt('issue_date', nextMonth);

  const monthRevenue = (monthInvoices || []).reduce((sum, inv) => sum + Number(inv.total), 0);

  // Outstanding (issued but not paid)
  const { data: outstandingInvoices } = await supabase
    .from('billing_invoices')
    .select('total')
    .eq('status', 'issued');

  const outstanding = (outstandingInvoices || []).reduce((sum, inv) => sum + Number(inv.total), 0);

  // Recent invoices
  const { data: recentInvoices } = await supabase
    .from('billing_invoices')
    .select('id, series, number, client_name, total, status, issue_date')
    .order('created_at', { ascending: false })
    .limit(5);

  return ApiSuccess.ok({
    counts,
    yearRevenue,
    yearSubtotal,
    yearTax,
    monthRevenue,
    outstanding,
    recentInvoices: recentInvoices || [],
  });
}

// Helper functions for JS-side aggregation

interface InvoiceRow {
  issue_date: string;
  subtotal: number;
  tax_amount: number;
  total: number;
  status: string;
}

function aggregateByPeriod(invoices: InvoiceRow[], period: string) {
  const buckets: Record<string, { label: string; subtotal: number; tax: number; total: number; count: number }> = {};

  for (const inv of invoices) {
    const date = new Date(inv.issue_date);
    let key: string;
    let label: string;

    switch (period) {
      case 'quarterly': {
        const q = Math.ceil((date.getMonth() + 1) / 3);
        key = `Q${q}`;
        label = `T${q}`;
        break;
      }
      case 'yearly': {
        key = String(date.getFullYear());
        label = key;
        break;
      }
      default: {
        const m = date.getMonth() + 1;
        key = String(m).padStart(2, '0');
        const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        label = monthNames[m - 1];
        break;
      }
    }

    if (!buckets[key]) {
      buckets[key] = { label, subtotal: 0, tax: 0, total: 0, count: 0 };
    }
    buckets[key].subtotal += Number(inv.subtotal);
    buckets[key].tax += Number(inv.tax_amount);
    buckets[key].total += Number(inv.total);
    buckets[key].count++;
  }

  return Object.values(buckets);
}

interface InvoiceWithLines {
  id: string;
  issue_date: string;
  status: string;
  billing_invoice_lines: { tax_rate: number; tax_type: string; line_total: number; tax_amount: number }[];
}

function aggregateTaxByPeriod(invoices: InvoiceWithLines[], period: string) {
  const buckets: Record<string, Record<string, { tax_rate: number; tax_type: string; base: number; cuota: number }>> = {};

  for (const inv of invoices) {
    const date = new Date(inv.issue_date);
    let key: string;

    switch (period) {
      case 'quarterly': {
        const q = Math.ceil((date.getMonth() + 1) / 3);
        key = `Q${q}`;
        break;
      }
      case 'yearly': {
        key = String(date.getFullYear());
        break;
      }
      default: {
        const m = date.getMonth() + 1;
        key = String(m).padStart(2, '0');
        break;
      }
    }

    if (!buckets[key]) {
      buckets[key] = {};
    }

    for (const line of inv.billing_invoice_lines) {
      const taxKey = `${line.tax_type}-${line.tax_rate}`;
      if (!buckets[key][taxKey]) {
        buckets[key][taxKey] = {
          tax_rate: Number(line.tax_rate),
          tax_type: line.tax_type,
          base: 0,
          cuota: 0,
        };
      }
      buckets[key][taxKey].base += Number(line.line_total);
      buckets[key][taxKey].cuota += Number(line.tax_amount);
    }
  }

  return Object.entries(buckets).map(([period, taxes]) => ({
    period,
    taxes: Object.values(taxes),
  }));
}

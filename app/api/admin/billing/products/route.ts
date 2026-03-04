import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApiSuccess, ApiError } from '@/lib/api/response';
import { billingProductSchema, billingProductsQuerySchema } from '@/lib/schemas/billing';

/**
 * GET /api/admin/billing/products
 * List billing products with pagination and search.
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return ApiError.unauthorized('Authentication required');

    const { data: adminUser } = await supabase
      .from('admin_users').select('id').eq('id', user.id).single();
    if (!adminUser) return ApiError.forbidden('Admin access required');

    const { searchParams } = new URL(request.url);
    const queryParams = {
      page: searchParams.get('page') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
      search: searchParams.get('search'),
      active: searchParams.get('active') ?? undefined,
    };

    const result = billingProductsQuerySchema.safeParse(queryParams);
    if (!result.success) return ApiError.validationError(result.error);

    const { page, limit, search, active } = result.data;

    let query = supabase
      .from('billing_products')
      .select('*', { count: 'exact' });

    if (active !== 'all') {
      query = query.eq('active', active === 'true');
    }

    if (search && search.trim()) {
      query = query.or(`name.ilike.%${search.trim()}%,description.ilike.%${search.trim()}%`);
    }

    const { count: totalCount } = await query;
    const total = totalCount || 0;

    const offset = (page - 1) * limit;
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: products, error } = await query;

    if (error) return ApiError.database('Failed to fetch products', error);

    return ApiSuccess.ok({
      products: products || [],
      pagination: { total, totalPages: Math.ceil(total / limit), currentPage: page, limit },
    });
  } catch (error) {
    console.error('Billing products GET error:', error);
    return ApiError.internal('An unexpected error occurred');
  }
}

/**
 * POST /api/admin/billing/products
 * Create a new billing product.
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
    const result = billingProductSchema.safeParse(body);
    if (!result.success) return ApiError.validationError(result.error);

    const { data: product, error } = await supabase
      .from('billing_products')
      .insert(result.data)
      .select()
      .single();

    if (error) return ApiError.database('Failed to create product', error);

    return ApiSuccess.created(product, 'Producto creado correctamente');
  } catch (error) {
    console.error('Billing products POST error:', error);
    return ApiError.internal('An unexpected error occurred');
  }
}

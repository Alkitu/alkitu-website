import { createClient } from '@/lib/supabase/server';
import { ApiSuccess, ApiError } from '@/lib/api/response';
import { stripeEventsQuerySchema } from '@/lib/schemas/stripe';
import { NextRequest } from 'next/server';

/**
 * GET /api/admin/billing/stripe/events
 * List Stripe webhook events with processing status.
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return ApiError.unauthorized('Authentication required');

    const { data: adminUser } = await supabase
      .from('admin_users').select('id').eq('id', user.id).single();
    if (!adminUser) return ApiError.forbidden('Admin access required');

    // Parse query params
    const { searchParams } = new URL(request.url);
    const params = stripeEventsQuerySchema.safeParse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      event_type: searchParams.get('event_type'),
      processed: searchParams.get('processed'),
    });

    if (!params.success) return ApiError.validationError(params.error);
    const { page, limit, event_type, processed } = params.data;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('stripe_events')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (event_type) {
      query = query.eq('event_type', event_type);
    }
    if (processed === 'true') {
      query = query.eq('processed', true);
    } else if (processed === 'false') {
      query = query.eq('processed', false);
    }

    const { data, error, count } = await query;

    if (error) return ApiError.database('Error al obtener eventos', error);

    return ApiSuccess.ok({
      events: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Stripe events error:', error);
    return ApiError.internal('Error al obtener eventos de Stripe');
  }
}

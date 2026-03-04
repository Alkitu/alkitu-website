import { createClient } from '@/lib/supabase/server';
import { ApiSuccess, ApiError } from '@/lib/api/response';
import { healthCheck } from '@/lib/verifacti';

/**
 * POST /api/admin/billing/settings/health
 * Test Verifacti API connectivity using the stored API key.
 */
export async function POST() {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return ApiError.unauthorized('Authentication required');

    const { data: adminUser } = await supabase
      .from('admin_users').select('id').eq('id', user.id).single();
    if (!adminUser) return ApiError.forbidden('Admin access required');

    const { data: settings } = await supabase
      .from('billing_settings')
      .select('verifacti_api_key')
      .limit(1)
      .single();

    if (!settings?.verifacti_api_key) {
      return ApiError.badRequest('No hay API key de Verifacti configurada');
    }

    const result = await healthCheck(settings.verifacti_api_key);

    return ApiSuccess.ok(result, 'Conexion con Verifacti verificada');
  } catch (error) {
    console.error('Verifacti health check error:', error);
    return ApiError.internal('No se pudo conectar con Verifacti. Verifica la API key.');
  }
}

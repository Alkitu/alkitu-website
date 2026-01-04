import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApiError } from '@/lib/api/response';

/**
 * GET /api/admin/newsletter-subscribers/export
 *
 * Export all newsletter subscribers to CSV
 *
 * Returns:
 * - CSV file download with filename: newsletter-subscribers-YYYY-MM-DD.csv
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check admin authentication
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return ApiError.unauthorized('Authentication required');
    }

    // Verify user is admin
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!adminUser) {
      return ApiError.forbidden('Admin access required');
    }

    // Fetch all subscribers (no pagination)
    const { data: subscribers, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching subscribers for export:', error);
      return ApiError.internalError('Failed to fetch subscribers');
    }

    if (!subscribers || subscribers.length === 0) {
      return ApiError.notFound('No subscribers found to export');
    }

    // Convert to CSV
    const csvHeader = 'Email,Status,Locale,Created At,Verified At,Unsubscribed At\n';

    const csvRows = subscribers.map((subscriber) => {
      const email = subscriber.email || '';
      const status = subscriber.status || '';
      const locale = subscriber.locale || '';
      const createdAt = subscriber.created_at ? new Date(subscriber.created_at).toISOString() : '';
      const verifiedAt = subscriber.verified_at ? new Date(subscriber.verified_at).toISOString() : '';
      const unsubscribedAt = subscriber.unsubscribed_at ? new Date(subscriber.unsubscribed_at).toISOString() : '';

      // Escape commas and quotes in values
      const escapeCsv = (value: string) => {
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      };

      return `${escapeCsv(email)},${escapeCsv(status)},${escapeCsv(locale)},${escapeCsv(createdAt)},${escapeCsv(verifiedAt)},${escapeCsv(unsubscribedAt)}`;
    });

    const csvContent = csvHeader + csvRows.join('\n');

    // Generate filename with current date
    const today = new Date().toISOString().split('T')[0];
    const filename = `newsletter-subscribers-${today}.csv`;

    // Return CSV file
    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error) {
    console.error('Newsletter subscribers export error:', error);
    return ApiError.internalError('An unexpected error occurred');
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createAnalyticsClient } from '@/lib/supabase/analytics';
import { newsletterUnsubscribeSchema } from '@/lib/schemas/newsletter';
import { resend, RESEND_CONFIG } from '@/lib/resend';
import { render } from '@react-email/render';
import { EnglishGoodbyeEmail, SpanishGoodbyeEmail } from '@/lib/email-templates/newsletter';

/**
 * POST /api/newsletter/unsubscribe/[token]
 *
 * Unsubscribes user from newsletter using unsubscribe token
 *
 * Features:
 * - Validates unsubscribe token (permanent, unique per subscriber)
 * - Updates subscriber status to 'unsubscribed'
 * - Sets unsubscribed_at timestamp
 * - Sends goodbye email
 * - Allows re-subscription later (new row with UNIQUE(email, status))
 *
 * @param request - Next.js request object
 * @param params - Route parameters containing token
 * @returns JSON response with unsubscribe status
 *
 * @example Success Response (200 OK):
 * ```json
 * {
 *   "success": true,
 *   "message": "Te has dado de baja exitosamente del boletín.",
 *   "data": {
 *     "email": "user@example.com",
 *     "status": "unsubscribed",
 *     "unsubscribed_at": "2025-01-04T10:30:00Z"
 *   }
 * }
 * ```
 *
 * @example Invalid Token (404 Not Found):
 * ```json
 * {
 *   "success": false,
 *   "error": "Token inválido / Invalid token",
 *   "details": "El token de baja no es válido."
 * }
 * ```
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    // Validate token parameter
    if (!token || typeof token !== 'string' || token.length !== 64) {
      return NextResponse.json(
        {
          success: false,
          error: 'Token inválido / Invalid token',
          details:
            'El token de baja no es válido. / The unsubscribe token is invalid.',
        },
        { status: 400 }
      );
    }

    // Parse request body (optional exitTime for tracking)
    let exitTime: string | undefined;
    try {
      const body = await request.json();
      const validationResult = newsletterUnsubscribeSchema.safeParse(body);
      if (validationResult.success) {
        exitTime = validationResult.data.exitTime;
      }
    } catch {
      // Body is optional, continue without it
    }

    // Create Supabase client for database operations
    const supabaseAnon = createAnalyticsClient();

    // Find subscriber by unsubscribe token
    const { data: subscriber, error: selectError } = await supabaseAnon
      .from('newsletter_subscribers')
      .select('*')
      .eq('unsubscribe_token', token)
      .maybeSingle();

    if (selectError) {
      console.error('Database error:', selectError);
      return NextResponse.json(
        {
          success: false,
          error: 'Error de base de datos / Database error',
          details: 'Por favor, inténtalo de nuevo más tarde. / Please try again later.',
        },
        { status: 500 }
      );
    }

    // If no subscriber found
    if (!subscriber) {
      return NextResponse.json(
        {
          success: false,
          error: 'Token inválido / Invalid token',
          details:
            'El token de baja no es válido o el suscriptor no existe. / The unsubscribe token is invalid or the subscriber does not exist.',
        },
        { status: 404 }
      );
    }

    // If already unsubscribed
    if (subscriber.status === 'unsubscribed') {
      return NextResponse.json(
        {
          success: false,
          error: 'Ya dado de baja / Already unsubscribed',
          details:
            subscriber.locale === 'es'
              ? 'Ya te has dado de baja del boletín anteriormente.'
              : 'You have already unsubscribed from the newsletter.',
        },
        { status: 404 }
      );
    }

    // Update subscriber status to 'unsubscribed'
    const { data: updatedSubscriber, error: updateError } = await supabaseAnon
      .from('newsletter_subscribers')
      .update({
        status: 'unsubscribed',
        unsubscribed_at: exitTime || new Date().toISOString(),
      })
      .eq('id', subscriber.id)
      .select()
      .single();

    if (updateError || !updatedSubscriber) {
      console.error('Update error:', updateError);
      return NextResponse.json(
        {
          success: false,
          error: 'Error al dar de baja / Error unsubscribing',
          details: 'Por favor, inténtalo de nuevo más tarde. / Please try again later.',
        },
        { status: 500 }
      );
    }

    // Send goodbye email
    try {
      console.log('📧 Sending goodbye email:', {
        email: updatedSubscriber.email,
        locale: updatedSubscriber.locale,
      });

      // Select appropriate goodbye email template based on locale
      const GoodbyeTemplate =
        updatedSubscriber.locale === 'es' ? SpanishGoodbyeEmail : EnglishGoodbyeEmail;

      const goodbyeEmailHtml = await render(GoodbyeTemplate());

      const goodbyeSubject =
        updatedSubscriber.locale === 'es'
          ? '👋 Te hemos dado de baja del boletín de Alkitu'
          : '👋 You have been unsubscribed from the Alkitu newsletter';

      await resend.emails.send({
        from: RESEND_CONFIG.fromEmail,
        to: [updatedSubscriber.email],
        subject: goodbyeSubject,
        html: goodbyeEmailHtml,
      });

      console.log('✅ Goodbye email sent successfully:', updatedSubscriber.email);
    } catch (emailError) {
      // Log email error but don't fail the request
      // The unsubscribe is already processed in database
      console.error('❌ Goodbye email sending failed:', emailError);
      console.error('Email error details:', {
        error: emailError instanceof Error ? emailError.message : 'Unknown error',
        email: updatedSubscriber.email,
        locale: updatedSubscriber.locale,
      });
    }

    // Success response
    const successMessage =
      updatedSubscriber.locale === 'es'
        ? 'Te has dado de baja exitosamente del boletín. Sentimos verte partir.'
        : 'You have successfully unsubscribed from the newsletter. Sorry to see you go.';

    return NextResponse.json(
      {
        success: true,
        message: successMessage,
        data: {
          email: updatedSubscriber.email,
          status: updatedSubscriber.status,
          unsubscribed_at: updatedSubscriber.unsubscribed_at,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error in newsletter unsubscribe:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor / Internal server error',
        details: 'Por favor, inténtalo de nuevo más tarde. / Please try again later.',
      },
      { status: 500 }
    );
  }
}

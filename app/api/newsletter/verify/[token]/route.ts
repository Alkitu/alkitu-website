import { NextRequest, NextResponse } from 'next/server';
import { createAnalyticsClient } from '@/lib/supabase/analytics';
import { resend, RESEND_CONFIG } from '@/lib/resend';
import { render } from '@react-email/render';
import { EnglishWelcomeEmail, SpanishWelcomeEmail } from '@/lib/email-templates/newsletter';

/**
 * GET /api/newsletter/verify/[token]
 *
 * Verifies newsletter subscription using verification token
 *
 * Features:
 * - Validates verification token
 * - Updates subscriber status to 'active'
 * - Sets verified_at timestamp
 * - Clears verification_token (one-time use)
 * - Sends welcome email
 *
 * @param request - Next.js request object
 * @param params - Route parameters containing token
 * @returns JSON response with verification status
 *
 * @example Success Response (200 OK):
 * ```json
 * {
 *   "success": true,
 *   "message": "¡Suscripción verificada! Bienvenido al boletín de Alkitu.",
 *   "data": {
 *     "email": "user@example.com",
 *     "status": "active",
 *     "verified_at": "2025-01-04T10:30:00Z"
 *   }
 * }
 * ```
 *
 * @example Invalid Token (404 Not Found):
 * ```json
 * {
 *   "success": false,
 *   "error": "Token inválido / Invalid token",
 *   "details": "El token de verificación no es válido o ha expirado."
 * }
 * ```
 */
export async function GET(
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
            'El token de verificación no es válido. / The verification token is invalid.',
        },
        { status: 400 }
      );
    }

    // Create Supabase client for database operations
    const supabaseAnon = createAnalyticsClient();

    // Find subscriber by verification token
    const { data: subscriber, error: selectError } = await supabaseAnon
      .from('newsletter_subscribers')
      .select('*')
      .eq('verification_token', token)
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

    // If no subscriber found or token is null (already verified)
    if (!subscriber || !subscriber.verification_token) {
      return NextResponse.json(
        {
          success: false,
          error: 'Token inválido / Invalid token',
          details:
            'El token de verificación no es válido o ha expirado. Es posible que ya hayas verificado tu suscripción. / The verification token is invalid or has expired. You may have already verified your subscription.',
        },
        { status: 404 }
      );
    }

    // Update subscriber status to 'active'
    const { data: updatedSubscriber, error: updateError } = await supabaseAnon
      .from('newsletter_subscribers')
      .update({
        status: 'active',
        verified_at: new Date().toISOString(),
        verification_token: null, // Clear token after verification (one-time use)
      })
      .eq('id', subscriber.id)
      .select()
      .single();

    if (updateError || !updatedSubscriber) {
      console.error('Update error:', updateError);
      return NextResponse.json(
        {
          success: false,
          error: 'Error al verificar / Error verifying',
          details: 'Por favor, inténtalo de nuevo más tarde. / Please try again later.',
        },
        { status: 500 }
      );
    }

    // Send welcome email
    try {
      console.log('📧 Sending welcome email:', {
        email: updatedSubscriber.email,
        locale: updatedSubscriber.locale,
      });

      // Select appropriate welcome email template based on locale
      const WelcomeTemplate =
        updatedSubscriber.locale === 'es' ? SpanishWelcomeEmail : EnglishWelcomeEmail;

      const welcomeEmailHtml = await render(WelcomeTemplate());

      const welcomeSubject =
        updatedSubscriber.locale === 'es'
          ? '🎉 ¡Bienvenido al boletín de Alkitu!'
          : '🎉 Welcome to the Alkitu newsletter!';

      await resend.emails.send({
        from: RESEND_CONFIG.fromEmail,
        to: [updatedSubscriber.email],
        subject: welcomeSubject,
        html: welcomeEmailHtml,
      });

      console.log('✅ Welcome email sent successfully:', updatedSubscriber.email);
    } catch (emailError) {
      // Log email error but don't fail the request
      // The subscription is already verified in database
      console.error('❌ Welcome email sending failed:', emailError);
      console.error('Email error details:', {
        error: emailError instanceof Error ? emailError.message : 'Unknown error',
        email: updatedSubscriber.email,
        locale: updatedSubscriber.locale,
      });
    }

    // Success response
    const successMessage =
      updatedSubscriber.locale === 'es'
        ? '¡Suscripción verificada! Bienvenido al boletín de Alkitu.'
        : 'Subscription verified! Welcome to the Alkitu newsletter.';

    return NextResponse.json(
      {
        success: true,
        message: successMessage,
        data: {
          email: updatedSubscriber.email,
          status: updatedSubscriber.status,
          verified_at: updatedSubscriber.verified_at,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error in newsletter verification:', error);
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

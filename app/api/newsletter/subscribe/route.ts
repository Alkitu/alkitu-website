import { NextRequest, NextResponse } from 'next/server';
import { createAnalyticsClient } from '@/lib/supabase/analytics';
import { newsletterSubscribeSchema, type NewsletterSubscribeData } from '@/lib/schemas/newsletter';
import { checkRateLimit } from '@/lib/utils/rate-limiter';
import { resend, RESEND_CONFIG } from '@/lib/resend';
import { render } from '@react-email/render';
import { EnglishVerificationEmail, SpanishVerificationEmail } from '@/lib/email-templates/newsletter';

/**
 * POST /api/newsletter/subscribe
 *
 * Handles newsletter subscription with double opt-in
 *
 * Features:
 * - Zod validation of email and locale
 * - Rate limiting (3 subscriptions per hour per IP)
 * - Duplicate email handling (409 if active, resend if pending)
 * - Auto-generates verification token via database trigger
 * - Sends verification email with token link
 * - Captures user metadata (IP, user agent)
 *
 * @param request - Next.js request object
 * @returns JSON response with subscription status
 *
 * @example Success Response (201 Created):
 * ```json
 * {
 *   "success": true,
 *   "message": "Subscription successful! Please check your email to confirm.",
 *   "data": {
 *     "email": "user@example.com",
 *     "status": "pending"
 *   }
 * }
 * ```
 *
 * @example Duplicate Active Subscription (409 Conflict):
 * ```json
 * {
 *   "success": false,
 *   "error": "Ya estás suscrito / You are already subscribed",
 *   "details": "This email is already subscribed to the newsletter."
 * }
 * ```
 *
 * @example Rate Limit Error (429 Too Many Requests):
 * ```json
 * {
 *   "success": false,
 *   "error": "Demasiadas solicitudes / Too many requests",
 *   "details": "Has alcanzado el límite de 3 suscripciones por hora.",
 *   "retryAfter": 2700
 * }
 * ```
 */
export async function POST(request: NextRequest) {
  try {
    // Extract IP address for rate limiting and logging
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Extract user agent for logging
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Rate limiting: 3 subscriptions per hour per IP
    const rateLimitResult = checkRateLimit(ip, {
      maxRequests: 3,
      windowMs: 3600000, // 1 hour
    });

    if (!rateLimitResult.allowed) {
      const resetInMinutes = Math.ceil(rateLimitResult.resetIn / 60000);

      return NextResponse.json(
        {
          success: false,
          error: 'Demasiadas solicitudes / Too many requests',
          details:
            rateLimitResult.count === 3
              ? `Has alcanzado el límite de ${rateLimitResult.limit} suscripciones por hora. Inténtalo de nuevo en ${resetInMinutes} minutos. / You have reached the limit of ${rateLimitResult.limit} subscriptions per hour. Try again in ${resetInMinutes} minutes.`
              : `Límite excedido. Has intentado suscribirte ${rateLimitResult.count} veces. Límite: ${rateLimitResult.limit} por hora. / Limit exceeded. You have attempted to subscribe ${rateLimitResult.count} times. Limit: ${rateLimitResult.limit} per hour.`,
          retryAfter: Math.ceil(rateLimitResult.resetIn / 1000), // seconds
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': Math.max(
              0,
              rateLimitResult.limit - rateLimitResult.count
            ).toString(),
            'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
            'Retry-After': Math.ceil(rateLimitResult.resetIn / 1000).toString(),
          },
        }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = newsletterSubscribeSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Datos inválidos / Invalid data',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const formData: NewsletterSubscribeData = validationResult.data;

    // Create Supabase client for database operations (using analytics client for anon role)
    const supabaseAnon = createAnalyticsClient();

    // Check if email already exists
    const { data: existingSubscriber } = await supabaseAnon
      .from('newsletter_subscribers')
      .select('*')
      .eq('email', formData.email)
      .maybeSingle();

    // Handle duplicate subscriptions
    if (existingSubscriber) {
      // If already active, return 409 Conflict
      if (existingSubscriber.status === 'active') {
        return NextResponse.json(
          {
            success: false,
            error: 'Ya estás suscrito / You are already subscribed',
            details:
              formData.locale === 'es'
                ? 'Este correo electrónico ya está suscrito al boletín.'
                : 'This email is already subscribed to the newsletter.',
          },
          { status: 409 }
        );
      }

      // If pending, resend verification email
      if (existingSubscriber.status === 'pending' && existingSubscriber.verification_token) {
        try {
          // Get site URL from environment
          const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
          const verificationUrl = `${siteUrl}/${formData.locale}/newsletter/verify?token=${existingSubscriber.verification_token}`;

          // Select appropriate email template
          const VerificationTemplate =
            formData.locale === 'es' ? SpanishVerificationEmail : EnglishVerificationEmail;

          const verificationEmailHtml = await render(
            VerificationTemplate({ verificationUrl })
          );

          const verificationSubject =
            formData.locale === 'es'
              ? '📬 Confirma tu suscripción al boletín de Alkitu'
              : '📬 Confirm your subscription to the Alkitu newsletter';

          await resend.emails.send({
            from: RESEND_CONFIG.fromEmail,
            to: [formData.email],
            subject: verificationSubject,
            html: verificationEmailHtml,
          });

          console.log('✅ Verification email resent:', formData.email);

          return NextResponse.json(
            {
              success: true,
              message:
                formData.locale === 'es'
                  ? '¡Suscripción reenviada! Por favor revisa tu correo electrónico para confirmar.'
                  : 'Subscription resent! Please check your email to confirm.',
              data: {
                email: formData.email,
                status: 'pending',
              },
            },
            {
              status: 200,
              headers: {
                'X-RateLimit-Limit': rateLimitResult.limit.toString(),
                'X-RateLimit-Remaining': Math.max(
                  0,
                  rateLimitResult.limit - rateLimitResult.count
                ).toString(),
                'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
              },
            }
          );
        } catch (emailError) {
          console.error('❌ Failed to resend verification email:', emailError);
          // Don't fail the request - user can try subscribing again later
          return NextResponse.json(
            {
              success: false,
              error: 'Error al reenviar el correo / Error resending email',
              details:
                'No se pudo reenviar el correo de verificación. Por favor, inténtalo de nuevo más tarde. / Could not resend verification email. Please try again later.',
            },
            { status: 500 }
          );
        }
      }

      // If previously unsubscribed, allow re-subscription by creating new record
      if (existingSubscriber.status === 'unsubscribed') {
        // Will create new record below (UNIQUE constraint on email+status allows this)
      }
    }

    // Insert new subscription into database
    // Note: verification_token is auto-generated by database trigger
    const { data: subscriber, error: dbError } = await supabaseAnon
      .from('newsletter_subscribers')
      .insert({
        email: formData.email,
        locale: formData.locale,
        status: 'pending',
        ip_address: ip,
        user_agent: userAgent,
      })
      .select()
      .single();

    if (dbError || !subscriber) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        {
          success: false,
          error: 'Error al guardar la suscripción / Error saving subscription',
          details: 'Por favor, inténtalo de nuevo más tarde. / Please try again later.',
        },
        { status: 500 }
      );
    }

    // Send verification email
    try {
      // Get site URL from environment
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      const verificationUrl = `${siteUrl}/${formData.locale}/newsletter/verify?token=${subscriber.verification_token}`;

      console.log('📧 Sending verification email:', {
        email: formData.email,
        locale: formData.locale,
        verificationUrl,
      });

      // Select appropriate email template based on locale
      const VerificationTemplate =
        formData.locale === 'es' ? SpanishVerificationEmail : EnglishVerificationEmail;

      const verificationEmailHtml = await render(
        VerificationTemplate({ verificationUrl })
      );

      const verificationSubject =
        formData.locale === 'es'
          ? '📬 Confirma tu suscripción al boletín de Alkitu'
          : '📬 Confirm your subscription to the Alkitu newsletter';

      await resend.emails.send({
        from: RESEND_CONFIG.fromEmail,
        to: [formData.email],
        subject: verificationSubject,
        html: verificationEmailHtml,
      });

      console.log('✅ Verification email sent successfully:', formData.email);
    } catch (emailError) {
      // Log email error but don't fail the request
      // The subscription is already saved in database
      console.error('❌ Email sending failed:', emailError);
      console.error('Email error details:', {
        error: emailError instanceof Error ? emailError.message : 'Unknown error',
        email: formData.email,
        locale: formData.locale,
      });
    }

    // Success response with rate limit headers
    return NextResponse.json(
      {
        success: true,
        message:
          formData.locale === 'es'
            ? '¡Suscripción exitosa! Por favor revisa tu correo electrónico para confirmar.'
            : 'Subscription successful! Please check your email to confirm.',
        data: {
          email: formData.email,
          status: 'pending',
        },
      },
      {
        status: 201,
        headers: {
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': Math.max(
            0,
            rateLimitResult.limit - rateLimitResult.count
          ).toString(),
          'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
        },
      }
    );
  } catch (error) {
    console.error('Unexpected error in newsletter subscription:', error);
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

/**
 * OPTIONS handler for CORS preflight requests
 * Required for API routes that will be called from different origins
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*', // Adjust for production
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

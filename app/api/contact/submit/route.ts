import { NextRequest, NextResponse } from 'next/server';
import { createAnalyticsClient } from '@/lib/supabase/analytics';
import { createClient } from '@/lib/supabase/server';
import { contactFormSchema, type ContactFormData } from '@/lib/schemas/contact';
import { checkRateLimit } from '@/lib/utils/rate-limiter';
import { resend, RESEND_CONFIG, getEmailSettings, formatEmailArray } from '@/lib/resend';
import { render } from '@react-email/render';
import ContactNotification from '@/lib/email-templates/contact-notification';
import ContactConfirmationES from '@/lib/email-templates/contact-confirmation-es';
import ContactConfirmationEN from '@/lib/email-templates/contact-confirmation-en';

/**
 * POST /api/contact/submit
 *
 * Handles contact form submissions
 *
 * Features:
 * - Zod validation of form data
 * - Rate limiting (3 submissions per hour per IP)
 * - Captures user metadata (IP, user agent)
 * - Stores submission in Supabase
 * - Sends admin notification email via RESEND
 * - Sends bilingual user confirmation email (ES/EN)
 * - Configurable email recipients via database (to/cc/bcc)
 *
 * @param request - Next.js request object
 * @returns JSON response with submission status
 *
 * @example Success Response (201 Created):
 * ```json
 * {
 *   "success": true,
 *   "message": "Formulario enviado exitosamente",
 *   "data": {
 *     "id": "uuid",
 *     "status": "pending"
 *   }
 * }
 * ```
 *
 * @example Rate Limit Error (429 Too Many Requests):
 * ```json
 * {
 *   "success": false,
 *   "error": "Demasiadas solicitudes",
 *   "details": "Has alcanzado el límite de 3 envíos por hora. Inténtalo de nuevo en 45 minutos.",
 *   "retryAfter": 2700
 * }
 * ```
 *
 * @example Validation Error (400 Bad Request):
 * ```json
 * {
 *   "success": false,
 *   "error": "Datos inválidos",
 *   "details": {
 *     "name": ["El nombre debe tener al menos 2 caracteres"],
 *     "email": ["Formato de email inválido"]
 *   }
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

    // Rate limiting: 3 submissions per hour per IP
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
              ? `Has alcanzado el límite de ${rateLimitResult.limit} envíos por hora. Inténtalo de nuevo en ${resetInMinutes} minutos. / You have reached the limit of ${rateLimitResult.limit} submissions per hour. Try again in ${resetInMinutes} minutes.`
              : `Límite excedido. Has enviado ${rateLimitResult.count} formularios. Límite: ${rateLimitResult.limit} por hora. / Limit exceeded. You have submitted ${rateLimitResult.count} forms. Limit: ${rateLimitResult.limit} per hour.`,
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
    const validationResult = contactFormSchema.safeParse(body);

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

    const formData: ContactFormData = validationResult.data;

    // Create Supabase client for database operations (using analytics client for anon role)
    const supabaseAnon = createAnalyticsClient();

    // Get the referrer URL (where the form was submitted from)
    const formUrl = request.headers.get('referer') || request.headers.get('origin') || 'unknown';

    // Insert submission into database
    // Note: We don't use .select() after insert because anon role doesn't have SELECT permission
    // This is intentional for security - users don't need to read back their submission
    const { error: dbError } = await supabaseAnon
      .from('contact_submissions')
      .insert({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        locale: formData.locale,
        user_agent: userAgent,
        ip_address: ip,
        form_url: formUrl,
        status: 'pending',
      });

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        {
          success: false,
          error: 'Error al guardar el formulario / Error saving form',
          details: 'Por favor, inténtalo de nuevo más tarde. / Please try again later.',
        },
        { status: 500 }
      );
    }

    // Send confirmation emails via RESEND
    try {
      // Create server client to read email_settings (requires authenticated access)
      const supabaseServer = await createClient();

      // Fetch email settings from database (or use fallback)
      const emailSettings = await getEmailSettings(supabaseServer);

      const fromEmail = emailSettings?.from_email || RESEND_CONFIG.fromEmail;
      const toEmails = emailSettings
        ? formatEmailArray(emailSettings.to_emails)
        : [RESEND_CONFIG.fromEmail];
      const ccEmails = emailSettings ? formatEmailArray(emailSettings.cc_emails) : [];
      const bccEmails = emailSettings ? formatEmailArray(emailSettings.bcc_emails) : [];

      console.log('📧 Email Settings:', {
        found: !!emailSettings,
        fromEmail,
        toEmails,
        ccEmails,
        bccEmails,
      });

      // 1. Send notification email to admin
      const adminEmailHtml = await render(
        ContactNotification({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          locale: formData.locale,
          submittedAt: new Date().toISOString(),
        })
      );

      await resend.emails.send({
        from: fromEmail,
        to: toEmails,
        cc: ccEmails.length > 0 ? ccEmails : undefined,
        bcc: bccEmails.length > 0 ? bccEmails : undefined,
        subject: `Nuevo mensaje de contacto: ${formData.subject}`,
        html: adminEmailHtml,
        replyTo: formData.email,
      });

      // 2. Send confirmation email to user (bilingual based on locale)
      const ConfirmationTemplate = formData.locale === 'es'
        ? ContactConfirmationES
        : ContactConfirmationEN;

      const userEmailHtml = await render(
        ConfirmationTemplate({ name: formData.name })
      );

      const confirmationSubject = formData.locale === 'es'
        ? '¡Gracias por contactarnos! - Alkitu'
        : 'Thank you for contacting us! - Alkitu';

      await resend.emails.send({
        from: fromEmail,
        to: [formData.email],
        subject: confirmationSubject,
        html: userEmailHtml,
      });

      console.log('✅ Emails sent successfully:', {
        admin: toEmails,
        user: formData.email,
      });
    } catch (emailError) {
      // Log email error but don't fail the request
      // The form submission is already saved in database
      console.error('❌ Email sending failed:', emailError);
      console.error('Email error details:', {
        error: emailError instanceof Error ? emailError.message : 'Unknown error',
        formData: {
          name: formData.name,
          email: formData.email,
          locale: formData.locale,
        },
      });
    }

    // Success response with rate limit headers
    return NextResponse.json(
      {
        success: true,
        message:
          formData.locale === 'es'
            ? 'Formulario enviado exitosamente. Te contactaremos pronto.'
            : 'Form submitted successfully. We will contact you soon.',
        data: {
          status: 'pending',
          submittedAt: new Date().toISOString(),
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
    console.error('Unexpected error in contact form submission:', error);
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

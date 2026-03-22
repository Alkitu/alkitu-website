import { NextRequest, NextResponse } from 'next/server';
import { createAnalyticsClient } from '@/lib/supabase/analytics';
import { createClient } from '@/lib/supabase/server';
import { contactFormSchema } from '@/lib/schemas/contact';
import { checkRateLimit } from '@/lib/utils/rate-limiter';
import { resend, RESEND_CONFIG, getEmailSettings, formatEmailArray } from '@/lib/resend';
import { render } from '@react-email/render';
import ContactNotification from '@/lib/email-templates/contact-notification';
import ContactConfirmationES from '@/lib/email-templates/contact-confirmation-es';
import ContactConfirmationEN from '@/lib/email-templates/contact-confirmation-en';

/**
 * POST /api/contact/submit
 *
 * Handles contact form submissions from the multi-step form.
 * Accepts FormData (multipart) — NOT JSON.
 *
 * Features:
 * - Parses FormData and validates with Zod
 * - Auto-generates subject from form fields
 * - Stores rich fields in form_data JSONB column
 * - Rate limiting (3 submissions per hour per IP)
 * - Sends admin notification email with project details
 * - Sends bilingual user confirmation email (ES/EN)
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

    // Parse FormData (frontend sends multipart/form-data, not JSON)
    const rawFormData = await request.formData();

    // Extract string fields into a plain object for Zod validation
    const formFields: Record<string, string> = {};
    for (const [key, value] of rawFormData.entries()) {
      if (typeof value === 'string') {
        formFields[key] = value;
      }
      // Files are silently ignored (no storage configured)
    }

    // Honeypot check — if filled, it's a bot. Return fake success.
    if (formFields.website) {
      return NextResponse.json(
        {
          success: true,
          message: 'Form submitted successfully.',
          data: { status: 'pending', submittedAt: new Date().toISOString() },
        },
        { status: 201 }
      );
    }

    // Validate with Zod
    const validationResult = contactFormSchema.safeParse(formFields);

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

    const formData = validationResult.data;

    // Parse JSON-stringified array fields from FormData
    let productCategories: string[] = [];
    let functionalities: string[] = [];
    try {
      productCategories = typeof formData.productCategories === 'string'
        ? JSON.parse(formData.productCategories)
        : Array.isArray(formData.productCategories) ? formData.productCategories : [];
    } catch (_) { /* leave empty */ }
    try {
      functionalities = typeof formData.functionalities === 'string'
        ? JSON.parse(formData.functionalities)
        : Array.isArray(formData.functionalities) ? formData.functionalities : [];
    } catch (_) { /* leave empty */ }

    // Human-readable label maps for snake_case form values
    const companySizeLabels: Record<string, string> = {
      solo_founder: 'Solo Founder',
      small_startup: 'Small Startup',
      medium_company: 'Medium Company',
      enterprise: 'Enterprise',
    };

    const budgetLabels: Record<string, string> = {
      under_2k: formData.locale === 'es' ? '< 2.000 €' : '< $2,000',
      '2k_5k': formData.locale === 'es' ? '2.000 – 5.000 €' : '$2,000 – $5,000',
      '8k_12k': formData.locale === 'es' ? '8.000 – 12.000 €' : '$8,000 – $12,000',
      '12k_15k': formData.locale === 'es' ? '12.000 – 15.000 €' : '$12,000 – $15,000',
      '15k_20k': formData.locale === 'es' ? '15.000 – 20.000 €' : '$15,000 – $20,000',
      over_20k: formData.locale === 'es' ? '+20.000 €' : '+$20,000',
    };

    const categoryLabels: Record<string, string> = {
      saas: 'SaaS',
      on_demand: 'On-demand',
      project_management: 'Project Management',
      ecommerce: 'E-commerce',
      marketplace: 'Marketplace',
      social_media: 'Social Media',
      internal_tool: 'Internal Tool',
      crm: 'CRM',
      job_board: 'Job Board',
      productivity: 'Productivity',
      marketing_site: 'Marketing Site',
      data_management: 'Data Management',
      hospitality_gastronomy: formData.locale === 'es' ? 'Hostelería y Gastronomía' : 'Hospitality & Gastronomy',
      other: formData.locale === 'es' ? 'Otro' : 'Other',
    };

    const functionalityLabels: Record<string, string> = {
      payments: formData.locale === 'es' ? 'Pagos' : 'Payments',
      memberships: formData.locale === 'es' ? 'Membresías' : 'Memberships',
      email_delivery: 'Email Delivery',
      google_maps: 'Google Maps',
      video: 'Video',
      social_logins: 'Social Logins',
      audio: 'Audio',
      internal_analytics: formData.locale === 'es' ? 'Analítica interna' : 'Internal Analytics',
      dashboard: 'Dashboard',
      other: formData.locale === 'es' ? 'Otro' : 'Other',
    };

    const toLabel = (value: string, map: Record<string, string>) => map[value] || value;

    const readableCompanySize = formData.companySize ? toLabel(formData.companySize, companySizeLabels) : '';
    const readableBudget = formData.budget ? toLabel(formData.budget, budgetLabels) : '';
    const readableCategories = productCategories.map((c) => toLabel(c, categoryLabels));
    const readableFunctionalities = functionalities.map((f) => toLabel(f, functionalityLabels));

    // Auto-generate subject
    const subject = `Solicitud Alkitu: ${formData.name}${formData.projectType ? `, ${formData.projectType}` : ''}`;

    // Build form_data JSONB object with all rich fields (store raw values)
    const formDataJsonb = {
      projectType: formData.projectType || null,
      companySize: formData.companySize || null,
      budget: formData.budget || null,
      productCategories,
      functionalities,
    };

    // Create Supabase client for database operations (using analytics client for anon role)
    const supabaseAnon = createAnalyticsClient();

    // Get the referrer URL (where the form was submitted from)
    const formUrl = request.headers.get('referer') || request.headers.get('origin') || 'unknown';

    // Insert submission into database
    const { error: dbError } = await supabaseAnon
      .from('contact_submissions')
      .insert({
        name: formData.name,
        email: formData.email,
        subject,
        message: formData.message,
        locale: formData.locale,
        user_agent: userAgent,
        ip_address: ip,
        form_url: formUrl,
        form_data: formDataJsonb,
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

      // Query session data for visitor info in the email
      let sessionInfo: {
        country?: string;
        city?: string;
        region?: string;
        ipAddress?: string;
        userAgent?: string;
        pageCount?: number;
        pages?: { path: string; entryTime: string; durationSec?: number }[];
        sessionStart?: string;
        sessionDuration?: number;
      } = { ipAddress: ip, userAgent };

      try {
        // Find the most recent session matching this IP
        const { data: sessionData } = await supabaseAnon
          .from('sessions')
          .select('id, country, city, region, created_at, updated_at')
          .eq('ip_address', ip)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (sessionData) {
          sessionInfo.country = sessionData.country || undefined;
          sessionInfo.city = sessionData.city || undefined;
          sessionInfo.region = sessionData.region || undefined;
          sessionInfo.sessionStart = sessionData.created_at;

          // Fetch page views with URLs, times, and duration for this session
          const { data: pageViews } = await supabaseAnon
            .from('page_views')
            .select('page_url, entry_time, duration')
            .eq('session_id', sessionData.id)
            .order('entry_time', { ascending: true });

          if (pageViews && pageViews.length > 0) {
            sessionInfo.pageCount = pageViews.length;
            sessionInfo.pages = pageViews.map((pv) => {
              let path = pv.page_url;
              try { path = new URL(pv.page_url).pathname; } catch (_) {}
              return {
                path,
                entryTime: pv.entry_time,
                durationSec: pv.duration ?? undefined,
              };
            });
          }

          // Calculate total duration from session timestamps
          if (sessionData.created_at && sessionData.updated_at) {
            const start = new Date(sessionData.created_at).getTime();
            const end = new Date(sessionData.updated_at).getTime();
            const durationSec = Math.round((end - start) / 1000);
            if (durationSec > 0) {
              sessionInfo.sessionDuration = durationSec;
            }
          }
        }
      } catch (_) { /* session lookup is best-effort */ }

      // 1. Send notification email to admin (with project details + session info)
      const adminEmailHtml = await render(
        ContactNotification({
          name: formData.name,
          email: formData.email,
          subject,
          message: formData.message,
          locale: formData.locale,
          submittedAt: new Date().toISOString(),
          projectType: formData.projectType,
          companySize: readableCompanySize,
          budget: readableBudget,
          productCategories: readableCategories,
          functionalities: readableFunctionalities,
          formUrl,
          session: sessionInfo,
        })
      );

      await resend.emails.send({
        from: fromEmail,
        to: toEmails,
        cc: ccEmails.length > 0 ? ccEmails : undefined,
        bcc: bccEmails.length > 0 ? bccEmails : undefined,
        subject,
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

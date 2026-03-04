import { resend, RESEND_CONFIG } from '@/lib/resend';
import type { BillingInvoice, BillingSettings } from '@/lib/types/billing';

interface SendInvoiceEmailOptions {
  invoice: BillingInvoice;
  settings: BillingSettings;
  pdfBuffer: Buffer;
  recipientEmail: string;
}

/**
 * Sends an invoice email with the PDF attached via Resend.
 */
export async function sendInvoiceEmail({
  invoice,
  settings,
  pdfBuffer,
  recipientEmail,
}: SendInvoiceEmailOptions): Promise<{ success: boolean; error?: string }> {
  const invoiceNumber = `${invoice.series}-${String(invoice.number).padStart(4, '0')}`;
  const fromEmail = settings.email
    ? `${settings.company_name} <${settings.email}>`
    : `${settings.company_name} <${RESEND_CONFIG.fromEmail}>`;

  const subject = `Factura ${invoiceNumber} — ${settings.company_name}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #111;">Factura ${invoiceNumber}</h2>
      <p>Estimado/a <strong>${invoice.client_name}</strong>,</p>
      <p>Adjuntamos la factura <strong>${invoiceNumber}</strong> por un importe total de
        <strong>${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(invoice.total)}</strong>.
      </p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Fecha de emisión</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">
            ${new Date(invoice.issue_date).toLocaleDateString('es-ES')}
          </td>
        </tr>
        ${invoice.due_date ? `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Fecha de vencimiento</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">
            ${new Date(invoice.due_date).toLocaleDateString('es-ES')}
          </td>
        </tr>` : ''}
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Base imponible</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">
            ${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(invoice.subtotal)}
          </td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Impuestos</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">
            ${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(invoice.tax_amount)}
          </td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold;">TOTAL</td>
          <td style="padding: 8px; font-weight: bold; font-size: 18px;">
            ${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(invoice.total)}
          </td>
        </tr>
      </table>
      ${settings.bank_iban ? `
      <p style="background: #f9fafb; padding: 12px; border-radius: 6px; font-size: 14px;">
        <strong>Datos bancarios para la transferencia:</strong><br/>
        IBAN: ${settings.bank_iban}
        ${settings.bank_swift ? `<br/>SWIFT: ${settings.bank_swift}` : ''}
      </p>` : ''}
      <p style="color: #666; font-size: 13px; margin-top: 24px;">
        ${settings.invoice_footer_es || `${settings.company_name} — NIF: ${settings.nif}`}
      </p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: fromEmail,
      to: recipientEmail,
      subject,
      html,
      attachments: [
        {
          filename: `factura-${invoiceNumber}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send invoice email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown email error',
    };
  }
}

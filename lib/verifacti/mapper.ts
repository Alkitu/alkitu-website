/**
 * Verifacti Data Mapper
 *
 * Maps internal invoice data to Verifacti API request format.
 * Handles date formatting (DD-MM-YYYY), amount formatting (string with 2 decimals),
 * and line grouping by tax rate (max 12 lineas per invoice).
 */

import type { VerifactiCreateRequest, VerifactiLinea } from './types';
import type { BillingInvoice, BillingInvoiceLine, BillingClient, BillingSettings } from '@/lib/types/billing';

// =====================================================
// Formatters
// =====================================================

/** Format a Date to DD-MM-YYYY as required by Verifacti */
export function formatVerifactiDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

/** Format a number to string with exactly 2 decimal places */
export function formatVerifactiAmount(amount: number): string {
  return amount.toFixed(2);
}

// =====================================================
// Line Grouping
// =====================================================

/**
 * Group invoice lines by tax_rate + tax_type, summing base_imponible
 * and cuota_repercutida per group. Verifacti allows max 12 lineas.
 */
export function mapInvoiceLinesToVerifactiLineas(
  lines: BillingInvoiceLine[]
): VerifactiLinea[] {
  const groups = new Map<string, { base: number; cuota: number; rate: number; type: string }>();

  for (const line of lines) {
    const key = `${line.tax_rate}_${line.tax_type}`;
    const existing = groups.get(key);

    if (existing) {
      existing.base += Number(line.line_total);
      existing.cuota += Number(line.tax_amount);
    } else {
      groups.set(key, {
        base: Number(line.line_total),
        cuota: Number(line.tax_amount),
        rate: Number(line.tax_rate),
        type: line.tax_type,
      });
    }
  }

  return Array.from(groups.values()).map((group) => ({
    base_imponible: formatVerifactiAmount(group.base),
    tipo_impositivo: formatVerifactiAmount(group.rate),
    cuota_repercutida: formatVerifactiAmount(group.cuota),
    tipo_impuesto: group.type === 'IVA' ? '01' : group.type === 'IGIC' ? '02' : '01',
    clave_regimen: '01',
    calificacion_operacion: 'S1',
  }));
}

// =====================================================
// Full Request Builder
// =====================================================

/**
 * Build the complete Verifacti create request from internal data.
 * fecha_expedicion is always set to today's date.
 */
export function buildVerifactiCreateRequest(
  invoice: BillingInvoice,
  lines: BillingInvoiceLine[],
  _client: BillingClient,
  _settings: BillingSettings
): VerifactiCreateRequest {
  const request: VerifactiCreateRequest = {
    serie: invoice.series,
    numero: String(invoice.number),
    fecha_expedicion: formatVerifactiDate(new Date()),
    nombre_razon_destinatario: invoice.client_name,
    nif_destinatario: invoice.client_nif,
    descripcion: invoice.description || `Factura ${invoice.series}-${invoice.number}`,
    desglose: {
      lineas: mapInvoiceLinesToVerifactiLineas(lines),
    },
    tipo_factura: invoice.invoice_type,
  };

  // Handle corrective invoices (R1-R5)
  if (
    invoice.invoice_type.startsWith('R') &&
    invoice.corrected_invoice_id &&
    invoice.correction_type
  ) {
    request.tipo_rectificativa = invoice.correction_type;
    // Note: factura_rectificada is set by the API route with the original invoice data
  }

  return request;
}

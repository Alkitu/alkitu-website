import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import { InvoicePDF } from './invoice-template';
import type { BillingInvoice, BillingInvoiceLine, BillingSettings } from '@/lib/types/billing';

/**
 * Generates a PDF buffer for a given invoice.
 *
 * @param invoice - The invoice record
 * @param lines  - Sorted line items
 * @param settings - Company billing settings
 * @returns Buffer containing the PDF bytes
 */
export async function generateInvoicePDF(
  invoice: BillingInvoice,
  lines: BillingInvoiceLine[],
  settings: BillingSettings
): Promise<Buffer> {
  const element = React.createElement(InvoicePDF, { invoice, lines, settings });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(element as any);
  return Buffer.from(buffer);
}

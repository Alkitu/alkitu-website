import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import type { BillingInvoice, BillingInvoiceLine, BillingSettings } from '@/lib/types/billing';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: '#333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  companyInfo: {
    maxWidth: '50%',
  },
  companyName: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  companyDetail: {
    fontSize: 8,
    color: '#666',
    marginBottom: 2,
  },
  invoiceTitle: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'right',
    marginBottom: 4,
  },
  invoiceNumber: {
    fontSize: 11,
    textAlign: 'right',
    marginBottom: 2,
  },
  invoiceMeta: {
    fontSize: 9,
    textAlign: 'right',
    color: '#666',
  },
  statusBadge: {
    fontSize: 8,
    textAlign: 'right',
    color: '#fff',
    backgroundColor: '#2563eb',
    padding: '2 8',
    borderRadius: 4,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 6,
    color: '#111',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 4,
  },
  clientRow: {
    fontSize: 9,
    marginBottom: 2,
  },
  table: {
    marginTop: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingVertical: 5,
    paddingHorizontal: 4,
  },
  colDesc: { width: '40%' },
  colQty: { width: '10%', textAlign: 'right' },
  colPrice: { width: '15%', textAlign: 'right' },
  colBase: { width: '15%', textAlign: 'right' },
  colTax: { width: '8%', textAlign: 'right' },
  colTaxAmt: { width: '12%', textAlign: 'right' },
  headerText: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#6b7280',
    textTransform: 'uppercase',
  },
  totals: {
    marginTop: 12,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    width: 220,
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  totalLabel: {
    fontSize: 9,
    color: '#666',
  },
  totalValue: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
  },
  grandTotal: {
    flexDirection: 'row',
    width: 220,
    justifyContent: 'space-between',
    borderTopWidth: 2,
    borderTopColor: '#111',
    paddingTop: 6,
    marginTop: 4,
  },
  grandTotalLabel: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
  },
  grandTotalValue: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
  },
  footerText: {
    fontSize: 7,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 2,
  },
  bankInfo: {
    fontSize: 8,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 8,
  },
  qrSection: {
    alignItems: 'flex-end',
    marginTop: 16,
  },
  qrLabel: {
    fontSize: 7,
    color: '#9ca3af',
    marginBottom: 4,
  },
});

interface InvoicePDFProps {
  invoice: BillingInvoice;
  lines: BillingInvoiceLine[];
  settings: BillingSettings;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(price);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-ES');
}

const statusLabels: Record<string, string> = {
  draft: 'BORRADOR',
  issued: 'EMITIDA',
  paid: 'PAGADA',
  voided: 'ANULADA',
};

export function InvoicePDF({ invoice, lines, settings }: InvoicePDFProps) {
  const sortedLines = [...lines].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            {settings.logo_url && (
              <Image src={settings.logo_url} style={{ width: 80, height: 40, marginBottom: 6 }} />
            )}
            <Text style={styles.companyName}>{settings.company_name}</Text>
            <Text style={styles.companyDetail}>NIF: {settings.nif}</Text>
            {settings.address_line1 && <Text style={styles.companyDetail}>{settings.address_line1}</Text>}
            {(settings.postal_code || settings.city) && (
              <Text style={styles.companyDetail}>
                {[settings.postal_code, settings.city, settings.province].filter(Boolean).join(', ')}
              </Text>
            )}
            {settings.email && <Text style={styles.companyDetail}>{settings.email}</Text>}
            {settings.phone && <Text style={styles.companyDetail}>{settings.phone}</Text>}
          </View>

          <View>
            <Text style={styles.invoiceTitle}>FACTURA</Text>
            <Text style={styles.invoiceNumber}>
              {invoice.series}-{String(invoice.number).padStart(4, '0')}
            </Text>
            <Text style={styles.invoiceMeta}>Fecha: {formatDate(invoice.issue_date)}</Text>
            {invoice.due_date && (
              <Text style={styles.invoiceMeta}>Vencimiento: {formatDate(invoice.due_date)}</Text>
            )}
            <Text style={styles.invoiceMeta}>Tipo: {invoice.invoice_type}</Text>
            <View style={[styles.statusBadge, invoice.status === 'paid' ? { backgroundColor: '#16a34a' } : invoice.status === 'voided' ? { backgroundColor: '#dc2626' } : {}]}>
              <Text style={{ color: '#fff', fontSize: 8 }}>{statusLabels[invoice.status] || invoice.status}</Text>
            </View>
          </View>
        </View>

        {/* Client */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DATOS DEL CLIENTE</Text>
          <Text style={styles.clientRow}>{invoice.client_name}</Text>
          <Text style={styles.clientRow}>NIF: {invoice.client_nif}</Text>
        </View>

        {/* Description */}
        {invoice.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CONCEPTO</Text>
            <Text style={styles.clientRow}>{invoice.description}</Text>
          </View>
        )}

        {/* Lines Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DETALLE</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.headerText, styles.colDesc]}>Descripcion</Text>
              <Text style={[styles.headerText, styles.colQty]}>Cant.</Text>
              <Text style={[styles.headerText, styles.colPrice]}>P. Unitario</Text>
              <Text style={[styles.headerText, styles.colBase]}>Base</Text>
              <Text style={[styles.headerText, styles.colTax]}>IVA %</Text>
              <Text style={[styles.headerText, styles.colTaxAmt]}>Impuesto</Text>
            </View>
            {sortedLines.map((line, idx) => (
              <View key={idx} style={styles.tableRow}>
                <Text style={styles.colDesc}>{line.description}</Text>
                <Text style={styles.colQty}>{line.quantity}</Text>
                <Text style={styles.colPrice}>{formatPrice(line.unit_price)}</Text>
                <Text style={styles.colBase}>{formatPrice(line.line_total)}</Text>
                <Text style={styles.colTax}>{line.tax_rate}%</Text>
                <Text style={styles.colTaxAmt}>{formatPrice(line.tax_amount)}</Text>
              </View>
            ))}
          </View>

          {/* Totals */}
          <View style={styles.totals}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Base imponible:</Text>
              <Text style={styles.totalValue}>{formatPrice(invoice.subtotal)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Impuestos:</Text>
              <Text style={styles.totalValue}>{formatPrice(invoice.tax_amount)}</Text>
            </View>
            <View style={styles.grandTotal}>
              <Text style={styles.grandTotalLabel}>TOTAL:</Text>
              <Text style={styles.grandTotalValue}>{formatPrice(invoice.total)}</Text>
            </View>
          </View>
        </View>

        {/* QR Code */}
        {invoice.verifacti_qr && (
          <View style={styles.qrSection}>
            <Text style={styles.qrLabel}>Codigo de verificacion VeriFactu</Text>
            <Image src={invoice.verifacti_qr} style={{ width: 80, height: 80 }} />
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          {(settings.bank_iban || settings.bank_swift) && (
            <Text style={styles.bankInfo}>
              {settings.bank_iban ? `IBAN: ${settings.bank_iban}` : ''}
              {settings.bank_iban && settings.bank_swift ? '  |  ' : ''}
              {settings.bank_swift ? `SWIFT: ${settings.bank_swift}` : ''}
            </Text>
          )}
          {settings.invoice_footer_es && (
            <Text style={styles.footerText}>{settings.invoice_footer_es}</Text>
          )}
        </View>
      </Page>
    </Document>
  );
}

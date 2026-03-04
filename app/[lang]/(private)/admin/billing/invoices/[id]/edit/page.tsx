import { InvoiceForm } from '@/app/components/admin/billing/InvoiceForm';

type PageProps = { params: Promise<{ id: string }> };

export default async function EditInvoicePage({ params }: PageProps) {
  const { id } = await params;
  return <InvoiceForm invoiceId={id} />;
}

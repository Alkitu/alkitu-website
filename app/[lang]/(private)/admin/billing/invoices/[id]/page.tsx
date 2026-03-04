import { InvoiceDetail } from '@/app/components/admin/billing/InvoiceDetail';

type PageProps = { params: Promise<{ id: string }> };

export default async function InvoiceDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <InvoiceDetail invoiceId={id} />;
}

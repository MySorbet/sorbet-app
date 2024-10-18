'use client';

import { useInvoice } from '@/hooks/invoices/useInvoice';

import { InvoicePublicView } from '../components/invoice-public-view';

export default function InvoicePage({ params }: { params: { id: string } }) {
  const { data, isLoading } = useInvoice(params.id);

  return <InvoicePublicView invoice={data} isLoading={isLoading} />;
}

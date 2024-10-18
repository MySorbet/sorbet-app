'use client';

import { InvoicePublicView } from '../components/invoice-public-view';
import { useInvoice } from '../hooks/useInvoice';

export default function InvoicePage({ params }: { params: { id: string } }) {
  const { data, isLoading } = useInvoice(params.id);

  return <InvoicePublicView invoice={data} isLoading={isLoading} />;
}

'use client';

import { useAuth } from '@/hooks';

import { InvoicePublicView } from '../components/invoice-public-view';
import { useInvoice } from '../hooks/use-invoice';

export default function InvoicePage({ params }: { params: { id: string } }) {
  const { data, isLoading } = useInvoice(params.id);
  const { user } = useAuth();
  const isFreelancer = user?.id === data?.userId;

  return (
    <InvoicePublicView
      invoice={data}
      isLoading={isLoading}
      isFreelancer={isFreelancer}
    />
  );
}

'use client';

import { useAuth } from '@/hooks';

import { PublicInvoice } from '../components/public-invoice/public-invoice';
import { PublishedInvoice } from '../components/published-invoice/published-invoice';
import { useInvoice } from '../hooks/use-invoice';

export default function InvoicePage({ params }: { params: { id: string } }) {
  const { data, isLoading, isError } = useInvoice(params.id);
  const { user } = useAuth();
  const isFreelancer = user?.id === data?.userId;

  // Let the public invoice page handle rendering the error
  return isError || !isFreelancer ? (
    <PublicInvoice invoice={data} isLoading={isLoading} isError={isError} />
  ) : (
    <PublishedInvoice invoice={data} isLoading={isLoading} />
  );
}

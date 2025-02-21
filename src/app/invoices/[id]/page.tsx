'use client';

import { useAuth } from '@/hooks';

import { useInvoice } from '../hooks/use-invoice';
import { PublicInvoice } from '../v2/public-invoice/public-invoice';
import { PublishedInvoice } from '../v2/published-invoice';

export default function InvoicePage({ params }: { params: { id: string } }) {
  const { data, isLoading, isError } = useInvoice(params.id);
  const { user } = useAuth();
  const isFreelancer = user?.id === data?.userId;

  return isFreelancer ? (
    <PublishedInvoice
      invoice={data}
      // isLoading={isLoading}
      // isError={isError}
    />
  ) : (
    <PublicInvoice
      invoice={data}
      // isLoading={isLoading}
      // isError={isError}
    />
  );
}

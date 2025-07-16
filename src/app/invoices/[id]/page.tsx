'use client';

import { isAxiosError } from 'axios';

import { useAuth } from '@/hooks';

import { PublicInvoice } from '../components/public-invoice/public-invoice';
import { PublishedInvoice } from '../components/published-invoice/published-invoice';
import { useInvoice } from '../hooks/use-invoice';

export default function InvoicePage({ params }: { params: { id: string } }) {
  const { data, isLoading, isError } = useInvoice(params.id, {
    retry: (_, error) => !(isAxiosError(error) && error.status === 404),
  });
  const { user } = useAuth();
  const isFreelancer = user?.id === data?.userId;

  // Let the public invoice page handle rendering the error
  return (
    <div className='flex size-full flex-col items-center justify-center'>
      {isError || !isFreelancer ? (
        <PublicInvoice invoice={data} isLoading={isLoading} isError={isError} />
      ) : (
        <PublishedInvoice invoice={data} isLoading={isLoading} />
      )}
    </div>
  );
}

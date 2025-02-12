'use client';

import { useRouter } from 'next/navigation';

import { CreateInvoicePageHeader } from '@/app/invoices/components/create/create-invoice-page-header';

import { Authenticated } from '../../authenticated';
import { InvoiceFormProvider } from '../components/create/invoice-form-context';

// TODO: each route should prefetch the next one

export default function CreateInvoiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <Authenticated>
      <main className='flex size-full flex-col'>
        <CreateInvoicePageHeader onClose={() => router.push('/invoices')} />
        <InvoiceFormProvider>{children}</InvoiceFormProvider>
      </main>
    </Authenticated>
  );
}

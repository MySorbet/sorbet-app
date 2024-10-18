'use client';

import { useRouter } from 'next/navigation';

import { Header } from '@/components/header';
import { useInvoices } from '@/hooks/invoices/useInvoices';

import { InvoiceDashboard } from './components/dashboard/invoice-dashboard';

export default function InvoicesPage() {
  const { data, isLoading } = useInvoices();
  const router = useRouter();
  return (
    <main className='flex size-full flex-col'>
      <Header />
      <div className='container flex flex-1 items-center justify-center'>
        <InvoiceDashboard
          invoices={data ?? []}
          isLoading={isLoading}
          onCreateNew={() => {
            router.push('/invoices/create');
          }}
        />
      </div>
    </main>
  );
}

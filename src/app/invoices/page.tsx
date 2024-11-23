'use client';

import { useRouter } from 'next/navigation';

import { Header } from '@/components/header';

import { InvoiceDashboard } from './components/dashboard/invoice-dashboard';
import { useInvoices } from './hooks/use-invoices';

export default function InvoicesPage() {
  const { data: invoices, isLoading } = useInvoices();
  const router = useRouter();
  const handleCreateNew = () => {
    router.push('/invoices/create');
  };
  return (
    <main className='flex size-full flex-col'>
      <Header />
      <div className='container flex flex-1 justify-center pt-14'>
        <InvoiceDashboard
          invoices={invoices ?? []}
          isLoading={isLoading}
          onCreateNew={handleCreateNew}
        />
      </div>
    </main>
  );
}

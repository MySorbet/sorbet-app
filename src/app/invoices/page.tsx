'use client';

import { useRouter } from 'next/navigation';

import { useUnlessMobile } from '@/components/common/open-on-desktop-drawer/unless-mobile';
import { Header } from '@/components/header';

import { Authenticated } from '../authenticated';
import { InvoiceDashboard } from './components/dashboard/invoice-dashboard';
import { InvoiceDashboardHeader } from './components/dashboard/invoice-dashboard-header';
import { useInvoices } from './hooks/use-invoices';

export default function InvoicesPage() {
  const { data: invoices, isLoading } = useInvoices();
  const router = useRouter();

  const unlessMobile = useUnlessMobile();

  const handleCreateNew = () => {
    unlessMobile(() => router.push('/invoices/create'));
  };

  return (
    <Authenticated>
      <main className='flex w-full flex-col'>
        <Header />
        <InvoiceDashboardHeader onCreateNew={handleCreateNew} />
        <div className='container flex flex-1 justify-center p-6'>
          <InvoiceDashboard
            invoices={invoices ?? []}
            isLoading={isLoading}
            onCreateNew={handleCreateNew}
          />
        </div>
      </main>
    </Authenticated>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { OpenOnDesktopDrawer } from '@/components/common/open-on-desktop-drawer';
import { Header } from '@/components/header';
import { useIsMobile } from '@/hooks/use-is-mobile';

import { Authenticated } from '../authenticated';
import { InvoiceDashboard } from './components/dashboard/invoice-dashboard';
import { InvoiceDashboardHeader } from './components/invoice-dashboard-header';
import { useInvoices } from './hooks/use-invoices';

export default function InvoicesPage() {
  const { data: invoices, isLoading } = useInvoices();
  const [isDesktopDrawerOpen, setIsDesktopDrawerOpen] = useState(false);
  const isMobile = useIsMobile();
  const router = useRouter();

  const handleCreateNew = () => {
    if (isMobile) {
      setIsDesktopDrawerOpen(true);
    } else {
      router.push('/invoices/create');
    }
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
          <OpenOnDesktopDrawer
            open={isDesktopDrawerOpen}
            onClose={() => setIsDesktopDrawerOpen(false)}
          />
        </div>
      </main>
    </Authenticated>
  );
}

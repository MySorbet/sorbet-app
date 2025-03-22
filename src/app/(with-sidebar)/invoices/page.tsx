'use client';

import { useRouter } from 'next/navigation';

import { useUnlessMobile } from '@/components/common/open-on-desktop-drawer/unless-mobile';
import Page from '@/components/common/page';
import { Header } from '@/components/header';

import { Authenticated } from '../../authenticated';
import { InvoiceDashboard } from '../../invoices/components/dashboard/invoice-dashboard';
import { InvoiceDashboardHeader } from '../../invoices/components/dashboard/invoice-dashboard-header';
import { useInvoices } from '../../invoices/hooks/use-invoices';

export default function InvoicesPage() {
  const { data: invoices, isLoading } = useInvoices();
  const router = useRouter();

  const unlessMobile = useUnlessMobile();

  const handleCreateNew = () => {
    unlessMobile(() => router.push('/invoices/create'));
  };

  return (
    <Authenticated>
      <Page.Main>
        <Header />
        <InvoiceDashboardHeader onCreateNew={handleCreateNew} />
        <Page.Content>
          <InvoiceDashboard
            invoices={invoices ?? []}
            isLoading={isLoading}
            onCreateNew={handleCreateNew}
          />
        </Page.Content>
      </Page.Main>
    </Authenticated>
  );
}

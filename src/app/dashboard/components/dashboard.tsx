'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useSmartWalletAddress, useWalletBalances } from '@/hooks';
import { useAuth } from '@/hooks/use-auth';
import { useIsMobile } from '@/hooks/use-is-mobile';

import { useDashboardData } from '../hooks/use-dashboard-data';
import { type TaskType, ChecklistCard } from './checklist-card';
import { OpenOnDesktopDrawer } from './open-on-desktop-drawer';
import { type StatsCardType, StatsCard } from './stats-card';
import { WelcomeCard } from './welcome-card';

export const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const router = useRouter();
  const handleCardClicked = (type: StatsCardType | TaskType) => {
    if (isMobile) {
      setOpen(true);
    } else {
      switch (type) {
        // Stats cards
        case 'wallet':
          router.push('/wallet');
          break;
        case 'sales':
          router.push('/invoices');
          break;
        case 'views':
          router.push(`/${user?.handle}`);
          break;

        // Tasks
        case 'verified':
          // TODO Open sidebar (QP?)
          break;
        case 'invoice':
          router.push('/invoices/create');
          break;
        case 'profile':
          // TODO: Open profile edit modal instead
          router.push(`/${user?.handle}`);
          break;
        case 'widget':
          router.push(`/${user?.handle}?drawerOpen=true`);
          break;
        case 'share':
          // TODO: Could we open the share modal with QP
          router.push(`/${user?.handle}`);
          break;
        case 'payment':
          router.push('/wallet');
          break;
      }
    }
  };

  // TODO should this go here or 1 level up?
  const { data } = useDashboardData();
  const { user } = useAuth();

  // TODO: Think about who should format the balance
  const { smartWalletAddress: walletAddress } = useSmartWalletAddress();
  const { usdcBalance, loading: isBalanceLoading } =
    useWalletBalances(walletAddress);

  return (
    <>
      {/* Conditionally rendered drawer for mobile clicks */}
      <OpenOnDesktopDrawer open={open} onClose={() => setOpen(false)} />

      {/* Fluid dashboard layout */}
      <div className='@container @lg:grid-cols-[minmax(0,1fr),300px] grid h-fit w-full max-w-5xl grid-cols-1 gap-4'>
        <WelcomeCard
          name={user?.firstName}
          className='@lg:col-span-2'
          onClickLinkInBio={() => router.push(`/${user?.handle}`)}
          onCreateInvoice={() => router.push('/invoices/create')}
        />

        <ChecklistCard
          className='h-full min-w-64'
          onTaskClick={handleCardClicked}
          completedTasks={data?.tasks}
        />

        <div className='flex h-full min-w-[240px] flex-col justify-between gap-4'>
          <StatsCard
            title='Wallet balance'
            type='wallet'
            value={isBalanceLoading ? undefined : Number(usdcBalance)}
            description='Total'
            onClick={() => handleCardClicked('wallet')}
          />
          <StatsCard
            title='Invoice Sales'
            type='sales'
            value={data?.invoiceSales}
            description='Total income'
            onClick={() => handleCardClicked('sales')}
          />
          <StatsCard
            title='Profile Views'
            type='views'
            value={data?.profileViews}
            description='Unique visitors'
            onClick={() => handleCardClicked('views')}
          />
        </div>
      </div>
    </>
  );
};

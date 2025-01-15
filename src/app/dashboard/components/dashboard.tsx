'use client';

import { useRouter } from 'next/navigation';
import { parseAsBoolean, useQueryState } from 'nuqs';
import { useState } from 'react';

import { ProfileEditModal } from '@/components/profile/profile-edit-modal';
import { useSmartWalletAddress, useWalletBalances } from '@/hooks';
import { useHasShared } from '@/hooks/profile/use-has-shared';
import { useAuth } from '@/hooks/use-auth';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { useScopedLocalStorage } from '@/hooks/use-scoped-local-storage';
import { User } from '@/types';

import { useDashboardData } from '../hooks/use-dashboard-data';
import {
  type TaskType,
  ChecklistCard,
  checkTasksComplete,
  TaskStatuses,
} from './checklist-card';
import { OpenOnDesktopDrawer } from './open-on-desktop-drawer';
import { type StatsCardType, StatsCard } from './stats-card';
import { TransactionCard } from './transaction-card';
import { WelcomeCard } from './welcome-card';

/**
 * Composes dashboard cards into a fluid layout
 * Also manages state, click actions, and routing actions
 * TODO: What if this component stayed server side and just managed layout. And the former responsibilities were hoisted?
 */
export const Dashboard = () => {
  const [isDesktopDrawerOpen, setIsDesktopDrawerOpen] = useState(false);
  const isMobile = useIsMobile();
  const router = useRouter();
  const { data, isLoading: isDashboardLoading } = useDashboardData();
  const { user } = useAuth();
  const [hasShared] = useHasShared();
  const [isTasksClosed, setIsTasksClosed] = useScopedLocalStorage(
    'is-tasks-closed',
    false
  );

  const completedTasks: TaskStatuses | undefined = data
    ? { ...data.tasks, share: hasShared, verified: true } // TODO: Remove hardcoded verified
    : undefined;

  // TODO: Think about who should format the balance
  const { smartWalletAddress: walletAddress } = useSmartWalletAddress();
  const { usdcBalance, loading: isBalanceLoading } =
    useWalletBalances(walletAddress);

  const [isProfileEditModalOpen, setIsProfileEditModalOpen] = useState(false);

  // Just need the setter to open the sidebar
  const [, setIsSidebarOpen] = useQueryState(
    'sidebarOpen',
    parseAsBoolean.withDefault(false)
  );

  const handleCardClicked = (type: StatsCardType | TaskType) => {
    if (isMobile) {
      setIsDesktopDrawerOpen(true);
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
          setIsSidebarOpen(true);
          break;
        case 'invoice':
          router.push('/invoices/create');
          break;
        case 'profile':
          setIsProfileEditModalOpen(true);
          break;
        case 'widget':
          router.push(`/${user?.handle}?drawerOpen=true`);
          break;
        case 'share':
          router.push(`/${user?.handle}?shareDialogOpen=true`);
          break;
        case 'payment':
          router.push('/wallet');
          break;
      }
    }
  };

  const handleCreateInvoice = () => {
    if (isMobile) {
      setIsDesktopDrawerOpen(true);
    } else {
      router.push('/invoices/create');
    }
  };

  const handleClickMyProfile = () => {
    if (isMobile) {
      setIsDesktopDrawerOpen(true);
    } else {
      router.push(`/${user?.handle}`);
    }
  };

  const isTasksComplete = completedTasks && checkTasksComplete(completedTasks);

  return (
    <>
      {/* Conditionally rendered drawer for mobile clicks */}
      <OpenOnDesktopDrawer
        open={isDesktopDrawerOpen}
        onClose={() => setIsDesktopDrawerOpen(false)}
      />

      {/* Conditionally rendered profile edit modal */}
      {user && (
        <ProfileEditModal
          editModalVisible={isProfileEditModalOpen}
          handleModalVisible={setIsProfileEditModalOpen}
          user={user as User} // TODO: Fix User typing to remove cast
        />
      )}

      {/* Fluid dashboard layout */}
      <div className='@container @lg:grid-cols-[minmax(0,1fr),300px] grid h-fit w-full max-w-5xl grid-cols-1 gap-4'>
        <WelcomeCard
          name={user?.firstName}
          className='@lg:col-span-2'
          onClickMyProfile={handleClickMyProfile}
          onCreateInvoice={handleCreateInvoice}
        />

        {/* TODO: Does this let the transaction card grow as long as it is supposed to? */}
        <div className='flex flex-col gap-4'>
          {!isTasksClosed && (
            <ChecklistCard
              className='min-w-64'
              onTaskClick={handleCardClicked}
              completedTasks={completedTasks}
              loading={isDashboardLoading}
              onClose={() => setIsTasksClosed(true)}
            />
          )}
          {/* TODO: Better loading state. Currently this is hidden while we wait for task response */}
          {isTasksComplete && <TransactionCard />}
        </div>

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

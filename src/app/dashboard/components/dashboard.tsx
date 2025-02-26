'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { OpenOnDesktopDrawer } from '@/components/common/open-on-desktop-drawer';
import { ProfileEditModal } from '@/components/profile/profile-edit-modal';
import { useHasShared } from '@/hooks/profile/use-has-shared';
import { useAuth } from '@/hooks/use-auth';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { useScopedLocalStorage } from '@/hooks/use-scoped-local-storage';
import { useWalletBalance } from '@/hooks/web3/use-wallet-balance';
import { User } from '@/types';

import { useDashboardData } from '../hooks/use-dashboard-data';
import {
  type TaskType,
  ChecklistCard,
  checkTasksComplete,
  TaskStatuses,
} from './checklist-card';
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

  // Completed tasks are stored in the DB, save for sharing which is stored in local storage
  const completedTasks: TaskStatuses | undefined = useMemo(
    () => (data ? { ...data.tasks, share: hasShared } : undefined),
    [data, hasShared]
  );

  const { data: usdcBalance, isPending: isBalanceLoading } = useWalletBalance();

  const [isProfileEditModalOpen, setIsProfileEditModalOpen] = useState(false);

  const unlessMobile = (fn: () => void) => {
    if (isMobile) {
      setIsDesktopDrawerOpen(true);
    } else {
      fn();
    }
  };

  const handleCardClicked = (type: StatsCardType | TaskType) => {
    switch (type) {
      // Stats cards
      case 'wallet':
        router.push('/wallet');
        break;
      case 'sales':
        router.push('/invoices');
        break;
      case 'views':
        unlessMobile(() => router.push(`/${user?.handle}`));
        break;

      // Tasks
      case 'verified':
        unlessMobile(() => router.push('/verify'));
        break;
      case 'invoice':
        unlessMobile(() => router.push('/invoices/create'));
        break;
      case 'profile':
        unlessMobile(() => setIsProfileEditModalOpen(true));
        break;
      case 'widget':
        unlessMobile(() => router.push(`/${user?.handle}?drawerOpen=true`));
        break;
      case 'share':
        unlessMobile(() =>
          router.push(`/${user?.handle}?shareDialogOpen=true`)
        );
        break;
      case 'payment':
        router.push('/wallet');
        break;
    }
  };

  const handleCreateInvoice = () => {
    unlessMobile(() => router.push('/invoices/create'));
  };

  const handleClickMyProfile = () => {
    unlessMobile(() => router.push(`/${user?.handle}`));
  };

  const isTasksComplete = completedTasks && checkTasksComplete(completedTasks);

  // Effect that resets the users closing of the tasks card if a task becomes incomplete
  useEffect(() => {
    if (completedTasks && !isTasksComplete) {
      setIsTasksClosed(false);
    }
  }, [completedTasks, isTasksComplete, setIsTasksClosed]);

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
          {isTasksComplete && <TransactionCard />}
        </div>

        <div className='flex h-full min-w-[240px] flex-col justify-start gap-4'>
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

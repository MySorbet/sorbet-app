'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { EditProfileSheet } from '@/app/[handle]/components/edit-profile-sheet/edit-profile-sheet';
import { useUnlessMobile } from '@/components/common/open-on-desktop-drawer/unless-mobile';
import { useHasShared } from '@/hooks/profile/use-has-shared';
import { useAuth } from '@/hooks/use-auth';
import { useScopedLocalStorage } from '@/hooks/use-scoped-local-storage';
import { useWalletBalance } from '@/hooks/web3/use-wallet-balance';

import { useDashboardData } from '../hooks/use-dashboard-data';
import {
  type TaskType,
  ChecklistCard,
  checkTasksComplete,
  type TaskStatuses,
} from './checklist-card';
import { type StatsCardType, StatsCard } from './stats-card';
import { TransactionCard } from './transaction-card';
import { WelcomeCard } from './welcome-card';

/**
 * Route builders (centralized so we don't sprinkle stringly URLs)
 */
const routes = {
  wallet: () => '/wallet' as const,
  sales: () => '/invoices' as const,
  views: (handle: string) => `/${handle}` as const,
  verify: () => '/verify' as const,
  createInvoice: () => '/invoices/create' as const,
  profile: (handle: string) => `/${handle}` as const,
  share: (handle: string) => {
    const qs = new URLSearchParams({ shareDialogOpen: 'true' });
    return `/${handle}?${qs.toString()}` as const;
  },
};

export const Dashboard = () => {
  const router = useRouter();
  const { data, isLoading: isDashboardLoading } = useDashboardData();
  const { user } = useAuth();
  const [hasShared] = useHasShared();
  const [isTasksClosed, setIsTasksClosed] = useScopedLocalStorage('is-tasks-closed', false);

  // Completed tasks are stored in the DB, except 'share' which is client-side
  const completedTasks: TaskStatuses | undefined = useMemo(
    () => (data ? { ...data.tasks, share: hasShared } : undefined),
    [data, hasShared]
  );

  const { data: usdcBalance, isPending: isBalanceLoading } = useWalletBalance();

  // Local state for profile editing (could be replaced with a route/modal interception)
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);

  const unlessMobile = useUnlessMobile();

  // Keep 'tasks' card open if any task becomes incomplete
  const isTasksComplete = completedTasks && checkTasksComplete(completedTasks);
  useEffect(() => {
    if (completedTasks && !isTasksComplete) setIsTasksClosed(false);
  }, [completedTasks, isTasksComplete, setIsTasksClosed]);

  /**
   * Actions
   */
  const handleTaskClick = (type: TaskType) => {
    // Guard: don't navigate to user routes without a handle
    const handle = user?.handle;

    switch (type) {
      // Tasks
      case 'verified':
        router.push(routes.verify());
        break;
      case 'invoice':
        unlessMobile(() => router.push(routes.createInvoice()));
        break;
      case 'profile':
        // TIP: move this to route-based modal later (e.g. /[handle]/(modals)/edit)
        setIsProfileEditOpen(true);
        break;
      case 'widget':
        if (handle) router.push(routes.profile(handle));
        break;
      case 'share':
        if (handle) router.push(routes.share(handle));
        break;
      case 'payment':
        router.push(routes.wallet());
        break;
    }
  };

  const handleCreateInvoice = () => {
    unlessMobile(() => router.push(routes.createInvoice()));
  };

  const handleClickMyProfile = () => {
    const handle = user?.handle;
    if (handle) router.push(routes.profile(handle));
  };

  if (!user) return null;

  return (
    <>
      {/* Conditionally rendered profile edit modal (consider moving to an intercepted route) */}
      <EditProfileSheet
        open={isProfileEditOpen}
        setOpen={setIsProfileEditOpen}
        user={user}
      />

      {/* Fluid dashboard layout */}
      <div className='@container @lg:grid-cols-[minmax(0,1fr),300px] grid h-fit w-full max-w-5xl grid-cols-1 gap-4'>
        <WelcomeCard
          name={user.firstName}
          className='@lg:col-span-2'
          onClickMyProfile={handleClickMyProfile}
          onCreateInvoice={handleCreateInvoice}
        />

        <div className='flex flex-col gap-4'>
          {!isTasksClosed && (
            <ChecklistCard
              className='min-w-64'
              onTaskClick={handleTaskClick}
              completedTasks={completedTasks}
              loading={isDashboardLoading}
              onClose={() => setIsTasksClosed(true)}
            />
          )}
          {isTasksComplete && <TransactionCard />}
        </div>

        <div className='flex h-full min-w-[240px] flex-col justify-start gap-4'>
          {/* Wrap StatsCard with Link for native navigation + prefetch */}
          <Link href={routes.wallet()} className='contents'>
            <StatsCard
              title='Wallet balance'
              type='wallet'
              value={isBalanceLoading ? undefined : Number(usdcBalance)}
              description='Total'
              // onClick not needed; Link handles navigation
            />
          </Link>

          <Link href={routes.sales()} className='contents' prefetch>
            <StatsCard
              title='Invoice Sales'
              type='sales'
              value={data?.invoiceSales}
              description='Total income'
            />
          </Link>

          <Link
            href={routes.views(user.handle)}
            className='contents'
          >
            <StatsCard
              title='Profile Views'
              type='views'
              value={data?.profileViews}
              description='Unique visitors'
            />
          </Link>
        </div>
      </div>
    </>
  );
};

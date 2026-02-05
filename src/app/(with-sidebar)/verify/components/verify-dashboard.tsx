'use client';

import { isAxiosError } from 'axios';
import { Globe } from 'lucide-react';

import { Nt } from '@/components/common/nt';
import { Button } from '@/components/ui/button';
import { useDueCustomer } from '@/hooks/profile/use-due-customer';
import { useNeedsMigration } from '@/hooks/profile/use-needs-migration';
import { env } from '@/lib/env';

import { MigrationBanner } from '../../dashboard/components/migration-banner';
import { SetupCard } from '../../dashboard/components/setup-card';
import { useDashboardData } from '../../dashboard/hooks/use-dashboard-data';
import { FAQ } from './faq';

// Build full Due URL
const buildDueUrl = (path?: string) => {
  if (!path) return undefined;
  try {
    return new URL(path, env.NEXT_PUBLIC_DUE_BASE_URL).toString();
  } catch {
    return path;
  }
};

export const VerifyDashboard = () => {

  const { data: dueCustomer, isLoading } = useDueCustomer({
    refetchInterval: 10000, // 10s
    retry: (_, error) => {
      // Only retry if the error is not a 404
      return !(isAxiosError(error) && error.status === 404);
    },
  });

  const account = dueCustomer?.account;
  const kycStatus = account?.kyc?.status;
  const tosStatus = account?.tos?.status;

  // Dashboard data for SetupCard
  const { data: dashboardData, isLoading: isDashboardLoading } = useDashboardData();
  const completedTasks = dashboardData?.tasks;

  // Check if user needs to migrate from Bridge to Due
  const needsMigration = useNeedsMigration();

  // Build full URLs for TOS and KYC links
  const tosLink = buildDueUrl(account?.tos?.link);
  const kycLink = buildDueUrl(account?.kyc?.link);

  return (
    <div className='@container size-full w-full max-w-7xl space-y-4 px-[1px] sm:space-y-6 sm:px-0'>
      {/* Header Section */}
      <div className='flex w-full flex-col items-start justify-between gap-4 border-b px-4 pb-4 pt-[1px] sm:flex-row sm:items-center sm:gap-6 sm:px-6 md:min-h-[72px]'>
        {/* Mobile: Title + Buttons in one row */}
        <div className='flex w-full items-center justify-between sm:hidden'>
          <h2 className='text-xl font-semibold'>Account Verification</h2>
          <div className='flex shrink-0 gap-2'>
            <Button variant='outline' asChild size='icon' className='size-9'>
              <Nt href='https://docs.mysorbet.xyz/supported-countries'>
                <Globe className='size-4' />
              </Nt>
            </Button>
          </div>
        </div>

        {/* Desktop: Original layout */}
        <div className='hidden min-w-0 flex-1 sm:block'>
          <h2 className='text-2xl font-semibold'>Account Verification</h2>
          <p className='text-muted-foreground text-sm'>
            Verify your identity to unlock virtual bank accounts
          </p>
        </div>

        <div className='hidden shrink-0 gap-3 sm:flex'>
          <Button variant='outline' asChild>
            <Nt href='https://docs.mysorbet.xyz/sorbet/readme/list-of-supported-countries'>
              <Globe className='mr-2 size-4' />
              Supported Countries
            </Nt>
          </Button>
        </div>
      </div>

      {/* Content Container - Reduced width and centered */}
      <div className='mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 sm:px-6'>
        {/* Migration Banner: Show for Bridge users who need to migrate to Due */}
        {needsMigration && <MigrationBanner />}

        {/* SetupCard - Vertical layout with inline verification - Always show on verify page */}
        <SetupCard
          completedTasks={completedTasks}
          kycStatus={kycStatus}
          tosStatus={tosStatus}
          loading={isLoading || isDashboardLoading}
          layout='vertical'
          tosLink={tosLink}
          kycLink={kycLink}
          showInlineVerification={true}
        />

        {/* FAQ */}
        <FAQ className='h-fit' />
      </div>
    </div>
  );
};

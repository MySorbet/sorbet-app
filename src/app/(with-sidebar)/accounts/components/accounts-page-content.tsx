'use client';

import { Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { AnnouncementBanner } from '@/app/(with-sidebar)/dashboard/components/announcement-banner';
import { RestrictedCountryBanner } from '@/app/(with-sidebar)/dashboard/components/restricted-country-banner';
import { isRestrictedCountry } from '@/app/signin/components/business/country-restrictions';
import { DocsButton } from '@/components/common/docs-button';
import { Spinner } from '@/components/common/spinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
} from '@/components/ui/drawer';
import { useDueCustomer } from '@/hooks/profile/use-due-customer';
import { useDueVirtualAccounts } from '@/hooks/profile/use-due-virtual-accounts';
import { useClaimDueVirtualAccount } from '@/hooks/profile/use-claim-due-virtual-account';
import { useAuth } from '@/hooks/use-auth';
import { useIsMobile } from '@/hooks/use-mobile';
import type {
  DueAccount,
  DueVirtualAccount,
  DueVirtualAccountUSDetails,
  DueVirtualAccountEURDetails,
  DueVirtualAccountAEDDetails,
  DueVirtualAccountSWIFTDetails,
} from '@/types/due';

import {
  AccountSelect,
} from './account-select';
import { type AccountId, type AccountState } from './account-select-button';
import { DueAccountDetails } from './due-account-details';
import { RestrictedAccountsDisplay } from './restricted-accounts-display';

/**
 * Compose account components into a page with state
 *
 * Flow (Due-based):
 * - Check Due KYC status (not Bridge)
 * - If KYC not passed → Show verification banner and locked accounts
 * - If KYC passed:
 *   - USD: Auto-created after KYC, but show Claim if missing
 *   - EUR/AED: Show Claim button until user claims
 *   - GBP/SAR: Coming Soon (hardcoded)
 */
export const AccountsPageContent = () => {
  const router = useRouter();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  // Due customer for KYC status
  const { data: dueCustomer, isLoading: isDueCustomerLoading } = useDueCustomer({
    enabled: !!user?.id,
  });

  // Due virtual accounts
  // Poll every 2s when any account exists but details haven't been populated yet.
  // Due creates the account record first, then populates details asynchronously.
  const { data: dueVirtualAccounts, isLoading: isDueAccountsLoading } =
    useDueVirtualAccounts({
      enabled: !!user?.id,
      refetchInterval: (query) => {
        const accounts = query.state.data;
        const hasPending = accounts?.some((a) => a.account && !a.account.details);
        return hasPending ? 2000 : false;
      },
    });

  // Claim mutation
  const {
    mutate: claimAccount,
    isPending: isClaiming,
    variables: claimingCurrency,
  } = useClaimDueVirtualAccount();

  // Selected account state
  const [selectedAccount, setSelectedAccount] = useState<AccountId>('usd');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Country restriction check
  const isRestricted = isRestrictedCountry(user?.country);

  // Due KYC status
  const dueAccount = dueCustomer?.account as DueAccount | undefined;
  const isDueVerified = dueAccount?.kyc?.status === 'passed';
  const isKycPending = dueAccount?.kyc?.status === 'pending';
  const isKycNotStarted = !dueAccount?.kyc?.status || dueAccount?.kyc?.status === 'not_started';

  // Find virtual accounts by schema
  const usdAccount = dueVirtualAccounts?.find((a) => a.schema === 'bank_us');
  const eurAccount = dueVirtualAccounts?.find((a) => a.schema === 'bank_sepa');
  const aedAccount = dueVirtualAccounts?.find((a) => a.schema === 'bank_mena');
  const usdSwiftAccount = dueVirtualAccounts?.find((a) => a.schema === 'bank_swift_usd');

  // Determine account states
  const getAccountState = (
    account: DueVirtualAccount | undefined,
    isClaimable: boolean
  ): AccountState => {
    if (account) return 'available';
    if (isDueVerified && isClaimable) return 'claimable';
    return 'locked';
  };

  const accountStates: { id: AccountId; state: AccountState }[] = [
    { id: 'usd', state: getAccountState(usdAccount, true) },
    { id: 'eur', state: getAccountState(eurAccount, true) },
    { id: 'aed', state: getAccountState(aedAccount, true) },
    { id: 'gbp', state: 'coming-soon' },
    { id: 'sar', state: 'coming-soon' },
  ];

  // Handle account selection
  const handleSelectAccount = (id: AccountId) => {
    setSelectedAccount(id);
    setIsDrawerOpen(true);
  };

  // Handle claim
  const handleClaim = (id: AccountId) => {
    const currencyMap = { usd: 'usd', eur: 'eur', aed: 'aed' } as const;
    const currency = currencyMap[id as keyof typeof currencyMap];
    if (currency) {
      claimAccount(currency);
    }
  };

  // Loading state
  if (isDueCustomerLoading || isDueAccountsLoading) {
    return (
      <div className='flex size-full items-center justify-center'>
        <Spinner className='size-8' />
      </div>
    );
  }

  // For restricted country users, show all accounts with "Coming Soon" badges
  if (isRestricted) {
    return (
      <div className='@container size-full w-full max-w-7xl space-y-4 px-[1px] sm:space-y-6 sm:px-0'>
        {/* Header Section */}
        <div className='flex w-full flex-col items-start justify-between gap-4 border-b px-4 pb-4 pt-[1px] sm:flex-row sm:items-center sm:gap-6 sm:px-6 md:min-h-[72px]'>
          <div className='flex w-full items-center justify-between sm:hidden'>
            <h2 className='text-xl font-semibold'>Accounts</h2>
            <DocsButton />
          </div>
          <div className='hidden min-w-0 flex-1 sm:block'>
            <h2 className='text-2xl font-semibold'>Accounts</h2>
            <p className='text-muted-foreground text-sm'>
              Receive USD and EUR payments from your customers
            </p>
          </div>
          <div className='hidden shrink-0 gap-3 sm:flex'>
            <DocsButton />
          </div>
        </div>
        <RestrictedCountryBanner />
        <div className='px-4 sm:px-6'>
          <RestrictedAccountsDisplay />
        </div>
      </div>
    );
  }

  // Get account details for the selected account
  const getSelectedAccountDetails = () => {
    const accountState = accountStates.find((a) => a.id === selectedAccount);

    // Coming Soon accounts
    if (selectedAccount === 'gbp' || selectedAccount === 'sar') {
      return <ComingSoonCard currency={selectedAccount.toUpperCase()} />;
    }

    // Locked state (not verified)
    if (accountState?.state === 'locked') {
      return (
        <UnverifiedCard
          onVerify={() => router.push('/verify')}
          isPending={isKycPending}
        />
      );
    }

    // Claimable state (verified but no account yet)
    if (accountState?.state === 'claimable') {
      return (
        <ClaimableCard
          currency={selectedAccount.toUpperCase()}
          onClaim={() => handleClaim(selectedAccount)}
          isClaiming={isClaiming && claimingCurrency === selectedAccount}
        />
      );
    }

    // Available state - show account details
    // If account exists but details are null, show "Setting up..." (Due populates async)
    if (selectedAccount === 'usd' && usdAccount) {
      const details = usdAccount.account?.details as DueVirtualAccountUSDetails | undefined;
      if (!details) return <SettingUpCard currency='USD' />;
      const swiftDetails = usdSwiftAccount?.account?.details as DueVirtualAccountSWIFTDetails | undefined;
      return <DueAccountDetails.USD details={details} swiftDetails={swiftDetails} />;
    }
    if (selectedAccount === 'eur' && eurAccount) {
      const details = eurAccount.account?.details as DueVirtualAccountEURDetails | undefined;
      if (!details) return <SettingUpCard currency='EUR' />;
      return <DueAccountDetails.EUR details={details} />;
    }
    if (selectedAccount === 'aed' && aedAccount) {
      const details = aedAccount.account?.details as DueVirtualAccountAEDDetails | undefined;
      if (!details) return <SettingUpCard currency='AED' />;
      return <DueAccountDetails.AED details={details} />;
    }

    return null;
  };

  return (
    <div className='@container size-full w-full max-w-7xl space-y-4 px-[1px] sm:space-y-6 sm:px-0'>
      {/* Header Section */}
      <div className='flex w-full flex-col items-start justify-between gap-4 border-b px-4 pb-4 pt-[1px] sm:flex-row sm:items-center sm:gap-6 sm:px-6 md:min-h-[72px]'>
        {/* Mobile: Title + Button in one row */}
        <div className='flex w-full items-center justify-between sm:hidden'>
          <h2 className='text-xl font-semibold'>Accounts</h2>
          <DocsButton />
        </div>

        {/* Desktop: Original layout */}
        <div className='hidden min-w-0 flex-1 sm:block'>
          <h2 className='text-2xl font-semibold'>Accounts</h2>
          <p className='text-muted-foreground text-sm'>
            Receive USD and EUR payments from your customers
          </p>
        </div>

        <div className='hidden shrink-0 gap-3 sm:flex'>
          <DocsButton />
        </div>
      </div>

      {/* Verification banner if not verified */}
      {(isKycNotStarted || !isDueVerified) && (
        <AnnouncementBanner
          onComplete={() => router.push('/verify')}
        />
      )}

      <div className='flex size-full flex-col gap-6 px-4 sm:px-6 lg:flex-row'>
        <AccountSelect
          className='w-full lg:max-w-sm'
          selected={selectedAccount}
          onSelect={handleSelectAccount}
          accounts={accountStates}
          onClaim={handleClaim}
          claimingAccount={isClaiming ? (claimingCurrency as AccountId) : null}
        />

        {/* Account details card */}
        <AccountDetailsCard open={isDrawerOpen} setOpen={setIsDrawerOpen}>
          {getSelectedAccountDetails()}
        </AccountDetailsCard>
      </div>
    </div>
  );
};

/**
 * Card wrapper that becomes a drawer on mobile
 */
const AccountDetailsCard = ({
  children,
  open,
  setOpen,
}: {
  children: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <div className='flex flex-col gap-4 p-4'>{children}</div>
          <DrawerFooter>
            <DrawerClose>
              <Button variant='secondary' className='w-full'>
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Card className='h-fit w-full'>
      <CardContent className='flex flex-col items-center justify-center p-6'>
        {children}
      </CardContent>
    </Card>
  );
};

/**
 * Card shown when user hasn't verified yet
 */
const UnverifiedCard = ({
  onVerify,
  isPending,
}: {
  onVerify: () => void;
  isPending?: boolean;
}) => {
  return (
    <div className='flex w-full flex-col items-center justify-center gap-4 py-12'>
      <Lock className='text-muted-foreground size-10' />
      <p className='text-muted-foreground text-center text-sm'>
        Complete verification to start accepting
        <br />
        USD and/or EUR payments
      </p>
      <Button variant='sorbet' onClick={onVerify}>
        {isPending ? 'Continue Verification' : 'Complete Verification'}
      </Button>
    </div>
  );
};

/**
 * Card shown when account can be claimed
 */
const ClaimableCard = ({
  currency,
  onClaim,
  isClaiming,
}: {
  currency: string;
  onClaim: () => void;
  isClaiming?: boolean;
}) => {
  return (
    <div className='flex w-full flex-col items-center justify-center gap-4 py-12'>
      <p className='text-muted-foreground text-center text-sm'>
        Click below to create your {currency} account
      </p>
      <Button variant='sorbet' onClick={onClaim} disabled={isClaiming}>
        {isClaiming && <Spinner className='mr-2 size-4' />}
        {isClaiming ? 'Creating...' : `Claim ${currency} Account`}
      </Button>
    </div>
  );
};

/**
 * Card shown when account was created but details are still being populated by Due
 */
const SettingUpCard = ({ currency }: { currency: string }) => {
  return (
    <div className='flex w-full flex-col items-center justify-center gap-4 py-12'>
      <div className='flex items-center gap-2'>
        <Spinner className='size-5' />
        <p className='text-sm font-medium'>Setting up your {currency} account...</p>
      </div>
      <p className='text-muted-foreground text-center text-xs'>
        This usually takes a few moments.
      </p>
    </div>
  );
};

/**
 * Card shown for Coming Soon accounts
 */
const ComingSoonCard = ({ currency }: { currency: string }) => {
  return (
    <div className='flex w-full flex-col items-center justify-center gap-4 py-12'>
      <p className='text-muted-foreground text-center text-sm'>
        {currency} accounts are coming soon
      </p>
    </div>
  );
};

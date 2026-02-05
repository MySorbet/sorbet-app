'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { usePrivy } from '@privy-io/react-auth';

import { EditProfileSheet } from '@/app/[handle]/components/edit-profile-sheet/edit-profile-sheet';
import { isRestrictedCountry } from '@/app/signin/components/business/country-restrictions';
import { FullscreenLoader } from '@/components/common/fullscreen-loader';
import { useUnlessMobile } from '@/components/common/open-on-desktop-drawer/unless-mobile';
import { useBridgeCustomer } from '@/hooks/profile/use-bridge-customer';
import { useAuth } from '@/hooks/use-auth';
import { useMyChain, useSetMyChain } from '@/hooks/use-my-chain';
import { useSmartWalletAddress } from '@/hooks/web3/use-smart-wallet-address';
import { useWalletBalance } from '@/hooks/web3/use-wallet-balance';
import { getStellarAddressFromPrivyUser } from '@/lib/stellar/privy';

import { Duration } from '../../wallet/components/balance-card/select-duration';
import { calculateBalanceHistory } from '../../wallet/components/balance-card/util';
import { useTransactionOverview } from '../../wallet/hooks/use-transaction-overview';
import { useDashboardData } from '../hooks/use-dashboard-data';
import { AnnouncementBanner } from './announcement-banner';
import { BalanceSectionCard } from './balance-section-card';
import {
  type TaskType,
  TaskStatuses,
} from './checklist-card';
import { DepositDialog } from './deposit-dialog';
import { NetworkDropdown } from './network-dropdown';
import { RestrictedCountryBanner } from './restricted-country-banner';
import { SetupCard } from './setup-card';
import { SmallStatCard } from './small-stat-card';
import { StellarActivationDialog } from './stellar-activation-dialog';
import { StellarTrustlineDialog } from './stellar-trustline-dialog';
import { WelcomeCard } from './welcome-card';

/**
 * Composes dashboard cards into a fluid layout
 * Also manages state, click actions, and routing actions
 * TODO: What if this component stayed server side and just managed layout. And the former responsibilities were hoisted?
 */
export const Dashboard = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { user: privyUser } = usePrivy();
  const { data: dashboardData, isLoading: isDashboardLoading } = useDashboardData();
  const { data: usdcBalance, isPending: isBalanceLoading } = useWalletBalance();
  const { smartWalletAddress } = useSmartWalletAddress();
  const { data: bridgeCustomer, isLoading: isBridgeLoading } = useBridgeCustomer();
  const { data: myChainData } = useMyChain();
  const { mutateAsync: setChain, isPending: isSettingChain } = useSetMyChain();

  const [duration, setDuration] = useState<Duration>('all');
  const { data: transactions, isLoading: isTransactionsLoading } = useTransactionOverview(
    duration === 'all' ? undefined : parseInt(duration)
  );

  const totalMoneyIn = Number(transactions?.total_money_in ?? 0);
  const totalMoneyOut = Number(transactions?.total_money_out ?? 0);

  const cumulativeBalanceHistory = calculateBalanceHistory(
    Number(usdcBalance ?? 0),
    transactions?.money_in ?? [],
    transactions?.money_out ?? []
  );

  // Completed tasks are stored in the DB
  const completedTasks: TaskStatuses | undefined = dashboardData?.tasks;

  const kycStatus = bridgeCustomer?.customer?.status;
  const isKycVerified = kycStatus === 'active';
  const isKycRejected = kycStatus === 'rejected';
  const isKycNotStarted = !kycStatus || ['not_started', 'incomplete'].includes(kycStatus);
  const hasCreatedInvoice = completedTasks?.invoice ?? false;

  const isRestricted = isRestrictedCountry(user?.country);

  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isStellarActivationOpen, setIsStellarActivationOpen] = useState(false);
  const [isStellarTrustlineOpen, setIsStellarTrustlineOpen] = useState(false);

  const unlessMobile = useUnlessMobile();

  const currentChain = myChainData?.chain ?? 'base';
  const stellarAddress = getStellarAddressFromPrivyUser(privyUser ?? null);

  const currentWalletAddress = currentChain == 'base'? smartWalletAddress: stellarAddress;

  const handleChainChange = async (nextChain: 'base' | 'stellar') => {
    if (nextChain === currentChain) return;

    try {
      await setChain(nextChain);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);

      if (message.includes('User does not have a Stellar wallet in Privy')) {
        toast.error('Stellar wallet is not active', {
          description: 'Please log out and log back in, then try again.',
        });
        return;
      }

      if (nextChain === 'stellar' && message.includes('Stellar account does not exist on-chain')) {
        if (!stellarAddress) {
          toast.error('Unable to find Stellar address', {
            description: 'Please log out and log back in, then try again.',
          });
          return;
        }
        setIsStellarActivationOpen(true);
        return;
      }

      if (
        nextChain === 'stellar' &&
        message.includes('Stellar account does not have a USDC trustline')
      ) {
        if (!stellarAddress) {
          toast.error('Unable to find Stellar address', {
            description: 'Please log out and log back in, then try again.',
          });
          return;
        }
        setIsStellarTrustlineOpen(true);
        return;
      }

      toast.error('Unable to switch network', { description: message });
    }
  };

  // Action handlers
  const handleDeposit = () => setIsDepositOpen(true);
  const handleCreateInvoice = () => {
    unlessMobile(() => router.push('/invoices/create'));
  };
  const handleSendFunds = () => router.push('/recipients?send-to=true');
  const handleAddRecipient = () => router.push('/recipients?add-recipient=true');

  const handleTaskClick = (type: TaskType) => {
    switch (type) {
      case 'verified':
        router.push('/verify');
        break;
      case 'invoice':
        handleCreateInvoice();
        break;
      case 'payment':
        router.push('/wallet');
        break;
    }
  };

  return (
    <>
      {isSettingChain && <FullscreenLoader label='Switching network…' />}

      {stellarAddress && (
        <>
          <StellarActivationDialog
            open={isStellarActivationOpen}
            onOpenChange={setIsStellarActivationOpen}
            stellarAddress={stellarAddress}
            onRetrySwitch={() => handleChainChange('stellar')}
          />
          <StellarTrustlineDialog
            open={isStellarTrustlineOpen}
            onOpenChange={setIsStellarTrustlineOpen}
            stellarAddress={stellarAddress}
            onTrustlineEstablished={() => handleChainChange('stellar')}
          />
        </>
      )}

      {/* Deposit dialog */}
      <DepositDialog
        open={isDepositOpen}
        onOpenChange={setIsDepositOpen}
        chain={currentChain}
        walletAddress={currentWalletAddress ?? undefined}
        bridgeCustomer={bridgeCustomer}
      />

      {/* Conditionally rendered profile edit modal */}
      {user && (
        <EditProfileSheet
          open={isProfileEditOpen}
          setOpen={setIsProfileEditOpen}
          user={user}
        />
      )}

      {/* Dashboard layout */}
      <div className='@container size-full w-full max-w-7xl space-y-4 px-[1px] sm:space-y-6 sm:px-0'>
        {/* Welcome Header */}
        <WelcomeCard
          name={user?.firstName}
          onDeposit={handleDeposit}
          onSendFunds={handleSendFunds}
        />

        {/* Conditional Banners based on user country and verification status */}
        {isRestricted ? (
          <RestrictedCountryBanner />
        ) : (
          <>
            {/* Announcement Banner: Only show if KYC is not started or rejected */}
            {(isKycNotStarted || isKycRejected) && (
              <AnnouncementBanner onComplete={() => router.push('/verify')} />
            )}

            {/* Setup Card: Show if not fully verified or if verified but no invoice created yet */}
            {!(isKycVerified && hasCreatedInvoice) && (
              <SetupCard
                completedTasks={completedTasks}
                onVerifyClick={() => router.push('/verify')}
                kycStatus={kycStatus}
                loading={isBridgeLoading || isDashboardLoading}
              />
            )}
          </>
        )}

        {/* Three Small Cards Row */}
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6'>
          <SmallStatCard
            title='Sorbet wallet'
            value={Number(usdcBalance ?? 0)}
            description='Total'
            buttonLabel='Deposit'
            isLoading={isBalanceLoading}
            onClick={handleDeposit}
            formatValue={true}
            infoButtonUrl='https://docs.mysorbet.xyz/sorbet/how-it-works#id-1.-your-sorbet-wallet'
            walletAddress={currentWalletAddress ?? undefined}
            actions={
              <NetworkDropdown
                value={currentChain}
                disabled={isSettingChain}
                onChange={(v) => handleChainChange(v)}
              />
            }
          />
          <SmallStatCard
            title='Invoice sales'
            value={dashboardData?.invoiceSales}
            description='Total income'
            buttonLabel='+ Create'
            isLoading={isDashboardLoading}
            onClick={handleCreateInvoice}
            formatValue={true}
          />
          <SmallStatCard
            title='Recipients'
            value={dashboardData?.recipientsCount}
            description='Total'
            buttonLabel='+ Add'
            isLoading={isDashboardLoading}
            onClick={handleAddRecipient}
            formatValue={false}
          />
        </div>

        {/* Balance Section with Chart and Money In/Out */}
        <BalanceSectionCard
          history={cumulativeBalanceHistory}
          moneyIn={totalMoneyIn}
          moneyOut={totalMoneyOut}
          balance={Number(usdcBalance ?? 0)}
          duration={duration}
          onDurationChange={setDuration}
          isLoading={isBalanceLoading || isTransactionsLoading}
        />

      </div>
    </>
  );
};

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Receipt, User01 } from '@untitled-ui/icons-react';
import { X } from '@untitled-ui/icons-react';
import {
  CircleArrowRight,
  LayoutGrid,
  LogOut,
  WalletMinimal,
} from 'lucide-react';
import { GanttChartSquare } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Spinner } from '@/components/common';
import { CopyIconButton } from '@/components/common/copy-button/copy-icon-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth, useSmartWalletAddress, useWalletBalances } from '@/hooks';
import { featureFlags } from '@/lib/flags';
import { cn } from '@/lib/utils';

import { useBridgeActions } from './use-bridge-actions';
import { VerificationCard } from './verification-card';

interface SidebarProps {
  isOpen: boolean;
  onIsOpenChange: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onIsOpenChange }) => {
  const router = useRouter();
  const { user, logout } = useAuth();

  if (!user) {
    throw new Error('User not found');
  }

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
    router.push('/signin');
  };

  const handleSidebarClose = () => {
    onIsOpenChange(false);
  };

  const {
    bridgeCustomer,
    isCollapsed,
    isIndeterminate,
    isVerifying,
    handlePrimaryButtonClick,
  } = useBridgeActions();

  return (
    <Sheet open={isOpen} onOpenChange={onIsOpenChange}>
      <SheetContent
        className='inset-y-6 right-6 h-auto rounded-3xl bg-[#F9FAFB] data-[state=closed]:right-0'
        hideDefaultCloseButton
      >
        <VisuallyHidden>
          <SheetTitle>{`Sidebar for ${user.handle}`}</SheetTitle>
          <SheetDescription>
            Displaying balances and navigation options
          </SheetDescription>
        </VisuallyHidden>

        <div className='flex h-full w-full flex-col justify-between gap-10 text-[#101828]'>
          <div className='flex w-full flex-col gap-10'>
            {/* Header */}
            <div className='flex w-full flex-row items-center justify-between'>
              <div className='flex flex-row items-center justify-between gap-2'>
                <Avatar className='border-primary-default size-12 border-2'>
                  <AvatarImage src={user?.profileImage} alt='profile image' />
                  <AvatarFallback>
                    <User01 className='text-muted-foreground' />
                  </AvatarFallback>
                </Avatar>
                <div className='flex flex-col'>
                  <div className='text-base font-bold '>
                    {`${user.firstName} ${user.lastName}`}
                  </div>
                  <div className='text-base'>{user.handle}</div>
                </div>
              </div>
              <Button variant='ghost' onClick={handleSidebarClose} size='icon'>
                <X />
              </Button>
            </div>

            {/* Navigation and Balances */}
            <div>
              <div
                className={cn(
                  'grid grid-cols-3 gap-2',
                  featureFlags.dashboard && 'grid-cols-2'
                )}
              >
                {featureFlags.dashboard && (
                  <SidebarHeaderOption
                    label='Dashboard'
                    icon={<GanttChartSquare />}
                    href='/dashboard'
                  />
                )}
                <SidebarHeaderOption
                  label='Wallet'
                  href='/wallet'
                  icon={<WalletMinimal />}
                />
                <SidebarHeaderOption
                  label='Profile'
                  icon={<CircleArrowRight />}
                  href={`/${user.handle}`}
                />
                {featureFlags.invoices && (
                  <SidebarHeaderOption
                    label='Invoices'
                    icon={<Receipt />}
                    href='/invoices'
                  />
                )}
              </div>
              <Balances />
            </div>
          </div>

          {/* Verification and logout */}
          <div className='flex flex-col gap-2'>
            {featureFlags.verification && (
              <VerificationCard
                tosStatus={bridgeCustomer?.tos_status}
                kycStatus={bridgeCustomer?.kyc_status}
                disabled={isVerifying}
                missingEmail={!user.email}
                indeterminate={isIndeterminate}
                isCollapsed={isCollapsed}
                onComplete={handlePrimaryButtonClick}
                rejectionReasons={bridgeCustomer?.rejection_reasons?.map(
                  (reason) => reason.reason
                )}
              />
            )}
            <Button
              onClick={handleLogout}
              variant='ghost'
              className='w-fit text-lg font-semibold'
              disabled={isLoggingOut}
            >
              <div className='mr-2'>
                {isLoggingOut ? <Spinner size='small' /> : <LogOut />}
              </div>
              {isLoggingOut ? 'Logging out' : 'Logout'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

/**
 * Local component for displaying wallet balances
 */
const Balances: React.FC = () => {
  const { smartWalletAddress } = useSmartWalletAddress();
  const { usdcBalance, loading } = useWalletBalances(smartWalletAddress, false);
  // Note: ETH balance is still fetched despite not being displayed

  return (
    <div className='mt-3 flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm'>
      <div className='flex flex-row items-center justify-between'>
        <div className='text-muted-foreground text-sm'>Balances</div>
        {featureFlags.walletAddressInSidebar && <WalletAddress />}
      </div>
      <div className='flex flex-col gap-3'>
        <div className='flex items-center gap-2 text-sm font-semibold'>
          <Image
            src='/svg/usdc.svg'
            alt='USDC'
            width={18}
            height={18}
            className='size-[1.125rem]' // 18px
          />

          {loading ? <Skeleton className='h-4 w-24' /> : `${usdcBalance} USDC`}
        </div>
      </div>
    </div>
  );
};

/**
 * Local component for displaying wallet address with a copy button
 */
const WalletAddress: React.FC = () => {
  const { smartWalletAddress, isLoading: isSmartWalletAddressLoading } =
    useSmartWalletAddress();

  // If we don't have an address yet, we should show a skeleton
  if (isSmartWalletAddressLoading || !smartWalletAddress) {
    return <Skeleton className='h-4 w-24' />;
  }

  const truncatedAddress = `${smartWalletAddress.slice(
    0,
    5
  )}...${smartWalletAddress.slice(-5)}`;
  return (
    <div className='text-muted-foreground flex flex-row items-center gap-1 text-xs'>
      <span>{truncatedAddress}</span>
      <CopyIconButton
        onCopy={() => {
          navigator.clipboard.writeText(smartWalletAddress);
        }}
      />
    </div>
  );
};

/**
 * Local component for displaying a sidebar header option
 */
const SidebarHeaderOption: React.FC<{
  label: string;
  icon: React.ReactNode;
  href: string;
}> = ({ label, icon, href }) => {
  return (
    <Link
      href={href}
      className='border-1 relative min-w-fit max-w-44 cursor-pointer rounded-xl border border-gray-200 bg-[#FEFEFE] p-3 hover:bg-gray-100'
    >
      <div className='text-sorbet flex flex-col items-center justify-center gap-1 font-semibold'>
        {icon}
        <div className='text-sm'>{label}</div>
      </div>
    </Link>
  );
};

import { Receipt, User01 } from '@untitled-ui/icons-react';
import {
  CircleArrowRight,
  LayoutGrid,
  LogOut,
  WalletMinimal,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { CopyButton, Spinner } from '@/components/common';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth, useEmbeddedWalletAddress, useWalletBalances } from '@/hooks';
import { featureFlags } from '@/lib/flags';

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

  return (
    <div
      className={`fixed z-40 h-[100v] w-screen overflow-y-auto transition-opacity duration-300 lg:left-0 ${
        isOpen ? 'inset-0 bg-[#0C111D70] opacity-100' : 'opacity-0'
      }`}
      onClick={handleSidebarClose}
    >
      <div
        className={`right-0 z-40 flex h-full w-full flex-col items-start justify-between gap-6 overflow-y-auto bg-[#F9FAFB] p-8 text-black lg:m-6 lg:h-[calc(100%-48px)] lg:w-[420px] lg:rounded-[32px] ${
          isOpen ? 'fixed' : 'hidden'
        }`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className='flex h-full w-full flex-col justify-between gap-10 text-[#101828]'>
          <div className='flex w-full flex-col gap-10'>
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
              <div className='cursor-pointer' onClick={handleSidebarClose}>
                <X />
              </div>
            </div>
            <div>
              {/* TODO: Change to 3 columns when invoices are enabled */}
              <div className='grid grid-cols-2 gap-2'>
                <SidebarHeaderOption
                  label='Wallet'
                  href='/wallet'
                  icon={<WalletMinimal />}
                />
                {featureFlags.gigs && (
                  <SidebarHeaderOption
                    label='Gigs'
                    href='/gigs'
                    icon={<LayoutGrid />}
                  />
                )}
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
    </div>
  );
};

/**
 * Local component for displaying wallet balances
 */
const Balances: React.FC = () => {
  const address = useEmbeddedWalletAddress();
  const { ethBalance, usdcBalance, loading } = useWalletBalances(address ?? '');

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
        <div className='flex items-center gap-2 text-sm font-semibold'>
          <Image
            src='/svg/ethereum.svg'
            alt='ETH'
            width={18}
            height={18}
            className='size-[1.125rem]' // 18px
          />
          {loading ? <Skeleton className='h-4 w-24' /> : `${ethBalance} ETH`}
        </div>
      </div>
    </div>
  );
};

/**
 * Local component for displaying wallet address with a copy button
 */
const WalletAddress: React.FC = () => {
  const address = useEmbeddedWalletAddress();

  // If we don't have an address yet, we should show a skeleton
  if (!address) {
    return <Skeleton className='h-4 w-24' />;
  }

  const truncatedAddress = `${address.slice(0, 5)}...${address.slice(-5)}`;
  return (
    <div className='text-muted-foreground flex flex-row items-center gap-1 text-xs'>
      <span>{truncatedAddress}</span>
      <CopyButton
        onCopy={() => {
          navigator.clipboard.writeText(address);
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

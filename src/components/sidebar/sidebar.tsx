import { User01 } from '@untitled-ui/icons-react';
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

import { Spinner } from '@/components/common';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks';
import { useAppDispatch } from '@/redux/hook';
import { setOpenSidebar } from '@/redux/userSlice';

interface SidebarProps {
  show: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ show }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
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
    dispatch(setOpenSidebar(false));
  };

  return (
    <div
      className={`fixed z-40 h-[100v] w-screen overflow-y-auto transition-opacity duration-300 lg:left-0 ${
        show ? 'inset-0 bg-[#0C111D70] opacity-100' : 'opacity-0'
      }`}
      onClick={() => dispatch(setOpenSidebar(false))}
    >
      <div
        className={`right-0 z-40 flex h-full w-full flex-col items-start justify-between gap-6 overflow-y-auto bg-[#F9FAFB] p-8 text-black lg:m-6 lg:h-[calc(100%-48px)] lg:w-[420px] lg:rounded-[32px] ${
          show ? 'fixed' : 'hidden'
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
              <div className='grid grid-cols-3 gap-2'>
                <div className='col-span-1'>
                  <Link href='/wallet'>
                    <SidebarHeaderOption
                      label='Wallet'
                      icon={<WalletMinimal />}
                      onClick={() => handleSidebarClose()}
                    />
                  </Link>
                </div>
                <div className='col-span-1'>
                  <Link href='/gigs'>
                    <SidebarHeaderOption
                      label='Gigs'
                      icon={<LayoutGrid />}
                      onClick={() => handleSidebarClose()}
                    />
                  </Link>
                </div>
                <div className='col-span-1'>
                  <Link href={`/${user.handle}`}>
                    <SidebarHeaderOption
                      label='Profile'
                      icon={<CircleArrowRight />}
                      onClick={() => handleSidebarClose()}
                    />
                  </Link>
                </div>
              </div>
              <div className='mt-3 flex flex-col rounded-xl bg-white p-5'>
                <div className='font-light text-gray-600'>Balances</div>
                <div className='mt-6 flex flex-col gap-3'>
                  <div className='flex justify-between'>
                    <div className='flex flex-row gap-2'>
                      <Image
                        src='/svg/usdc.svg'
                        alt='USDC'
                        width={20}
                        height={20}
                      />
                      <div>
                        {user.balance?.usdc.toLocaleString() || `0`} USDC
                      </div>
                    </div>
                    <div className='text-gray-600'>
                      ${user.balance?.usdc.toLocaleString() || `0`}
                    </div>
                  </div>
                  <div className='flex justify-between'>
                    <div className='flex flex-row gap-2'>
                      <Image
                        src='/svg/ethereum.svg'
                        alt='ETH'
                        width={20}
                        height={20}
                      />
                      <div>{user.balance?.near || `0`} ETH</div>
                    </div>
                    <div className='text-gray-600'>
                      ${user.balance?.nearUsd || `0`}
                    </div>
                  </div>
                </div>
              </div>
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

const SidebarHeaderOption: React.FC<{
  label: string;
  icon: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  comingSoon?: boolean;
}> = ({ label, icon, comingSoon, onClick }) => {
  return (
    <div
      className='border-1 relative cursor-pointer rounded-xl border border-gray-200 bg-[#FEFEFE] p-3 hover:bg-gray-100'
      onClick={onClick}
    >
      {comingSoon && (
        <div className='bg-sorbet absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 rotate-45 transform rounded-xl px-1 py-1 text-xs font-semibold text-white'>
          Soon
        </div>
      )}
      <div className='text-sorbet flex flex-col items-center justify-center gap-1 font-semibold'>
        <div>{icon}</div>
        <div className='text-sm'>{label}</div>
      </div>
    </div>
  );
};

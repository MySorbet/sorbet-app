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

import { useAuth } from '@/hooks';
import { useAppDispatch } from '@/redux/hook';
import { setOpenSidebar } from '@/redux/userSlice';

interface SidebarProps {
  show: boolean;
}

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

export const Sidebar: React.FC<SidebarProps> = ({ show }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, logout } = useAuth();

  if (!user) {
    throw new Error('User not found');
  }

  const handleLogout = async () => {
    logout();
    router.push('/');
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
                <div>
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt='logo'
                      className='h-14 w-14 rounded-full'
                    />
                  ) : (
                    <img
                      src='/avatar.svg'
                      className='h-14 w-14 rounded-full'
                      alt='logo'
                    />
                  )}
                </div>
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
                        src='/svg/near-protocol.svg'
                        alt='USDC'
                        width={17}
                        height={17}
                      />
                      <div>{user.balance?.near || `0`} NEAR</div>
                    </div>
                    <div className='text-gray-600'>
                      ${user.balance?.nearUsd || `0`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='flex cursor-pointer flex-col gap-6 text-xl font-medium'>
            <div
              className='flex flex-row items-center gap-2'
              onClick={() => handleLogout()}
            >
              <div>
                <LogOut />
              </div>
              <div>Logout</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

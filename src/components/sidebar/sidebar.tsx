import { useWalletSelector } from '@/components/common/near-wallet/walletSelectorContext';
import { LOCAL_KEY } from '@/constant/constant';
import { useAuth } from '@/hooks';
import { reset } from '@/redux/contractSlice';
import { useAppDispatch } from '@/redux/hook';
import { setOpenSidebar } from '@/redux/userSlice';
import type { User } from '@/types';
import {
  ArrowLeftRight,
  CircleArrowRight,
  LayoutGrid,
  LogOut,
  WalletMinimal,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  show: boolean;
  userInfo: User;
}

const SidebarHeaderOption: React.FC<{
  label: string;
  icon: React.ReactNode;
}> = ({ label, icon }) => {
  return (
    <div className='bg-[#FEFEFE] rounded-xl border border-1 border-gray-200 p-3 cursor-pointer hover:bg-gray-100'>
      <div className='flex flex-col gap-1 justify-center items-center text-sorbet font-semibold'>
        <div>{icon}</div>
        <div className='text-sm'>{label}</div>
      </div>
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ show, userInfo }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { logout } = useAuth();
  const { modal: nearModal, selector } = useWalletSelector();

  const handleLogout = async () => {
    dispatch(reset());
    logout();
    router.push('/signin');
  };

  return (
    <div
      className={`fixed left-0 z-50 h-[100v] w-screen overflow-y-auto transition-opacity duration-300 ${
        show ? 'inset-0 bg-[#0C111D70] opacity-100' : 'opacity-0'
      }`}
      onClick={() => dispatch(setOpenSidebar(false))}
    >
      <div
        className={`right-0 z-50 m-6 flex h-[calc(100%-48px)] lg:w-[420px] sm:w-100 flex-col items-start justify-between gap-6 overflow-y-auto rounded-[32px] bg-[#F9FAFB] p-8 text-black ${
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
                  {userInfo?.profileImage ? (
                    <img
                      src={userInfo?.profileImage}
                      alt='logo'
                      className='rounded-full w-14 h-14'
                    />
                  ) : (
                    <img
                      src='/avatar.svg'
                      className='rounded-full w-14 h-14'
                      alt='logo'
                    />
                  )}
                </div>
                <div className='flex flex-col'>
                  <div className='text-base font-bold '>
                    {`${userInfo.firstName} ${userInfo.lastName}`}
                  </div>
                  <div className='text-base'>{userInfo?.accountId}</div>
                </div>
              </div>
            </div>
            <div>
              <div className='grid grid-cols-3 gap-2'>
                <div className='col-span-1'>
                  <SidebarHeaderOption
                    label='Wallet'
                    icon={<WalletMinimal />}
                  />
                </div>
                <div className='col-span-1'>
                  <SidebarHeaderOption label='My Gigs' icon={<LayoutGrid />} />
                </div>
                <div className='col-span-1'>
                  <SidebarHeaderOption
                    label='My Profile'
                    icon={<CircleArrowRight />}
                  />
                </div>
              </div>
              <div className='bg-white p-5 flex flex-col rounded-xl mt-3'>
                <div className='text-gray-600 font-light'>Balances</div>
                <div className='flex flex-col gap-3 mt-6'>
                  <div className='flex justify-between'>
                    <div className='flex flex-row gap-2'>
                      <Image
                        src='/svg/usdc.svg'
                        alt='USDC'
                        width={20}
                        height={20}
                      />
                      <div>2,000 USDC</div>
                    </div>
                    <div className='text-gray-600'>$2,000</div>
                  </div>
                  <div className='flex justify-between'>
                    <div className='flex flex-row gap-2'>
                      <Image
                        src='/svg/near-protocol.svg'
                        alt='USDC'
                        width={17}
                        height={17}
                      />
                      <div>15,346 NEAR</div>
                    </div>
                    <div className='text-gray-600'>$5,240</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-6 font-medium cursor-pointer text-xl'>
            <div className='flex flex-row gap-2 items-center'>
              <div>
                <ArrowLeftRight />
              </div>
              <div>Switch Wallet</div>
            </div>
            <div
              className='flex flex-row gap-2 items-center'
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

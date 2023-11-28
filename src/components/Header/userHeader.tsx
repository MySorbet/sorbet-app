/* eslint-disable @next/next/no-img-element */
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import './header.css';

import { useWalletSelector } from '@/components/commons/near-wallet/walletSelectorContext1';

import { LOCAL_KEY } from '@/constant/constant';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { reset } from '@/redux/userSlice';

const UserHeader = ({ popModal }: any) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const { modal: nearModal, selector } = useWalletSelector();
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.userReducer.user);
  const [showLogout, setShowLogout] = useState(false);

  const logout = async () => {
    dispatch(reset());
    if (userData?.email) {
      localStorage.removeItem(LOCAL_KEY);
      router.push('/signin');
    } else {
      const wallet = await selector.wallet();
      wallet
        .signOut()
        .then(() => {
          router.push('/signin');
        })
        .catch((err) => {
          console.error(err);
        });
    }
    showLogoutPage();
  };

  const showLogoutPage = () => {
    setShowLogout(!showLogout);
  };

  return (
    <div className='header-width fixed z-50 flex flex-col justify-center rounded-lg bg-white p-4'>
      <div className='self-strech flex h-10 items-center justify-between'>
        <div
          className='flex cursor-pointer items-center gap-2'
          onClick={() => router.push('/profile')}
        >
          <img src='/svg/logo.svg' alt='logo' width={34} height={34} />
          <div className='font-sans text-base font-semibold leading-normal text-[#6230EC]'>
            SORBET
          </div>
        </div>
        <div className='flex items-center gap-12 font-semibold max-sm:gap-4'>
          <div
            className={`hover:text-primary-default flex cursor-pointer flex-col items-start gap-1`}
            key={1}
            onClick={() => {
              router.push('/profile');
            }}
          >
            Profile
          </div>
          <div
            className={`hover:text-primary-default flex cursor-pointer flex-col items-start gap-1`}
            key={2}
            onClick={() => {
              router.push('/gigs');
            }}
          >
            Gigs
          </div>
          <div
            className={`hover:text-primary-default flex cursor-pointer flex-col items-start gap-1`}
            key={3}
            onClick={() => {
              router.push('/explore');
            }}
          >
            Explore
          </div>
        </div>
        <div className='relative flex' onClick={showLogoutPage}>
          {userData?.profileImage ? (
            <img
              src={userData.profileImage}
              alt='avatar'
              className='border-primary-default h-10 w-10 cursor-pointer rounded-full border-2'
            />
          ) : (
            <img
              src='/avatar.svg'
              alt='avatar'
              className='h-10 w-10 cursor-pointer'
            />
          )}
          {showLogout && (
            <div
              className='bg-primary-default absolute right-0 top-[50px] cursor-pointer rounded-lg px-4 py-2 text-white hover:opacity-70'
              onClick={logout}
            >
              Logout
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserHeader;

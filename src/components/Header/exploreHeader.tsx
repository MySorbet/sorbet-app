/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import './header.css';

import { useAppSelector } from '@/redux/hook';

const ExploreHeader = ({ popModal }: any) => {
  const router = useRouter();
  const user = useAppSelector((state) => state.userReducer.user);
  const [selected, setSelected] = useState('/signin');

  return (
    <div className='header-width fixed z-40 flex flex-col justify-center rounded-lg bg-white bg-white p-4'>
      <div className='self-strech flex h-10 items-center justify-between'>
        <div
          className='flex cursor-pointer items-center gap-2'
          onClick={() => router.push('/signin')}
        >
          <img src='/svg/logo.svg' alt='logo' width={34} height={34} />
          <div className='font-sans text-base font-semibold leading-normal text-[#6230EC]'>
            SORBET
          </div>
        </div>
        <div className='flex items-center gap-12 font-semibold max-sm:gap-4'>
          <div
            className={`hover:text-primary-default flex cursor-pointer flex-col items-start gap-1 ${
              selected == 'profile' &&
              'border-b-2 border-[#6230Ec] text-[#6230EC]'
            }`}
            key={1}
            onClick={() => {
              router.push('/profile');
            }}
          >
            Profile
          </div>
          <div
            className={`hover:text-primary-default flex cursor-pointer flex-col items-start gap-1 ${
              selected == 'gigs' && 'border-b-2 border-[#6230Ec] text-[#6230EC]'
            }`}
            key={2}
            onClick={() => {
              router.push('/gigs');
            }}
          >
            Gigs
          </div>
          <div
            className={`hover:text-primary-default flex cursor-pointer flex-col items-start gap-1 ${
              selected == 'explore' &&
              'border-b-2 border-[#6230Ec] text-[#6230EC]'
            }`}
            key={3}
            onClick={() => {
              router.push('/explore');
            }}
          >
            Explore
          </div>
        </div>
        {user.role == 'user' ? (
          <img src='/avatar.svg' alt='avatar' width={40} height={40} />
        ) : (
          <div className='flex opacity-100' onClick={popModal}>
            <button className='flex rounded-lg bg-[#6230EC] px-4 py-[10px] text-sm font-semibold leading-5 text-[#F2F2F4]'>
              Hire
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreHeader;

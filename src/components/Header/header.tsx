/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import { useAppDispatch } from '@/redux/hook';
import { setOpenSidebar } from '@/redux/userSlice';

const Header = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  // let isProfile = false;

  useEffect(() => {
    console.log(router, 'router');
  }, [router]);
  
  return (
    <div className='flex w-full justify-between px-8 py-4 bg-[#F9FAFB]'>
      <div className='flex gap-6'>
        <img src='/svg/logo.svg' alt='logo' width={44} height={44} />
      </div>
      <div className='flex items-center justify-end gap-4'>
        <img
          src='/images/menu.svg'
          alt='menu'
          className=' cursor-pointer p-[10px]'
          onClick={() => dispatch(setOpenSidebar(true))}
        />
      </div>
    </div>
  );
};

export default Header;

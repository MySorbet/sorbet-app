/* eslint-disable @next/next/no-img-element */
import { Notifications } from '@/components/header/notifications';
import { useAppDispatch } from '@/redux/hook';
import { setOpenSidebar } from '@/redux/userSlice';
import Link from 'next/link';
import React from 'react';

interface HeaderProps {
  isPublic?: boolean;
}

export const Header = ({ isPublic = false }: HeaderProps) => {
  const dispatch = useAppDispatch();

  return (
    <div className='bg-[#F2F3F7]'>
      <div className='flex w-full justify-between container mx-auto py-4'>
        <div className='flex gap-6'>
          <Link href='/'>
            <img src='/svg/logo.svg' alt='logo' width={44} height={44} />
          </Link>
        </div>
        {!isPublic && (
          <div className='flex items-center justify-end gap-4'>
            <div className='flex flex-row align-center gap-2 items-center'>
              <Notifications />
              <div>
                <img
                  src='/images/menu.svg'
                  alt='menu'
                  className='cursor-pointer p-[10px]'
                  onClick={() => dispatch(setOpenSidebar(true))}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

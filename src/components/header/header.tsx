'use client';

/* eslint-disable @next/next/no-img-element */
import menuImage from '/public/images/menu.svg';
import logoImage from '/public/svg/logo.svg';
import { Notifications } from '@/components/header/notifications';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks';
import { useAppDispatch } from '@/redux/hook';
import { setOpenSidebar } from '@/redux/userSlice';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

interface HeaderProps {
  isPublic?: boolean;
}

export const Header = ({ isPublic = false }: HeaderProps) => {
  const { user } = useAuth();

  const dispatch = useAppDispatch();

  const router = useRouter();

  return (
    <div className='bg-[#F2F3F7]'>
      <div className='flex w-full justify-between container mx-auto py-4'>
        <div className='flex gap-6'>
          <Link href='/'>
            <Image src={logoImage} alt='logo' width={44} height={44} />
          </Link>
        </div>
        {!isPublic && (
          <div className='flex items-center justify-end gap-4'>
            <div className='flex flex-row align-center gap-2 items-center'>
              <Notifications />
              <div>
                <Image
                  src={menuImage}
                  alt='menu'
                  className='cursor-pointer p-[10px]'
                  onClick={() => dispatch(setOpenSidebar(true))}
                />
              </div>
            </div>
          </div>
        )}
        {isPublic && !user && (
          <div className='flex items-center justify-end gap-4'>
            <Button
              onClick={() => router.push('/signup')}
              className='font-semibold text-sm text-[#344054] leading-5 py-[10px] px-[14px] bg-white border border-[#D0D5DD] hover:bg-gray-100'
            >
              Claim my Sorbet
            </Button>
            <Button
              onClick={() => router.push('/signin')}
              className='font-semibold text-sm text-white leading-5 py-[10px] px-[14px] bg-sorbet border border-[#7F56D9] hover:bg-[#523BDF]'
            >
              Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

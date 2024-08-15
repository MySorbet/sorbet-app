'use client';

import { ChevronDown, User01 } from '@untitled-ui/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks';
import { useAppDispatch } from '@/redux/hook';
import { setOpenSidebar } from '@/redux/userSlice';

import { Notifications } from './notifications';

interface HeaderProps {
  isPublic?: boolean;
}

/** Header for all pages */
export const Header = ({ isPublic = false }: HeaderProps) => {
  const { user } = useAuth();
  const profileImage = user?.profileImage;

  const dispatch = useAppDispatch();

  return (
    <div className='bg-[#F2F3F7]'>
      <div className='container mx-auto flex w-full justify-between py-4'>
        <div className='flex gap-6'>
          <Link href='/'>
            <Image src='/svg/logo.svg' alt='logo' width={44} height={44} />
          </Link>
        </div>
        {!isPublic && (
          <div className='flex items-center justify-end gap-4'>
            <div className='align-center flex flex-row items-center gap-2'>
              <Notifications />
              <div
                className='flex cursor-pointer flex-row items-center'
                onClick={() => dispatch(setOpenSidebar(true))}
              >
                <Avatar className='border-primary-default size-10 border-2'>
                  <AvatarImage src={profileImage} alt='profile image' />
                  <AvatarFallback>
                    <User01 className='text-muted-foreground' />
                  </AvatarFallback>
                </Avatar>
                <ChevronDown />
              </div>
            </div>
          </div>
        )}
        {isPublic && !user && <LoggedOutCTA />}
      </div>
    </div>
  );
};

/** Two CTA buttons if viewing a profile logged out. Sign up or sign in. */
const LoggedOutCTA = () => {
  const router = useRouter();

  return (
    <div className='flex items-center justify-end gap-4'>
      <Button
        onClick={() => router.push('/signup')}
        className='border border-[#D0D5DD] bg-white px-[14px] py-[10px] text-sm font-semibold leading-5 text-[#344054] hover:bg-gray-100'
      >
        Claim my Sorbet
      </Button>
      <Button
        onClick={() => router.push('/signin')}
        className='bg-sorbet border border-[#7F56D9] px-[14px] py-[10px] text-sm font-semibold leading-5 text-white hover:bg-[#523BDF]'
      >
        Login
      </Button>
    </div>
  );
};

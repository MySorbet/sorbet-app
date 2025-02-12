'use client';

import { Menu } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

import { Notifications } from '@/components/notifications';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import Logo from '~/svg/logo.svg';

/** Header for all pages */
export const Header = () => {
  const isMobile = useIsMobile();
  const { toggleSidebar } = useSidebar();
  return (
    <div className='flex h-fit w-full items-center justify-between gap-4 p-4'>
      {isMobile && (
        <Link href='/'>
          <Logo className='size-8' alt='Sorbet logo' />
        </Link>
      )}

      <Notifications className='ml-auto' />
      {isMobile && (
        <Button onClick={toggleSidebar} variant='ghost' size='icon'>
          <Menu className='size-6' />
        </Button>
      )}
    </div>
  );
};

/** Two CTA buttons if viewing a profile logged out. Sign up or sign in. */
const LoggedOutCTA = () => {
  const router = useRouter();
  const handleClick = () => {
    router.push('/signin');
  };

  return (
    <div className='flex items-center justify-end gap-4'>
      <Button
        onClick={handleClick}
        className='border border-[#D0D5DD] bg-white px-[14px] py-[10px] text-sm font-semibold leading-5 text-[#344054] hover:bg-gray-100'
      >
        Claim my Sorbet
      </Button>
      <Button
        onClick={handleClick}
        className='bg-sorbet border border-[#7F56D9] px-[14px] py-[10px] text-sm font-semibold leading-5 text-white hover:bg-[#523BDF]'
      >
        Login
      </Button>
    </div>
  );
};

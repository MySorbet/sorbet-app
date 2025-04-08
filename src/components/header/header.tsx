'use client';

import { Menu } from 'lucide-react';
import Link from 'next/link';
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

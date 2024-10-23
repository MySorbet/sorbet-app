'use client';

import { ChevronDown, User01 } from '@untitled-ui/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { Notifications } from '@/components/notifications';
import FeaturebaseWidget from '@/components/profile/featurebase-widget';
import { Sidebar } from '@/components/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks';

/** Header for all pages */
export const Header = () => {
  const { user } = useAuth();
  const profileImage = user?.profileImage;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className='container mx-auto flex w-full justify-between bg-[#F2F3F7] py-4'>
      <div className='flex gap-6'>
        <Link href='/'>
          <Image
            src='/svg/logo.svg'
            width={44}
            height={44}
            className='size-11'
            alt='Sorbet logo'
            priority
          />
        </Link>
      </div>
      {user && (
        <div className='flex items-center justify-end gap-4'>
          <div className='align-center flex flex-row items-center gap-2'>
            {/* <a
                href='https://mysorbet.featurebase.app/'
                target='_blank'
                rel='noreferrer'
              >
                <Button className='border border-[#D0D5DD] bg-white text-sm font-semibold text-[#344054] hover:bg-gray-100'>
                  Feedback
                </Button>
              </a> */}
            <FeaturebaseWidget />
            <Notifications />
            <div
              className='group flex cursor-pointer flex-row items-center'
              onClick={() => setIsSidebarOpen(true)}
            >
              <Avatar className='border-primary-default size-10 border-2'>
                <AvatarImage src={profileImage} alt='profile image' />
                <AvatarFallback>
                  <User01 className='text-muted-foreground' />
                </AvatarFallback>
              </Avatar>
              <ChevronDown className='transition ease-out group-hover:translate-y-1' />
              <Sidebar
                isOpen={isSidebarOpen}
                onIsOpenChange={setIsSidebarOpen}
              />
            </div>
          </div>
        </div>
      )}
      {!user && <LoggedOutCTA />}
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

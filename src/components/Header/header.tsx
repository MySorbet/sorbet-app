/* eslint-disable @next/next/no-img-element */
import { Notifications } from '@/components/header/notifications';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { useAppDispatch } from '@/redux/hook';
import { setOpenSidebar } from '@/redux/userSlice';
import { Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

export const Header = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  return (
    <div className='bg-[#F2F3F7]'>
      <div className='flex w-full justify-between container mx-auto py-4'>
        <div className='flex gap-6'>
          <img src='/svg/logo.svg' alt='logo' width={44} height={44} />
        </div>
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
      </div>
    </div>
  );
};

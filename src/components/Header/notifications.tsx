import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Bell } from 'lucide-react';
import React from 'react';

const NotificationItem = () => {
  return (
    <div className='bg-white p-4 rounded-xl shadow-[0_20px_120px_0_rgba(0,0,0,0.06)]'>
      <div className='flex flex-row gap-2'>
        <div className='bg-sorbet rounded-full w-[40px] h-[40px] flex justify-center align-center items-center text-gray-800 bg-[#F4F3FD]'>
          <Bell />
        </div>
        <div className='flex flex-col gap-1'>
          <div>Notification goes here</div>
          <div className='text-sm text-sorbet'>18 hours ago</div>
        </div>
      </div>
    </div>
  );
};

export const Notifications = () => {
  return (
    <div className='cursor-pointer'>
      <HoverCard>
        <HoverCardTrigger>
          <Bell size={22} />
        </HoverCardTrigger>
        <HoverCardContent
          align={'end'}
          className='flex flex-col gap-2 mt-2 min-w-[80vw] lg:min-w-[22vw] md:min-w-[30vw] rounded-xl shadow-[8.727272987365723px_8.727272987365723px_60px_0_rgba(0,0,0,0.2)] bg-[#F9FAFB]'
        >
          <NotificationItem />
          <NotificationItem />
          <NotificationItem />
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

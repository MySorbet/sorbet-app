'use client';

import { useState } from 'react';

import { useIsMobile } from '@/hooks/use-is-mobile';

import { type TaskType, ChecklistCard } from './checklist-card';
import { OpenOnDesktopDrawer } from './open-on-desktop-drawer';
import { type StatsCardType, StatsCard } from './stats-card';
import { WelcomeCard } from './welcome-card';

export const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const handleCardClicked = (type: StatsCardType | TaskType) => {
    if (isMobile) {
      setOpen(true);
    } else {
      alert(type);
    }
  };

  return (
    <>
      {/* Conditionally rendered drawer for mobile clicks */}
      <OpenOnDesktopDrawer open={open} onClose={() => setOpen(false)} />

      {/* Fluid dashboard layout */}
      <div className='@container @lg:grid-cols-[minmax(0,1fr),300px] grid h-fit w-full max-w-5xl grid-cols-1 gap-4'>
        <WelcomeCard name='Rami' className='@lg:col-span-2' />

        <ChecklistCard
          className='h-full min-w-64'
          onTaskClick={handleCardClicked}
        />

        <div className='flex h-full min-w-[240px] flex-col justify-between gap-4'>
          <StatsCard
            title='Wallet balance'
            type='wallet'
            value='$0'
            description='Total'
            onClick={() => handleCardClicked('wallet')}
          />
          <StatsCard
            title='Invoice Sales'
            type='invoice'
            value='$0'
            description='Total income'
            onClick={() => handleCardClicked('invoice')}
          />
          <StatsCard
            title='Profile Views'
            type='profile'
            value='0'
            description='Unique visitors'
            onClick={() => handleCardClicked('profile')}
          />
        </div>
      </div>
    </>
  );
};

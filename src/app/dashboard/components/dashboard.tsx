import { useState } from 'react';

import { type TaskType, ChecklistCard } from './checklist-card';
import { OpenOnDesktopDrawer } from './open-on-desktop-drawer';
import { type StatsCardType, StatsCard } from './stats-card';
import { WelcomeCard } from './welcome-card';

export const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const handleCardClicked = (type: StatsCardType | TaskType) => {
    // TODO: Only do this if the user is on mobile, otherwise take the appropriate action
    setOpen(true);
  };

  return (
    <>
      <OpenOnDesktopDrawer open={open} onClose={() => setOpen(false)} />
      <div className='@container @lg:grid-cols-[minmax(0,1fr),300px] grid grid-cols-1 gap-4'>
        <div className='@lg:col-span-2'>
          <WelcomeCard name='Rami' />
        </div>

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

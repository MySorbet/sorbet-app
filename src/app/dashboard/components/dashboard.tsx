import { ChecklistCard } from './checklist-card';
import { StatsCard } from './stats-card';
import { WelcomeCard } from './welcome-card';

export const Dashboard = () => {
  return (
    <div className='@container @lg:grid-cols-[minmax(0,1fr),300px] grid grid-cols-1 gap-4'>
      <div className='@lg:col-span-2'>
        <WelcomeCard name='Rami' />
      </div>

      <ChecklistCard className='h-full min-w-64' />

      <div className='flex h-full min-w-[240px] flex-col justify-between gap-4'>
        <StatsCard
          title='Wallet balance'
          type='wallet'
          value='$0'
          description='Total'
        />
        <StatsCard
          title='Invoice Sales'
          type='invoice'
          value='$0'
          description='Total income'
        />
        <StatsCard
          title='Profile Views'
          type='profile'
          value='0'
          description='Unique visitors'
        />
      </div>
    </div>
  );
};

'use client';

import { AccountVerificationCard } from './account-verification-card';
import { FAQ } from './faq';
import { KYCChecklist } from './kyc-checklist';

export const VerifyDashboard = () => {
  const handleTaskClick = (task: 'terms' | 'details') => {
    // TODO: Implement task click handling
    console.log('Task clicked:', task);
  };

  return (
    <div className='@container @xl:grid-cols-[minmax(0,1fr),300px] grid h-fit w-full max-w-5xl grid-cols-2 gap-4'>
      <div className='@xl:col-span-1 col-span-2 flex flex-col gap-4'>
        <AccountVerificationCard className='h-fit' />
        <FAQ className='h-fit' />
      </div>
      <KYCChecklist onTaskClick={handleTaskClick} className='h-fit' />
    </div>
  );
};

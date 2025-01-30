'use client';

import { useState } from 'react';

import { AccountVerificationCard } from './account-verification-card';
import { FAQ } from './faq';
import { KYCChecklist, VerifyStep } from './kyc-checklist';

export const VerifyDashboard = () => {
  // Step currently represents what step of verification we are displaying regardless of bridge customer status
  // TODO: Maybe we should consider driving step from bridge customer status?
  const [step, setStep] = useState<VerifyStep | 'complete'>();

  const handleTaskClick = (newStep: VerifyStep) => {
    // TODO: Restrict to only allow moving forward in the checklist
    setStep(newStep);
  };

  return (
    <div className='@container @xl:grid-cols-[minmax(0,1fr),300px] grid h-fit w-full max-w-5xl grid-cols-2 gap-4'>
      <div className='@xl:col-span-1 col-span-2 flex flex-col gap-4'>
        <AccountVerificationCard
          className='h-fit'
          step={step}
          onStepChange={setStep}
        />
        <FAQ className='h-fit' />
      </div>
      <KYCChecklist
        onTaskClick={handleTaskClick}
        className='h-fit'
        // TODO: This is not the right way to determine completion. This should come from the bridge customer
        completedTasks={{
          terms: step === 'details' || step === 'complete',
          details: step === 'complete',
        }}
      />
    </div>
  );
};

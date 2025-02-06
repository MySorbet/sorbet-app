'use client';

import { useEffect, useState } from 'react';

import { useBridgeCustomer } from '@/hooks/profile/use-bridge-customer';
import { KYCStatus } from '@/types';

import { AccountVerificationCard } from './account-verification-card';
import { FAQ } from './faq';
import { KYCChecklist, VerifyStep } from './kyc-checklist';

const kycCompletedStates: KYCStatus[] = [
  'pending',
  'incomplete',
  'awaiting_ubo',
  'manual_review',
  'under_review',
  'approved',
  // 👇 These are the only states that will render the checklist incomplete
  // 'not_started',
  // 'rejected',
];

export const VerifyDashboard = () => {
  // Step currently represents what step of verification we are displaying regardless of bridge customer status
  // TODO: Maybe we should consider driving step from bridge customer status?
  const [step, setStep] = useState<'get-verified' | VerifyStep | 'complete'>(
    'get-verified'
  );

  // TODO: This is competing with the below step driver
  // Drive step from child callbacks
  // const handleStepComplete = (
  //   step: VerifyStep | 'complete' | 'get-verified'
  // ) => {
  //   if (step === 'get-verified') {
  //     setStep('terms');
  //     return;
  //   }

  //   if (step === 'terms') {
  //     setStep('details');
  //     return;
  //   }

  //   if (step === 'details') {
  //     // TODO: Set indeterminate and poll the bridge customer? Or should this happen 1 level lower
  //     setStep('complete');
  //     return;
  //   }
  // };

  const handleTaskClick = (newStep: VerifyStep) => {
    // TODO: Restrict to only allow moving forward in the checklist
    setStep(newStep);
  };

  const { data: bridgeCustomer, isLoading } = useBridgeCustomer();

  // Drive step from bridge customer status
  useEffect(() => {
    if (isLoading) {
      return;
    }

    // Goto step 0 if there is no bridge customer
    if (!bridgeCustomer) {
      setStep('get-verified');
      return;
    }

    // Goto terms if the customer has not approved the terms
    if (bridgeCustomer.tos_status === 'pending') {
      setStep('terms');
      return;
    }

    // Goto complete if the customer has approved the kyc
    if (!kycCompletedStates.includes(bridgeCustomer.kyc_status)) {
      setStep('details');
      return;
    }

    // Getting here implies that TOS is complete and kyc is approved
    setStep('complete');
  }, [bridgeCustomer, isLoading]);

  return (
    <div className='@container @xl:grid-cols-[minmax(0,1fr),300px] grid h-fit w-full max-w-5xl grid-cols-2 gap-4'>
      <div className='@xl:col-span-1 col-span-2 flex flex-col gap-4'>
        <AccountVerificationCard
          className='h-fit'
          step={step}
          // onStepComplete={handleStepComplete}
          isLoading={isLoading}
          tosLink={bridgeCustomer?.tos_link}
          kycLink={bridgeCustomer?.kyc_link}
        />
        <FAQ className='h-fit' />
      </div>
      <KYCChecklist
        onTaskClick={handleTaskClick}
        loading={isLoading}
        className='h-fit'
        completedTasks={{
          terms: bridgeCustomer?.tos_status === 'approved',
          details:
            bridgeCustomer !== undefined &&
            kycCompletedStates.includes(bridgeCustomer.kyc_status),
        }}
      />
    </div>
  );
};

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

type AllSteps = 'get-verified' | VerifyStep | 'complete';

export const VerifyDashboard = () => {
  // Step currently represents what step of verification we are displaying regardless of bridge customer status
  // TODO: Maybe we should consider driving step from bridge customer status?
  const [step, setStep] = useState<AllSteps>('get-verified');

  const handleTaskClick = (newStep: VerifyStep) => {
    // TODO: Restrict to only allow moving forward in the checklist
    setStep(newStep);
  };

  // We need this to handle the transition from details to complete
  const [isIndeterminate, setIsIndeterminate] = useState(false);
  const handleStepComplete = (step: AllSteps) => {
    // Ignore all reported step transitions except for details to complete
    if (step === 'details') {
      setIsIndeterminate(true);
      // TODO: Poll
      // Use effect below will drive the step to complete
    }
  };

  const { data: customer, isLoading } = useBridgeCustomer();

  // Drive step from bridge customer status
  useEffect(() => {
    if (isLoading) {
      return;
    }

    // Goto step 0 if there is no bridge customer
    if (!customer) {
      setStep('get-verified');
      return;
    }

    // Goto terms if the customer has not approved the terms
    if (customer.tos_status === 'pending') {
      setStep('terms');
      return;
    }

    // Goto complete if the customer has approved the kyc
    if (!kycCompletedStates.includes(customer.kyc_status)) {
      setStep('details');
      return;
    }

    // Getting here implies that TOS is complete and kyc is approved
    setStep('complete');
  }, [customer, isLoading]);

  return (
    <div className='@container @xl:grid-cols-[minmax(0,1fr),300px] grid h-fit w-full max-w-5xl grid-cols-2 gap-4'>
      <div className='@xl:col-span-1 col-span-2 flex flex-col gap-4'>
        <AccountVerificationCard
          className='h-fit'
          step={step}
          onStepComplete={handleStepComplete}
          isLoading={isLoading}
          tosLink={customer?.tos_link}
          kycLink={customer?.kyc_link}
          isIndeterminate={isIndeterminate}
          rejectionReasons={customer?.rejection_reasons?.map(
            (reason) => reason.reason
          )}
        />
        <FAQ className='h-fit' />
      </div>
      <KYCChecklist
        onTaskClick={handleTaskClick}
        loading={isLoading}
        className='h-fit'
        indeterminate={isIndeterminate}
        completedTasks={{
          terms: customer?.tos_status === 'approved',
          details:
            customer !== undefined &&
            kycCompletedStates.includes(customer.kyc_status),
        }}
      />
    </div>
  );
};

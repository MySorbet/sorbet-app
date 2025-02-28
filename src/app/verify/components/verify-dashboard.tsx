'use client';

import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useBridgeCustomer } from '@/hooks/profile/use-bridge-customer';
import { useScopedLocalStorage } from '@/hooks/use-scoped-local-storage';
import { KYCStatus } from '@/types';

import { AccountVerificationCard } from './account-verification-card';
import { FAQ } from './faq';
import { KYCChecklist, VerifyStep } from './kyc-checklist';

const kycCompletedStates: KYCStatus[] = [
  // Complete but waiting for approval
  'manual_review',
  'under_review',
  'awaiting_ubo', // never happens for individuals

  // Actually completed
  'approved',

  // We consider rejected to be a complete state, then allow the user to retry
  'rejected',

  // 👇 These are the only states that will render the checklist incomplete
  // 'pending',
  // 'not_started',

  // 'incomplete',
];

export type AllSteps = 'begin' | VerifyStep | 'complete';

export const VerifyDashboard = () => {
  const [step, setStep] = useState<AllSteps>('begin');

  const handleTaskClick = (newStep: VerifyStep) => {
    // This conditional allows the user to retry adding details if they need to
    if (newStep === 'details') {
      setIsIndeterminate(false);
    }
    setStep(newStep);
  };

  // We need this to handle the transition from details to complete
  const [isIndeterminate, setIsIndeterminate] = useScopedLocalStorage(
    'verification-indeterminate',
    false
  );

  const handleStepComplete = (step: AllSteps) => {
    // Ignore all reported step transitions except for details to complete
    if (step === 'details') {
      setIsIndeterminate(true);
      // Use effect below will drive the step to complete since the bridge customer is refetched
    }
  };

  const { data: customer, isLoading } = useBridgeCustomer({
    // TODO: Optimization? We could only refetch in the indeterminate state
    refetchInterval: 10000, // 10s
    retry: (_, error) => {
      // Only retry if the error is not a 404
      return !(isAxiosError(error) && error.status === 404);
    },
  });

  // Drive step from bridge customer status
  useEffect(() => {
    if (isLoading) {
      return;
    }

    // Goto step 0 if there is no bridge customer
    if (!customer) {
      setStep('begin');
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

    // Getting here implies that TOS is complete and kyc is approved, rejected, or under review
    setStep('complete');
    setIsIndeterminate(false);
  }, [customer, isLoading, setIsIndeterminate]);

  const isUnderReview =
    customer?.kyc_status === 'under_review' ||
    customer?.kyc_status === 'manual_review' ||
    customer?.kyc_status === 'awaiting_ubo';

  const router = useRouter();
  const handleCallToActionClick = (type: 'retry' | 'create-invoice') => {
    if (type === 'retry') {
      setStep('details');
      // TODO: This leads to a strange state where the UI is in the "details" step
      // But the bridge customer is rejected. So a mis match of UI is displayed.
      // Whats worse, is that the customer -> step effect is not triggered (as refetch gives a 304),
      // but if data is changed on the bridge customer, the effect sets the step to complete, causing the user to lose KYC progress.
    } else if (type === 'create-invoice') {
      router.push('/invoices/create');
    }
  };

  return (
    <div className='@container @2xl:grid-cols-[minmax(0,1fr),300px] grid h-fit w-full max-w-5xl grid-cols-2 gap-4'>
      <div className='@2xl:col-span-1 col-span-2 flex flex-col gap-4'>
        <AccountVerificationCard
          className='h-fit'
          step={step}
          onStepComplete={handleStepComplete}
          isLoading={isLoading}
          tosLink={customer?.tos_link}
          kycLink={customer?.kyc_link}
          isIndeterminate={isIndeterminate}
          isRejected={customer?.kyc_status === 'rejected'}
          isUnderReview={isUnderReview}
          rejectionReasons={customer?.rejection_reasons?.map(
            (reason) => reason.reason
          )}
          onCallToActionClick={handleCallToActionClick}
        />
        <FAQ className='h-fit' />
      </div>
      <KYCChecklist
        onTaskClick={handleTaskClick}
        loading={isLoading}
        className='@2xl:col-span-1 col-span-2 h-fit w-full'
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

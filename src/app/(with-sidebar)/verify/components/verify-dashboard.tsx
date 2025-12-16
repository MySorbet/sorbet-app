'use client';

import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useUnlessMobile } from '@/components/common/open-on-desktop-drawer/unless-mobile';
import { useBridgeCustomer } from '@/hooks/profile/use-bridge-customer';
import { useScopedLocalStorage } from '@/hooks/use-scoped-local-storage';
import { CustomerStatus } from '@/types';

import { AccountVerificationCard } from './account-verification-card';
import { FAQ } from './faq';
import { KYCChecklist, VerifyStep } from './kyc-checklist';

const kycCompletedStates: CustomerStatus[] = [
  // Complete but waiting for approval
  'under_review',

  // Actually completed
  'active',

  // We consider rejected to be a complete state, then allow the user to retry
  'rejected',
  'paused', // TODO: Should we handle this differently?
  'offboarded', // TODO: Should we handle this differently?

  // 👇 These are the only states that will render the checklist incomplete
  // 'not_started',
  // 'incomplete',
  // 'awaiting_questionnaire', // never happens for individuals. Not sure what this state means but seems like it should be interpreted as incomplete
  // 'awaiting_ubo', // never happens for individuals (waiting on UBOs to complete links in email)
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

  const { data: bridgeCustomer, isLoading } = useBridgeCustomer({
    // TODO: Optimization? We could only refetch in the indeterminate state
    refetchInterval: 10000, // 10s
    retry: (_, error) => {
      // Only retry if the error is not a 404
      return !(isAxiosError(error) && error.status === 404);
    },
  });

  const customer = bridgeCustomer?.customer;

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
    if (!customer.has_accepted_terms_of_service) {
      setStep('terms');
      return;
    }

    // Goto complete if the customer has approved the kyc
    if (customer.status !== 'active') {
      setStep('details');
      return;
    }

    // Getting here implies that TOS is complete and kyc is approved, rejected, or under review
    setStep('complete');
    setIsIndeterminate(false);
  }, [customer, isLoading, setIsIndeterminate]);
  const router = useRouter();
  const unlessMobile = useUnlessMobile();
  const handleCallToActionClick = (type: 'retry' | 'create-invoice') => {
    if (type === 'retry') {
      setStep('details');
      // TODO: This leads to a strange state where the UI is in the "details" step
      // But the bridge customer is rejected. So a mis match of UI is displayed.
      // Whats worse, is that the customer -> step effect is not triggered (as refetch gives a 304),
      // but if data is changed on the bridge customer, the effect sets the step to complete, causing the user to lose KYC progress.
    } else if (type === 'create-invoice') {
      unlessMobile(() => router.push('/invoices/create'));
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
          tosLink={bridgeCustomer?.tos_link}
          kycLink={bridgeCustomer?.kyc_link}
          isIndeterminate={isIndeterminate}
          isRejected={customer?.status === 'rejected'}
          isUnderReview={customer?.status === 'under_review'}
          isAwaitingUBO={customer?.status === 'awaiting_ubo'}
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
        isRejected={customer?.status === 'rejected'}
        rejectionReasons={customer?.rejection_reasons}
        completedTasks={{
          terms: customer?.has_accepted_terms_of_service ?? false,
          details:
            !!customer &&
            kycCompletedStates.includes(customer.status) &&
            customer.status !== 'rejected',
        }}
      />
    </div>
  );
};

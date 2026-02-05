'use client';

import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useUnlessMobile } from '@/components/common/open-on-desktop-drawer/unless-mobile';
import { useBridgeCustomer } from '@/hooks/profile/use-bridge-customer';
import { useScopedLocalStorage } from '@/hooks/use-scoped-local-storage';
import { CustomerStatus } from '@/types';

import { SetupCard } from '../../dashboard/components/setup-card';
import { useDashboardData } from '../../dashboard/hooks/use-dashboard-data';
import { AccountVerificationCard } from './account-verification-card';
import { FAQ } from './faq';
import { VerifyStep } from './kyc-checklist';

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

  // Track if user is manually retrying (to prevent useEffect from overriding step)
  const [isRetrying, setIsRetrying] = useState(false);

  // We need this to handle the transition from details to complete
  const [isIndeterminate, setIsIndeterminate] = useScopedLocalStorage(
    'verification-indeterminate',
    false
  );

  const handleStepComplete = (step: AllSteps) => {
    // Ignore all reported step transitions except for details to complete
    if (step === 'details') {
      setIsIndeterminate(true);
      setIsRetrying(false); // Reset retry mode when KYC is completed
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

    // Don't override step if user is actively retrying KYC
    if (isRetrying) {
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

    // Goto details if the customer has not completed kyc (not in a completed state)
    if (!kycCompletedStates.includes(customer.status)) {
      setStep('details');
      return;
    }

    // Getting here implies that TOS is complete and kyc is in a completed state (active, rejected, under_review, etc.)
    setStep('complete');
    setIsIndeterminate(false);
  }, [customer, isLoading, setIsIndeterminate, isRetrying]);

  const router = useRouter();
  const unlessMobile = useUnlessMobile();

  // Dashboard data for SetupCard
  const { data: dashboardData, isLoading: isDashboardLoading } =
    useDashboardData();
  const completedTasks = dashboardData?.tasks;

  // Derive display conditions for SetupCard
  const kycStatus = customer?.status;
  const isKycVerified = kycStatus === 'active';
  const hasCreatedInvoice = completedTasks?.invoice ?? false;
  const showSetupCard = !(isKycVerified && hasCreatedInvoice);

  const handleCallToActionClick = (type: 'retry' | 'create-invoice') => {
    if (type === 'retry') {
      setIsIndeterminate(false);
      setIsRetrying(true); // Prevent effect from overriding step during retry
      setStep('details');
    } else if (type === 'create-invoice') {
      unlessMobile(() => router.push('/invoices/create'));
    }
  };

  return (
    <div className='flex w-full max-w-5xl flex-col gap-4'>
      {/* SetupCard - Stepper at top */}
      {showSetupCard && (
        <SetupCard
          completedTasks={completedTasks}
          kycStatus={kycStatus}
          loading={isLoading || isDashboardLoading}
        />
      )}

      {/* AccountVerificationCard */}
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
        isIncomplete={customer?.status === 'incomplete'}
        isAwaitingUBO={customer?.status === 'awaiting_ubo'}
        rejectionReasons={customer?.rejection_reasons?.map(
          (reason) => reason.reason
        )}
        onCallToActionClick={handleCallToActionClick}
      />

      {/* FAQ */}
      <FAQ className='h-fit' />
    </div>
  );
};

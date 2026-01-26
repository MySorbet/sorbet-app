'use client';

import { isAxiosError } from 'axios';
import { useEffect, useState } from 'react';

import { useDueCustomer } from '@/hooks/profile/use-due-customer';
import { env } from '@/lib/env';

import { DueAccountVerificationCard } from './due-account-verification-card';
import { DueFAQ } from './due-faq';

type DueVerifyStep = 'begin' | 'terms' | 'details' | 'complete';

const kycCompleteStates = ['approved', 'failed', 'rejected'];
const kycPendingStates = ['pending', 'under_review', 'in_review'];

const buildDueUrl = (path?: string) => {
  if (!path) return undefined;
  try {
    return new URL(path, env.NEXT_PUBLIC_DUE_BASE_URL).toString();
  } catch {
    return path;
  }
};

export const DueVerifyDashboard = () => {
  const [step, setStep] = useState<DueVerifyStep>('begin');

  const { data: dueCustomer, isLoading } = useDueCustomer({
    refetchInterval: 10000,
    retry: (_, error) => {
      return !(isAxiosError(error) && error.status === 404);
    },
  });

  const account = dueCustomer?.account;
  const tosStatus = account?.tos?.status;
  const kycStatus = account?.kyc?.status;

  useEffect(() => {
    if (isLoading) return;

    if (!account) {
      setStep('begin');
      return;
    }

    if (tosStatus !== 'accepted') {
      setStep('terms');
      return;
    }

    if (!kycStatus || !kycCompleteStates.includes(kycStatus)) {
      setStep('details');
      return;
    }

    setStep('complete');
  }, [account, isLoading, tosStatus, kycStatus]);

  const tosLink = buildDueUrl(account?.tos?.link);
  const kycLink = buildDueUrl(account?.kyc?.link);

  return (
    <div className='flex flex-col gap-4 w-full max-w-5xl'>
      <DueAccountVerificationCard
        className='h-fit'
        step={step}
        isLoading={isLoading}
        tosLink={tosLink}
        kycLink={kycLink}
        isIndeterminate={kycStatus ? kycPendingStates.includes(kycStatus) : false}
        isRejected={kycStatus === 'failed' || kycStatus === 'rejected'}
      />

      <DueFAQ className='h-fit' />
    </div>
  );
};

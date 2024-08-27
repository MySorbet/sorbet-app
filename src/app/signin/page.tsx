'use client';
// TODO: Remove use client and fix trickle down errors

import { OnboardingShell } from '@/components/onboarding';
import { PrivyLogin } from '@/components/onboarding/privy-login';

const SignInPage = () => {
  return (
    <OnboardingShell>
      <PrivyLogin />
    </OnboardingShell>
  );
};

export default SignInPage;

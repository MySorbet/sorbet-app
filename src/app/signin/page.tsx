'use client';
// TODO: Remove use client and fix trickle down errors

import { OnboardingShell, SignIn } from '@/components/onboarding';

const SignInPage = () => {
  return (
    <OnboardingShell>
      <SignIn />
    </OnboardingShell>
  );
};

export default SignInPage;

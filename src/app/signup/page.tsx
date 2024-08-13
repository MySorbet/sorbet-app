'use client';
// TODO: Remove use client and fix trickle down errors

import { OnboardingShell, SignUp } from '@/components/onboarding';

const SignUpPage = () => {
  return (
    <OnboardingShell>
      <SignUp />
    </OnboardingShell>
  );
};

export default SignUpPage;

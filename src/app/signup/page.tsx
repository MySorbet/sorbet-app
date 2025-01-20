import { Metadata } from 'next';

import { OnboardingShell, SignUp } from '@/components/onboarding';

export const metadata: Metadata = {
  title: 'Create your account',
};

const SignUpPage = () => {
  return (
    <OnboardingShell>
      <SignUp />
    </OnboardingShell>
  );
};

export default SignUpPage;

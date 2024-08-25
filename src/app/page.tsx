'use client';

import { OnboardingShell } from '@/components';
import { PrivyLogin } from '@/components/onboarding/privy-login';

const Home = () => {
  return (
    <OnboardingShell>
      <PrivyLogin />
    </OnboardingShell>
  );
};

export default Home;

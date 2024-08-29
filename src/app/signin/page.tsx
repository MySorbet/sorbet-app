'use client';
// TODO: Remove use client and fix trickle down errors

import Image from 'next/image';

import { OnboardingShell } from '@/components';
import { PrivyLoginButtons } from '@/components/onboarding/privy-login-buttons';
import HeroBlob from '~/login-hero-blob.png';

const SignInPage = () => {
  return (
    <OnboardingShell renderUnderAuthHero={() => <PrivyLoginButtons />}>
      <Image
        src={HeroBlob}
        alt='an abstract blob illustration'
        width={834}
        height={782}
        className='drop-shadow-xl'
      />
    </OnboardingShell>
  );
};

export default SignInPage;

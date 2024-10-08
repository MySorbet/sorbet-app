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
        width={2720}
        height={2843}
        className='max-h-[500px] select-none drop-shadow-xl'
        draggable='false'
      />
    </OnboardingShell>
  );
};

export default SignInPage;

'use client'; // TODO: Remove use client and fix trickle down errors

import Image from 'next/image';

import { SigninContent } from '@/app/signin/components/signin-content';
import { OnboardingShell } from '@/components';
import { PrivyLoginButtons } from '@/components/onboarding/privy-login-buttons';
import { featureFlags } from '@/lib/flags';
import HeroBlob from '~/images/login-hero-blob.png';

const SignInPage = () => {
  return featureFlags.dashboard ? (
    <div className='bg-background flex size-full items-center justify-center'>
      <SigninContent />
    </div>
  ) : (
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

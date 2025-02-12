'use client';

import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import posthog from 'posthog-js';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks';
import { featureFlags } from '@/lib/flags';

type PressedButton = 'login' | 'signup';

/** Two buttons which launch the Privy login/signup dialog. */
export const SigninContent = () => {
  const { login, loading } = useAuth();

  // Track which button was pressed so we can show a loading spinner accordingly.
  const [pressedButton, setPressedButton] = useState<PressedButton>();
  const handleClick = (button: PressedButton) => {
    setPressedButton(button);
    login();
    if (featureFlags.sessionReplay) {
      posthog.startSessionRecording();
    }
  };
  const loginLoading = loading && pressedButton === 'login';
  const signupLoading = loading && pressedButton === 'signup';

  return (
    <div className='container flex max-w-96 flex-col items-center justify-center gap-14'>
      {/* Logo and title */}
      <div className='flex flex-col items-center justify-center gap-6'>
        <SorbetLogo />
        <h1 className='text-center text-2xl font-semibold'>
          Global payment experience for freelancers
        </h1>
      </div>

      {/* Buttons */}
      <div className='flex w-full flex-col gap-3'>
        <Button
          onClick={() => handleClick('signup')}
          disabled={loading}
          variant='sorbet'
        >
          {signupLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}{' '}
          Get started with Sorbet
        </Button>
        <Button
          onClick={() => handleClick('login')}
          disabled={loading}
          variant='secondary'
        >
          {loginLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}{' '}
          Sign in
        </Button>
      </div>
    </div>
  );
};

/** The most up to date Sorbet logo */
const SorbetLogo = () => {
  return (
    <div className='flex items-center justify-center gap-2'>
      <Image
        src='/svg/logo.svg'
        width={40}
        height={40}
        className='size-10'
        alt='Sorbet'
        priority
      />
      <span className='text-sorbet text-sm font-semibold tracking-wide'>
        SORBET
      </span>
    </div>
  );
};

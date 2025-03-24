'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { FC, useEffect } from 'react';

import MutedSorbetLogo from '~/svg/muted-sorbet-logo.svg';

/**
 * Renders a full page splash screen displaying a muted Sorbet logo that fades in and up - gmail style.
 *
 * Should be used to display a splash screen while the user is redirected to the appropriate page
 * based on their authentication status.
 *
 * 1. Wait until privy is ready
 * 2. If authenticated and there is a user, redirect to the user's handle
 * 3. If authenticated and there is no user, do nothing and console error
 * 4. If not authenticated, redirect to signin
 */
export const Splash: FC = () => {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready) {
      if (authenticated) {
        router.push('/dashboard');
      } else {
        router.push('/signin');
      }
    }
  }, [ready, authenticated, router]);

  return (
    <div className='flex size-full items-center justify-center'>
      <MutedSorbetLogo className='animate-in slide-in-from-bottom-10 fade-in-10 duration-5000 size-44' />
    </div>
  );
};

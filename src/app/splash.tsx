'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { FC, useEffect } from 'react';

import { useAuth } from '@/hooks';
import { featureFlags } from '@/lib/flags';
import MutedSorbetLogo from '~/muted-sorbet-logo.svg';

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
const Splash: FC = () => {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (ready) {
      if (authenticated) {
        if (featureFlags.dashboard) {
          console.log('routing to dashboard');
          router.push('/dashboard');
        } else if (user?.handle) {
          console.log('routing to ' + user.handle);
          router.push(`/${user.handle}`);
        } else {
          console.error('No user handle found');
        }
      } else {
        router.push('/signin');
      }
    }
  }, [ready, authenticated, router, user?.handle]);

  return (
    <div className='flex h-full w-full items-center justify-center'>
      <MutedSorbetLogo className='animate-in slide-in-from-bottom-10 fade-in-10 duration-5000 size-44' />
    </div>
  );
};

export default Splash;

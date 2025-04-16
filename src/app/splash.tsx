'use client';

import { usePrivy } from '@privy-io/react-auth';
import { motion } from 'motion/react';
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
 * 2. If authenticated and there is a user, redirect to the user's dashboard
 * 3. If not authenticated, redirect to signin
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
      <div className='space-y-4 text-center'>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 5, type: 'spring', bounce: 0 }}
        >
          <MutedSorbetLogo className='mx-auto size-32' />
        </motion.div>
        <motion.div
          className='text-muted-foreground text-sm'
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 5, type: 'spring', bounce: 0 }}
        >
          Getting your dashboard ready...
        </motion.div>
      </div>
    </div>
  );
};

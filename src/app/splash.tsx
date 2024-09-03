'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { FC, PropsWithChildren, useEffect } from 'react';

import { useAuth } from '@/hooks';
import MutedLogo from '~/muted-logo.svg';

const Splash: FC<PropsWithChildren> = (props) => {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (ready) {
      if (authenticated) {
        if (user?.handle) {
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
      <MutedLogo className='animate-in slide-in-from-bottom-10 fade-in-10 duration-5000 size-44' />
    </div>
  );
};

export default Splash;

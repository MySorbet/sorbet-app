'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { type FC, PropsWithChildren, useEffect } from 'react';

export const Authenticated: FC<PropsWithChildren> = ({ children }) => {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();

  // Redirect to splash if not authenticated.
  // TODO: Revisit auth strategy and how this plays with Splash and useAuth
  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/');
    }
  }, [ready, authenticated, router]);

  return ready && authenticated ? <>{children}</> : null;
};

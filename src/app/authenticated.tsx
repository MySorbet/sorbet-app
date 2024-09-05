'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { type FC, PropsWithChildren, useEffect } from 'react';

const Authenticated: FC<PropsWithChildren> = ({ children }) => {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();

  // Redirect to splash if not authenticated.
  // TODO: Revisit auth strategy and how this plays with Splash, Container, and useAuth
  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/');
    }
  }, [ready, authenticated, router]);

  return <>{children}</>;
};

export default Authenticated;

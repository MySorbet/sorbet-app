'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { type FC, PropsWithChildren, useEffect } from 'react';

const Container: FC<PropsWithChildren> = ({ children }) => {
  // const { user, accessToken, checkAuth, appLoading, logout } = useAuth();

  const { ready, authenticated } = usePrivy();

  const router = useRouter();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/');
    }
  }, [ready, authenticated, router]);

  return <>{children}</>;
};

export default Container;

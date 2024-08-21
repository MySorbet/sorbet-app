'use client';

import { useRouter } from 'next/navigation';
import { type FC, PropsWithChildren, useEffect } from 'react';

import { Loading } from '@/components/common';
import { useAuth } from '@/hooks/useAuth';
import { getAccessToken, usePrivy } from '@privy-io/react-auth';

const Container: FC<PropsWithChildren> = ({ children }) => {
  // const { user, accessToken, checkAuth, appLoading, logout } = useAuth();

  const { ready, authenticated, user, logout } = usePrivy();

  const router = useRouter();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/');
    }
  }, [ready, authenticated, router]);

  // useEffect(() => {
  //   (async () => {
  //     if (accessToken) {
  //       const user = await checkAuth();
  //       if (!user) {
  //         logout();
  //         router.push('/signin');
  //       }
  //     } else {
  //       router.push('/signin');
  //     }
  //   })();
  // }, [router, accessToken]);

  return <>{children}</>;
};

export default Container;

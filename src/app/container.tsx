'use client';

import { useRouter } from 'next/navigation';
import { FC, PropsWithChildren, useEffect } from 'react';

import { Loading } from '@/components/common';
import { useAuth } from '@/hooks/useAuth';

const Container: FC<PropsWithChildren> = ({ children }) => {
  const { user, accessToken, checkAuth, appLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkUserAndFetchDetails = async () => {
      if (!user && !window.location.pathname.includes('signup')) {
        router.push('/signin');
      } else {
        if (accessToken) {
          const user = await checkAuth();
          if (!user) {
            logout();
            router.push('/signin');
          }
        } else {
          router.push('/signin');
        }
      }
    };

    checkUserAndFetchDetails();
  }, [router, accessToken]);

  if (appLoading) {
    return <Loading />;
  } else if (user && accessToken) {
    return <>{children}</>;
  } else {
    return <Loading />;
  }
};

export default Container;

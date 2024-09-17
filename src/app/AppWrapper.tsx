'use client';

import Providers from '@/app/providers';
import { ReactNode } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const AppWrapper = ({ children }: { children: ReactNode }) => {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();

  // Redirect to signin if not authenticated. Since this is on Root Layout, this will apply for all pages.
  // TODO: Revisit auth strategy and how this plays with Splash, Authenticated wrapper, and useAuth
  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/signin');
    }
  }, [ready, authenticated, router]);

  return <Providers>{children}</Providers>;
};

'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { useEffect } from 'react';

import Providers from '@/app/providers';

export const ClientProviders = ({ children }: { children: ReactNode }) => {
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

'use client';

import { useRouter } from 'next/navigation';
import { type FC, PropsWithChildren, useEffect } from 'react';

import { useIsCountryRestricted } from '@/hooks/profile/use-is-country-restricted';
import { useAuth } from '@/hooks/use-auth';

/**
 * Guards a page against users whose country is on the Virtual Account restriction list.
 * Redirects to /dashboard if the user is restricted.
 * Should be used inside `Authenticated` so that `user` is guaranteed to be set.
 */
export const CountryNotRestricted: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useAuth();
  const isRestricted = useIsCountryRestricted();
  const router = useRouter();

  useEffect(() => {
    if (user && isRestricted) {
      router.replace('/dashboard');
    }
  }, [user, isRestricted, router]);

  if (!user || isRestricted) return null;

  return <>{children}</>;
};

import React from 'react';
import { fn } from '@storybook/test';
import { ReactNode, useCallback, useMemo } from 'react';

import AuthProvider from '../../src/hooks/useAuth';
import { UserWithId } from '../../src/types';

/**
 * This component stubs out the functions of an AuthProvider and then returns a mocked AuthProvider
 * This is useful for testing components that use the AuthProvider without having to deal with the
 * actual authentication flow
 */
export const MockAuthProvider = ({ children }: { children: ReactNode }) => {
  const mockUser: UserWithId = useMemo(
    () => ({
      id: '1',
      privyId: 'mock-privy-id',
      handle: 'mock-user',
      firstName: 'Mock',
      lastName: 'User',
      email: 'mock@example.com',
      bio: 'Mock bio',
      profileImage: 'https://xsgames.co/randomusers/avatar.php?g=male',
    }),
    []
  );

  const logout = useCallback(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        fn();
        resolve(true);
      }, 1000);
    });
  }, []);

  const value = useMemo(
    () => ({
      user: mockUser,
      logout,
      login: fn(),
      loading: false,
    }),
    [mockUser, logout]
  );
  return <AuthProvider value={value}>{children}</AuthProvider>;
};

import React from 'react';
import { fn } from '@storybook/test';
import { ReactNode, useCallback, useMemo } from 'react';

import AuthProvider from '../../src/hooks/useAuth';
import { UserWithId } from '../../src/types';

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

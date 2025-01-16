import React from 'react';
import { fn } from '@storybook/test';
import { ReactNode, useCallback, useMemo } from 'react';

import AuthProvider from '../../src/hooks/use-auth';

import { mockUser } from '../../src/api/user';

/**
 * This component stubs out the functions of an AuthProvider and then returns a mocked AuthProvider
 * This is useful for testing components that use the AuthProvider without having to deal with the
 * actual authentication flow
 */
export const MockAuthProvider = ({ children }: { children: ReactNode }) => {
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

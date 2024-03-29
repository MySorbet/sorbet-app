import { useLocalStorage } from './useLocalStorage';
import { fetchUserDetails, signInAsync, signInWithWallet } from '@/api/auth';
import { useWalletSelector } from '@/components/common';
import { config } from '@/lib/config';
import { useAppDispatch } from '@/redux/hook';
import { setOpenSidebar, updateUserData } from '@/redux/userSlice';
import { User } from '@/types';
import { ReactNode, createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext({
  user: null as User | null,
  accessToken: null as string | null,
  loading: false as boolean,
  loginWithEmail: async (email: string): Promise<string> => {
    return '';
  },
  loginWithWallet: async (accountId: string): Promise<string> => {
    return '';
  },
  logout: () => {},
  checkAuth: async (): Promise<User | null> => {
    return null;
  },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useLocalStorage<User | null>('user', null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useLocalStorage<string | null>(
    'access_token',
    null
  );
  const dispatch = useAppDispatch();
  const { modal: nearModal, selector } = useWalletSelector();

  const loginWithEmail = async (email: string) => {
    const response = await signInAsync({ email });
    if (!response.data || response.data.user === undefined) {
      return 'User account not found, please try again or sign up for an account';
    } else {
      // const walletResponse: any = await selector.wallet('fast-auth-wallet');
      // await walletResponse.signIn({
      //   contractId: config.contractId,
      //   email: email,
      //   isRecovery: false,
      // });
      const user = response.data.user;
      const token = response.data.access_token;
      setUser(user);
      setAccessToken(token);
      dispatch(updateUserData(user));
      dispatch(setOpenSidebar(false));
      return 'Login successful';
    }
  };

  const loginWithWallet = async (accountId: string) => {
    try {
      const response = await signInWithWallet(accountId);
      if (!response.data || response.data.user === undefined) {
        return 'User account not found, please try again or sign up for an account';
      } else {
        const walletResponse: any = await selector.wallet('fast-auth-wallet');
        await walletResponse.signIn({
          contractId: config.contractId,
          accountId: accountId,
          isRecovery: false,
        });
        const user = response.data.user;
        const token = response.data.access_token;
        setUser(user);
        setAccessToken(token);
        dispatch(updateUserData(user));
        return 'Wallet connected and user logged in';
      }
    } catch (error) {
      return 'Failed to connect wallet or log in';
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    if (!accessToken) {
      return null;
    }

    setLoading(true);

    try {
      const response = await fetchUserDetails(accessToken as string);
      if (!response.data || response.data.user === undefined) {
        throw new Error('No user found for access token');
      }

      const authenticatedUser = response.data.user as User;

      setUser(authenticatedUser);
      return authenticatedUser;
    } catch (error) {
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setLoading(false);
  };

  const value = useMemo(
    () => ({
      user,
      accessToken,
      loginWithEmail,
      loginWithWallet,
      logout,
      loading,
      checkAuth,
    }),
    [user, accessToken, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

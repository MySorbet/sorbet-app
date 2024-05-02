import { useLocalStorage } from './useLocalStorage';
import { fetchUserDetails, signInAsync, signInWithWallet } from '@/api/auth';
import { getBalances } from '@/api/user';
import { useWalletSelector } from '@/components/common';
import { config } from '@/lib/config';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { setOpenSidebar, updateUserData } from '@/redux/userSlice';
import { User } from '@/types';
import {
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';

const AuthContext = createContext({
  user: null as User | null,
  accessToken: null as string | null,
  appLoading: false as boolean,
  loginWithEmail: async (
    email: string
  ): Promise<{ status: string; message: string; error?: any; data?: any }> => {
    return { status: '', message: '', error: {}, data: {} };
  },
  loginWithWallet: async (
    accountId: string
  ): Promise<{
    status: string;
    message: string;
    error?: any;
    data?: any;
  }> => {
    return { status: '', message: '', error: {}, data: {} };
  },
  logout: () => {},
  checkAuth: async (): Promise<User | null> => {
    return null;
  },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useLocalStorage<User | null>('user', null);
  const [appLoading, setAppLoading] = useState(true);
  const [accessToken, setAccessToken] = useLocalStorage<string | null>(
    'access_token',
    null
  );
  const dispatch = useAppDispatch();
  const { modal: nearModal, selector } = useWalletSelector();
  const reduxUser = useAppSelector((state) => state.userReducer.user);

  useEffect(() => {
    if (
      reduxUser &&
      reduxUser.firstName &&
      reduxUser.lastName &&
      reduxUser.id
    ) {
      setUser(reduxUser);
      setAppLoading(false);
    }
  }, [reduxUser, setUser]);

  const loginWithEmail = async (email: string) => {
    // try {
    //   console.log('initiating fast auth login');
    //   selector.wallet('fast-auth-wallet').then((fastAuthWallet: any) => {
    //     fastAuthWallet.signIn({
    //       contractId: config.contractId,
    //       email: email,
    //       isRecovery: true,
    //     });
    //   });
    //   return 'Login successful';
    // } catch (error) {
    //   return 'Login failed';
    // }
    const response = await signInAsync({ email });
    if (response.status === 'success') {
      const user = response.data.user;
      const token = response.data.access_token;
      setUser(user);
      setAccessToken(token);
      dispatch(updateUserData(user));
      dispatch(setOpenSidebar(false));
      return {
        ...response,
        status: 'success',
        message: 'Login successful',
        data: response.data,
      };
    } else {
      return {
        ...response,
        status: 'failed',
        message: response.message,
      };
    }
  };

  const loginWithWallet = async (accountId: string) => {
    try {
      const response = await signInWithWallet(accountId);
      if (!response.data || response.data.user === undefined) {
        return response;
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
        return response;
      }
    } catch (error) {
      return { status: 'failed', message: '', error: '' };
    } finally {
      setAppLoading(false);
    }
  };

  const checkAuth = async () => {
    if (!accessToken) {
      return null;
    }

    setAppLoading(true);

    try {
      const response = await fetchUserDetails(accessToken as string);
      const authenticatedUser = response as User;

      const balanceResponse = await getBalances(authenticatedUser.email);
      if (balanceResponse.status === 'success') {
        setUser({ ...authenticatedUser, balance: balanceResponse.data });
      } else {
        setUser(authenticatedUser);
      }

      dispatch(updateUserData(authenticatedUser));

      return authenticatedUser;
    } catch (error) {
      return null;
    } finally {
      setAppLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setAppLoading(false);
  };

  const value = useMemo(
    () => ({
      user,
      accessToken,
      loginWithEmail,
      loginWithWallet,
      logout,
      appLoading,
      checkAuth,
    }),
    [user, accessToken, appLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

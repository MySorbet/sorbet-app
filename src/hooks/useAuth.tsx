import { useLocalStorage } from './useLocalStorage';
import { fetchUserDetails, signIn, signInWithWallet } from '@/api/auth';
import { getBalances } from '@/api/user';
import { useWalletSelector } from '@/components/common';
import { config } from '@/lib/config';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { reset, setOpenSidebar, updateUserData } from '@/redux/userSlice';
import { User } from '@/types';
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
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

  const registerWithEmail = async (email: string) => {
    try {
      console.log('initiating fast auth sign up');
      selector.wallet('fast-auth-wallet').then((fastAuthWallet: any) => {
        fastAuthWallet.signIn({
          contractId: config.contractId,
          email: email,
          isRecovery: false,
          successUrl: config.signUpSuccessUrl,
          failureUrl: config.signUpFailureUrl,
        });
      });
      return {
        status: 'success',
        message: 'register successful',
      };
    } catch (error) {
      return {
        status: 'failed',
        message: 'register failed',
      };
    }
  };

  /** Attempts to sign into sorbet, storing the access token and user if successful  */
  const loginWithEmail = async (
    email: string
  ): Promise<{ status: string; message: string; error?: any; data?: any }> => {
    try {
      const response = await signIn({ email });
      if (response) {
        const user = response.data.user;
        const token = response.data.access_token;
        setUser(user);
        setAccessToken(token);
        dispatch(updateUserData(user));
        dispatch(setOpenSidebar(false));

        return {
          status: 'success',
          message: 'Login successful',
          data: response.data,
        };
      } else {
        return {
          status: 'failed',
          message: 'Failed to login. Server threw an error',
          error: {},
        };
      }
    } catch (error) {
      return {
        status: 'failed',
        message: 'Login failed',
        error: error,
      };
    }
  };

  const loginWithWallet = async (accountId: string) => {
    try {
      const response = await signInWithWallet(accountId);
      console.log('wallet sign in res', response);
      if (response.data) {
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
          message: 'Failed to sign in with wallet',
        };
      }
    } catch (error) {
      console.log('wallet sign in catch', error);
      return { status: 'failed', message: 'Login failed', error: error };
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
      const authenticatedUser = response.data as User;

      const balanceResponse = await getBalances(authenticatedUser.id);
      if (balanceResponse && balanceResponse.data) {
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
    dispatch(reset());
  };

  const value = useMemo(
    () => ({
      user,
      accessToken,
      loginWithEmail,
      loginWithWallet,
      registerWithEmail,
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

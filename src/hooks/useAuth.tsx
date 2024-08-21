import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';

import { getUserByEmail } from '@/api/user';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { reset, updateUserData } from '@/redux/userSlice';
import { User } from '@/types';

import { useLocalStorage } from './useLocalStorage';
import { usePrivy } from '@privy-io/react-auth';

interface AuthContextType {
  user: User | null;
  loginWithEmail: (
    email: string
  ) => Promise<{ status: string; message: string; error?: any; data?: any }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loginWithEmail: async (email) => {
    return {
      status: '',
      message: '',
    };
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // We store a copy of the user in local storage so we don't have to fetch it every time
  const [user, setUser] = useLocalStorage<User | null>('user', null);

  // And one in redux to make it globally available
  const reduxUser = useAppSelector((state) => state.userReducer.user);
  const dispatch = useAppDispatch();

  const { logout: logoutPrivy } = usePrivy();

  // We sync the user from redux to local storage
  useEffect(() => {
    if (
      reduxUser &&
      reduxUser.firstName &&
      reduxUser.lastName &&
      reduxUser.id
    ) {
      setUser(reduxUser);
    }
  }, [reduxUser, setUser]);

  /** Attempts to sign into sorbet, storing the access token and user if successful  */
  const loginWithEmail = useCallback(
    async (
      email: string
    ): Promise<{
      status: string;
      message: string;
      error?: any;
      data?: any;
    }> => {
      try {
        const sorbetUser = await getUserByEmail(email);
        if (sorbetUser) {
          const user = sorbetUser.data;
          dispatch(updateUserData(user));
          return {
            status: 'success',
            message: 'Login successful',
            data: sorbetUser.data,
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
    },
    [dispatch]
  );

  // const checkAuth = async () => {
  //   if (!accessToken) {
  //     return null;
  //   }

  //   setAppLoading(true);

  //   try {
  //     const response = await fetchUserDetails(accessToken as string);
  //     const authenticatedUser = response.data as User;

  //     const balanceResponse = await getBalances(authenticatedUser.id);
  //     if (balanceResponse && balanceResponse.data) {
  //       setUser({ ...authenticatedUser, balance: balanceResponse.data });
  //     } else {
  //       setUser(authenticatedUser);
  //     }

  //     dispatch(updateUserData(authenticatedUser));

  //     return authenticatedUser;
  //   } catch (error) {
  //     return null;
  //   } finally {
  //     setAppLoading(false);
  //   }
  // };

  const logout = useCallback(() => {
    logoutPrivy();
    dispatch(reset());
  }, [dispatch]);

  const value = useMemo(
    () => ({
      user,
      loginWithEmail,
      logout,
    }),
    [loginWithEmail, logout, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

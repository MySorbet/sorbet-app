import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';

import { getUserByEmail, getUserByPrivyId } from '@/api/user';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { reset, updateUserData } from '@/redux/userSlice';
import { User } from '@/types';

import { useLocalStorage } from './useLocalStorage';
import { usePrivy } from '@privy-io/react-auth';

type LoginResult = {
  status: string;
  message: string;
  error?: any;
  data?: any;
};

interface AuthContextType {
  user: User | null;
  loginWithEmail: (email: string) => Promise<LoginResult>;
  loginWithPrivyId: (id: string) => Promise<LoginResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

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
    async (email: string): Promise<LoginResult> => {
      try {
        const response = await getUserByEmail(email);
        if (response) {
          const sorbetUser = response.data;
          dispatch(updateUserData(sorbetUser));
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
    },
    [dispatch]
  );

  /** Attempts to sign into sorbet, storing the access token and user if successful  */
  const loginWithPrivyId = useCallback(
    async (id: string): Promise<LoginResult> => {
      try {
        const response = await getUserByPrivyId(id);
        if (response) {
          const sorbetUser = response.data;
          dispatch(updateUserData(sorbetUser));
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
      loginWithPrivyId,
      logout,
    }),
    [loginWithEmail, logout, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/** Use this hook to get access to the currently logged in sorbet user and methods to log them in and out */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};

export default AuthProvider;

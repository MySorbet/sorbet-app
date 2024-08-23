import { usePrivy } from '@privy-io/react-auth';
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

type LoginResultFailed = {
  status: 'failed';
  message: string;
  error?: any;
};
type LoginResultSuccess = {
  status: 'success';
  message: string;
  data: User;
};

type LoginResult = LoginResultFailed | LoginResultSuccess;

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
  // TODO: seems like we also need to sync the user from local storage to redux when the pae is refreshed
  useEffect(() => {
    setUser(reduxUser);
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

  /** Find a user by privy id in the sorbet db, storing the access token and user if successful  */
  const loginWithPrivyId = useCallback(
    async (id: string): Promise<LoginResult> => {
      try {
        const response = await getUserByPrivyId(id);
        if (response) {
          const sorbetUser = response.data;
          console.log('sorbetUser: ', sorbetUser);
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
  }, [dispatch, logoutPrivy]);

  const value = useMemo(
    () => ({
      user,
      loginWithEmail,
      loginWithPrivyId,
      logout,
    }),
    [loginWithEmail, loginWithPrivyId, logout, user]
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

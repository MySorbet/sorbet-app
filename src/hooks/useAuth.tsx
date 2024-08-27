'use client';

import { useLogin, usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { signUpWithPrivyId } from '@/api/auth';
import { getUserByPrivyId } from '@/api/user';
import { useToast } from '@/components/ui/use-toast';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { reset, updateUserData } from '@/redux/userSlice';
import { User, UserWithId } from '@/types';

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
  user: UserWithId | null;
  logout: () => void;
  login: ReturnType<typeof useLogin>['login'];
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // We store a copy of the user in local storage so we don't have to fetch it every time
  const [user, setUser] = useLocalStorage<UserWithId | null>('user', null);
  const [loading, setLoading] = useState(false);

  // And one in redux to make it globally available
  const reduxUser = useAppSelector((state) => state.userReducer.user);
  const dispatch = useAppDispatch();

  const { logout: logoutPrivy } = usePrivy();
  const router = useRouter();
  const { toast } = useToast();

  // We sync the user from redux to local storage and vice versa
  useEffect(() => {
    // If redux user is empty, we need to fetch the user from local storage
    if (!reduxUser || Object.keys(reduxUser).length === 0) {
      user && dispatch(updateUserData(user));
    } else {
      setUser(reduxUser);
    }
  }, [dispatch, reduxUser, setUser, user]);

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

  const { login } = useLogin({
    onComplete: async (user, isNewUser, wasAlreadyAuthenticated) => {
      console.log('wasAlreadyAuthenticated: ', wasAlreadyAuthenticated);

      // This is a signup so create a user in the sorbet db, put it in redux and redirect to signup
      if (isNewUser) {
        console.log(
          'This is a new user. Creating a sorbet user and redirecting to signup'
        );
        setLoading(true);
        const signUpResponse = await signUpWithPrivyId({ id: user.id });
        // TODO: What if this fails? We have a privy user but no sorbet
        // TODO: Maybe we should give them a temp handle so that they can see their profile in case handle update fails?
        dispatch(updateUserData(signUpResponse.data));
        console.log(signUpResponse.data);
        setLoading(false);
        router.replace('/signup');
        return;
      }

      // Fetch user from sorbet
      setLoading(true);
      const loginResult = await loginWithPrivyId(user.id);

      // If the login fails, log out and show an error
      if (loginResult.status === 'failed') {
        await logout();
        setLoading(false);
        toast({
          title: 'Error',
          description: `Error logging in: ${loginResult.error?.message}`,
          variant: 'destructive',
        });
        return;
      }

      // If you get here, the login was successful and you have a sorbet user. Route to their profile
      console.log(loginResult);
      const sorbetUser = loginResult.data;
      setLoading(false);
      router.replace(`/${sorbetUser.handle}`);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Error logging in: ${error}`,
        variant: 'destructive',
      });
    },
  });

  // TODO: Fetch balances

  const logout = useCallback(async () => {
    await logoutPrivy();
    setUser(null);
    dispatch(reset());
    setLoading(false);
  }, [dispatch, logoutPrivy, setUser]);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
    }),
    [user, loading, login, logout]
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

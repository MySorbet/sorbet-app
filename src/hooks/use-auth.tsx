'use client';

import { useLogin, usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useQueryState } from 'nuqs';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { toast } from 'sonner';

import { getMe, signup } from '@/api/auth';
import { User } from '@/types';

import { useLocalStorage } from './use-local-storage';

type LoginResultFailed = {
  status: 'failed';
  message: string;
  error?: Error | unknown;
};

type LoginResultSuccess = {
  status: 'success';
  message: string;
  data: User;
};

type LoginResult = LoginResultFailed | LoginResultSuccess;

interface AuthContextType {
  user: User | null;
  logout: () => void;
  login: ReturnType<typeof useLogin>['login'];
  loading: boolean;
  dangerouslySetUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: ReactNode /* The children to render within the auth provider */;
  value?: AuthContextType /* The value to pass to the auth context. Usually you won't use this, but can be helpful for mocking in tests and storybook */;
};

export const AuthProvider = ({ children, value }: AuthProviderProps) => {
  // We store a copy of the user in local storage so we don't have to fetch it every time
  const [user, setUser] = useLocalStorage<User | null>('user', null);
  const [loading, setLoading] = useState(false);

  const { logout: logoutPrivy, ready, authenticated } = usePrivy();
  const router = useRouter();

  const [desiredHandle] = useQueryState('handle');

  // If privy ever determines the user is not authenticated, reset the user in state
  // This fixes a bug where an infinite redirect loop between the splash and signin pages occurs
  useEffect(() => {
    if (ready && !authenticated) {
      setUser(null);
    }
  }, [ready, authenticated, setUser]);

  /**
   * Local helper to find a user by privy id in the sorbet db,
   * storing the user in local storage if successful.
   * Relies on the fact that privy should have already put the auth token in local storage
   */
  const loginWithPrivyId = useCallback(async (): Promise<LoginResult> => {
    try {
      // Get the sorbet user from their privy id, fail if there is no user
      // Here we rely on the fact that privy should have already put the auth token in local storage
      const user = await getMe();
      if (!user) throw new Error('No user returned from getMe');

      // Put the user in local storage and return a success
      setUser(user);
      return {
        status: 'success',
        message: 'Login successful',
        data: user,
      };
    } catch (error) {
      return {
        status: 'failed',
        message: 'Login failed',
        error: error,
      };
    }
  }, [setUser]);

  /**
   * Login with privy, redirecting to signup if the user is new and to their dashboard if they already have an account.
   * Note: No redirect will happen if the user is already authenticated
   */
  const { login } = useLogin({
    onComplete: async ({ user, isNewUser, wasAlreadyAuthenticated }) => {
      console.log('wasAlreadyAuthenticated: ', wasAlreadyAuthenticated);

      // This is a signup so create a user in the sorbet db, put it in state and redirect to signup
      if (isNewUser) {
        console.log(
          'This is a new user. Creating a sorbet user and redirecting to signup'
        );
        setLoading(true);
        // TODO: What if this fails? We have a privy user but no sorbet. Handle this case.
        const newSorbetUser = await signup({
          email: user.email?.address, // If they sign up with email, we'll store that in the sorbet db too
          handle: desiredHandle ?? undefined, // Request a handle if one was provided in QP. They will only be given this handle if it is available. If not, a new one will be generated
        });
        setUser(newSorbetUser);
        console.log(`New sorbet user: ${newSorbetUser}`);
        setLoading(false);

        // We have signed up a privy user and created a minimal (id, privyId, handle) sorbet user.
        // Redirect to dashboard if they have already selected a customer type (this should not happen)
        if (newSorbetUser.customerType) {
          router.replace(`/dashboard`);
        }
        return;
      }

      // This is a login from an existing user so fetch their sorbet details
      setLoading(true);
      const loginResult = await loginWithPrivyId();

      // If the login fails, log out and show an error
      if (loginResult.status === 'failed') {
        await logout();
        setLoading(false);
        const errorMessage =
          loginResult.error instanceof Error
            ? loginResult.error.message
            : 'Unknown error';
        toast.error('Error logging in', {
          description: errorMessage,
        });
        return;
      }

      // If you get here, the login was successful and you have a sorbet user. Route to their dashboard
      const sorbetUser = loginResult.data;
      console.log('Existing User: ', sorbetUser);
      setLoading(false);

      // However, We only want to do this if they are logging in currently.
      // Not if this is an implicit login from privy
      // TODO: Revisit this
      if (!wasAlreadyAuthenticated && sorbetUser.customerType) {
        router.replace(`/dashboard`);
      } else {
        console.log(
          `${sorbetUser.handle} is logged in. Did not redirect b/c they were already authenticated.`
        );
      }
    },
    onError: (error) => {
      // Ignore the user exiting the auth flow
      // Ignore the user typing the wrong otp. Privy displays an error message for this
      if (error === 'exited_auth_flow' || error === 'invalid_credentials') {
        return;
      }
      toast.error('Error logging in', {
        description: error,
      });
    },
  });

  // Combine a privy logout with resetting the stored user
  const logout = useCallback(async () => {
    await logoutPrivy();
    setUser(null);
    setLoading(false);
  }, [logoutPrivy, setUser]);

  const contextValue = useMemo(
    () =>
      value ?? {
        user,
        loading,
        login,
        logout,
        dangerouslySetUser: setUser,
      },
    [value, user, loading, login, logout, setUser]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
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

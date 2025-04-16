'use client';

import { useLogin, usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useQueryState } from 'nuqs';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { toast } from 'sonner';

import { signUpWithPrivyId } from '@/api/auth';
import { getUserByPrivyId } from '@/api/user';
import { MinimalUser, User } from '@/types';

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
  user: MinimalUser | null;
  logout: () => void;
  login: ReturnType<typeof useLogin>['login'];
  loading: boolean;
  dangerouslySetUser: (user: MinimalUser | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: ReactNode /* The children to render within the auth provider */;
  value?: AuthContextType /* The value to pass to the auth context. Usually you won't use this, but can be helpful for mocking in tests and storybook */;
};

export const AuthProvider = ({ children, value }: AuthProviderProps) => {
  // We store a copy of the user in local storage so we don't have to fetch it every time
  const [user, setUser] = useLocalStorage<MinimalUser | null>('user', null);
  const [loading, setLoading] = useState(false);

  const { logout: logoutPrivy } = usePrivy();
  const router = useRouter();

  const [desiredHandle] = useQueryState('handle');

  /**
   * Local helper to find a user by privy id in the sorbet db,
   * storing the access token and user if successful
   */
  const loginWithPrivyId = useCallback(
    async (id: string): Promise<LoginResult> => {
      try {
        // Get the sorbet user from their privy id, fail if there is no user
        const response = await getUserByPrivyId(id);
        if (!response) {
          return {
            status: 'failed',
            message: 'Failed to login. Server threw an error',
          };
        }
        const sorbetUser = response.data;

        // Put the user in local storage and return a success
        setUser(sorbetUser);
        return {
          status: 'success',
          message: 'Login successful',
          data: response.data,
        };
      } catch (error) {
        return {
          status: 'failed',
          message: 'Login failed',
          error: error,
        };
      }
    },
    [setUser]
  );

  /**
   * Login with privy, redirecting to signup if the user is new and to their dashboard if they already have an account.
   * Note: No redirect will happen if the user is already authenticated
   */
  const { login } = useLogin({
    onComplete: async (user, isNewUser, wasAlreadyAuthenticated) => {
      console.log('wasAlreadyAuthenticated: ', wasAlreadyAuthenticated);

      // This is a signup so create a user in the sorbet db, put it in state and redirect to signup
      if (isNewUser) {
        console.log(
          'This is a new user. Creating a sorbet user and redirecting to signup'
        );
        setLoading(true);
        // TODO: What if this fails? We have a privy user but no sorbet. Handle this case.
        const signUpResponse = await signUpWithPrivyId({
          privyId: user.id,
          email: user.email?.address, // If they sign up with email, we'll store that in the sorbet db too
          handle: desiredHandle ?? undefined, // Request a handle if one was provided in QP. They will only be given this handle if it is available. If not, a new one will be generated
        });
        const newSorbetUser = signUpResponse.data;
        setUser(newSorbetUser);
        console.log(`New sorbet user: ${newSorbetUser}`);
        setLoading(false);

        // We have signed up a privy user and created a minimal (id, privyId, handle) sorbet user. Redirect to dashboard
        router.replace(`/dashboard`);
        return;
      }

      // This is a login from an existing user so fetch their sorbet details
      setLoading(true);
      const loginResult = await loginWithPrivyId(user.id);

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
      console.log('Existing sorbet user:');
      console.dir(sorbetUser);
      setLoading(false);

      // However, We only want to do this if they are logging in currently.
      // Not if this is an implicit login from privy
      // TODO: Revisit this
      if (!wasAlreadyAuthenticated) {
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

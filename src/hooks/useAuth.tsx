import { useLocalStorage } from './useLocalStorage';
import { signInAsync, signInWithWallet } from '@/api/auth';
import { useWalletSelector } from '@/components/common';
import { config } from '@/lib/config';
import { useAppDispatch } from '@/redux/hook';
import { updateUserData } from '@/redux/userSlice';
import { ReactNode, createContext, useContext, useMemo } from 'react';

const AuthContext = createContext({
  user: null,
  loginWithEmail: async (email: string): Promise<string> => {
    return '';
  },
  loginWithWallet: async (accountId: string): Promise<string> => {
    return '';
  },
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useLocalStorage('user', null);
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
      setUser(user);
      dispatch(updateUserData(user));
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
        setUser(user);
        dispatch(updateUserData(user));
        return 'Wallet connected and user logged in';
      }
    } catch (error) {
      return 'Failed to connect wallet or log in';
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loginWithEmail,
      loginWithWallet,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

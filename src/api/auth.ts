import axios from 'axios';

import { User } from '@/types';
import { API_URL } from '@/utils';

/** Signs an email & accountID (near wallet) up to sorbet */
export const signUp = async ({ email, accountId }: SignUpWithEmailTypes) => {
  try {
    const reqBody = { email, accountId };
    const res = await axios.post(`${API_URL}/auth/signup/email`, reqBody);
    return res;
  } catch (error: any) {
    throw new Error(`Failed to sign up: ${error.response?.data?.message}`);
  }
};

export const signUpWithPrivyId = async ({ id }: { id: string }) => {
  try {
    const reqBody = { id };
    const res = await axios.post<Pick<User, 'id' | 'privyId'>>(
      `${API_URL}/auth/signup/privy`,
      reqBody
    );
    return res;
  } catch (error: any) {
    throw new Error(
      `Failed to sign up with privy id: ${error.response.data.message}`
    );
  }
};

/** Signs an email in. This means asking the API if this user exists, and getting a JWT back if so. */
export const signIn = async ({ email }: SignInWithEmailTypes) => {
  try {
    const reqBody = { email };
    const res = await axios.post(`${API_URL}/auth/signin/email`, reqBody);
    return res;
  } catch (error: any) {
    throw new Error(`Failed to sign in: ${error.response.data.message}`);
  }
};

// [POST] /api/auth/signin
export const signInWithWallet = async (address: string) => {
  const reqBody = { address };
  try {
    const res = await axios.post(`${API_URL}/auth/signin/wallet`, reqBody);
    return res;
  } catch (error: any) {
    throw new Error(
      `Failed to sign in with wallet: ${error.response.data.message}`
    );
  }
};

// [POST] /api/auth/signin
export const signUpWithWallet = async (
  address: string,
  email: string | null,
  phone: string | null
) => {
  const reqBody = { address, email, phone };

  try {
    const res = axios.post(`${API_URL}/auth/signup/wallet`, reqBody);
    return res;
  } catch (error: any) {
    throw new Error(
      `Failed to sign up with wallet: ${error.response.data.message}`
    );
  }
};

export const fetchUserDetails = async (token: string) => {
  const headers = { Authorization: `Bearer ${token}` };
  const reqHeader = { headers };

  try {
    const res = await axios.get(`${API_URL}/auth/me`, reqHeader);
    return res;
  } catch (error: any) {
    throw new Error(
      `Failed to get user details: ${error.response.data.message}`
    );
  }
};

export const checkHandleIsAvailable = async (handle: string) => {
  try {
    const res = await axios.get<{ isUnique: boolean }>(
      `${API_URL}/users/handle/check/${handle}`
    );

    return res;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Axios error: failed to get check handle availability: ${error.response?.data.error}`
      );
    }
    throw new Error(
      `Non-axios error: failed to get check handle availability: ${error}`
    );
  }
};

// Types

export interface SignUpWithEmailTypes {
  email: string;
  accountId: string;
}

export interface SignInWithEmailTypes {
  email: string;
}

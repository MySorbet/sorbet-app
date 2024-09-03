import axios from 'axios';

import { config } from '@/lib/config';
import { User } from '@/types';

export const signUpWithPrivyId = async ({ id }: { id: string }) => {
  try {
    const reqBody = { id };
    const res = await axios.post<Pick<User, 'id' | 'privyId'>>(
      `${config.sorbetApiUrl}/auth/signup/privy`,
      reqBody
    );
    return res;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Axios error:Failed to sign up with privy id: ${error.response?.data.error}`
      );
    }
    throw new Error(
      `Non-axios error: failed to get check handle availability: ${error}`
    );
  }
};

export const checkHandleIsAvailable = async (handle: string) => {
  try {
    const res = await axios.get<{ isUnique: boolean }>(
      `${config.sorbetApiUrl}/users/handle/check/${handle}`
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

// OLD 👇

// [POST] /api/auth/signin
export const signInWithWallet = async (address: string) => {
  const reqBody = { address };
  try {
    const res = await axios.post(
      `${config.sorbetApiUrl}/auth/signin/wallet`,
      reqBody
    );
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
    const res = axios.post(
      `${config.sorbetApiUrl}/auth/signup/wallet`,
      reqBody
    );
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
    const res = await axios.get(`${config.sorbetApiUrl}/auth/me`, reqHeader);
    return res;
  } catch (error: any) {
    throw new Error(
      `Failed to get user details: ${error.response.data.message}`
    );
  }
};

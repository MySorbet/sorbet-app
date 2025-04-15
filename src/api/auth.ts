import axios from 'axios';

import { env } from '@/lib/env';
import { MinimalUser } from '@/types';

// Should match the SignUpWithPrivyIdDto in the api
type SignUpWithPrivyIdDto = {
  privyId: string;
  email?: string;
  handle?: string;
};

/** Create a new sorbet user with a privy id (after user signs up with privy) */
export const signUpWithPrivyId = async (body: SignUpWithPrivyIdDto) => {
  try {
    const res = await axios.post<MinimalUser>(
      `${env.NEXT_PUBLIC_SORBET_API_URL}/auth/signup/privy`,
      body
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

/** Check if a handle is available */
export const checkHandleIsAvailable = async (handle: string) => {
  try {
    const res = await axios.get<{ isUnique: boolean }>(
      `${env.NEXT_PUBLIC_SORBET_API_URL}/users/handle/check/${handle}`
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

/** Fetch user details */
export const fetchUserDetails = async (token: string) => {
  const headers = { Authorization: `Bearer ${token}` };
  const reqHeader = { headers };

  try {
    const res = await axios.get(
      `${env.NEXT_PUBLIC_SORBET_API_URL}/auth/me`,
      reqHeader
    );
    return res;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to get user details: ${error.response?.data.message}`
      );
    } else {
      throw new Error(`Non-axios error: failed to get user details: ${error}`);
    }
  }
};

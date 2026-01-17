import axios from 'axios';

import { withAuthHeader } from '@/api/with-auth-header';
import { env } from '@/lib/env';
import { User } from '@/types';

// Should match the SignupDto in the api
type SignupDto = {
  email?: string;
  handle?: string;
};

/**
 * Create a new sorbet user (after user signs up with privy, this relies on an access token in local storage)
 * - Optionally provide an email (from privy email or social login)
 * - Optionally provide a handle to claim when signing up (this should be pre-checked for uniqueness).
 * If the handle is taken, the signup will succeed but the handle will be different from the requested one.
 */
export const signup = async (body: SignupDto) => {
  const res = await axios.post<User>(
    `${env.NEXT_PUBLIC_SORBET_API_URL}/auth/signup`,
    body,
    await withAuthHeader()
  );
  return res.data;
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

/** Fetch full user details provided there is an access token in local storage */
export const getMe = async () => {
  const res = await axios.get<User>(
    `${env.NEXT_PUBLIC_SORBET_API_URL}/auth/me`,
    await withAuthHeader()
  );
  return res.data;
};

/** Check if a user has access to the platform (used to restrict signups to existing users) */
export const checkAccess = async (email: string) => {
  const res = await axios.post<{ allowed: boolean; message?: string }>(
    `${env.NEXT_PUBLIC_SORBET_API_URL}/auth/check-access`,
    { email }
  );
  return res.data;
};

/** Fetch access config (whether signup is restricted to existing users) */
export const getAccessConfig = async () => {
  const res = await axios.get<{
    restrictAccessToExistingUsers: boolean;
  }>(`${env.NEXT_PUBLIC_SORBET_API_URL}/auth/access-config`);
  return res.data;
};

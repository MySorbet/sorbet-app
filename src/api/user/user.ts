import axios, { AxiosError } from 'axios';

import { env } from '@/lib/env';
import { User, UserPublic } from '@/types';

import { withAuthHeader } from '../with-auth-header';

const API_URL = env.NEXT_PUBLIC_SORBET_API_URL;

/**
 * Get a user from the db by their handle
 * @throws what axios throws
 */
export const getUserByHandle = async (handle: string) => {
  const response = await axios.get<UserPublic>(
    `${API_URL}/users/handle/${handle}`
  );
  return response.data;
};

/**
 * Get a user from the db by their privy id
 *  @throws what axios throws
 */
export const getUserByPrivyId = async (id: string) => {
  const response = await axios.get<UserPublic>(`${API_URL}/users/privy/${id}`);
  return response.data;
};

/** Get the current wallet address of a user */
export const getCurrentWalletAddressByUserId = async (userId: string) => {
  try {
    const res = await axios.get<string>(
      `${API_URL}/users/${userId}/wallet`,
      await withAuthHeader()
    );
    return res.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(`Failed to get Address: ${error.response?.data.message}`);
    } else {
      throw new Error(`Failed to get Address: ${error}`);
    }
  }
};

/** Delete a user's profile image */
export const deleteProfileImageAsync = async (userId: string) => {
  try {
    const res = await axios.delete(
      `${API_URL}/images/delete/${userId}`,
      await withAuthHeader()
    );
    return res.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const message =
        error.response?.data?.message ?? error.message ?? 'Unknown error';
      throw new Error(`Failed to delete profile image: ${message}`);
    }
    throw new Error(`Failed to delete profile image: ${String(error)}`);
  }
};

/** Update a user's profile */
export const updateUser = async (
  userToUpdate: Omit<Partial<User>, 'id'>,
  userId: string
) => {
  try {
    const response = await axios.patch<User>(
      `${API_URL}/users/${userId}`,
      userToUpdate,
      await withAuthHeader()
    );
    return response;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const serverMessage =
        error.response?.data?.message ?? 'Failed to update user';
      const apiError = new Error(serverMessage) as Error & {
        status?: number;
        data?: unknown;
      };
      apiError.status = error.response?.status;
      apiError.data = error.response?.data;
      throw apiError;
    }

    throw new Error('Failed to update user');
  }
};

/** Contact a user */
export const contactUser = async (
  userId: string,
  message: {
    email: string;
    subject: string;
    body: string;
  }
) => {
  try {
    const response = await axios.post(
      `${API_URL}/users/contact/${userId}`,
      message
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to contact user: ${error}`);
  }
};

export const claimEurAccount = async () => {
  const response = await axios.post(
    `${API_URL}/users/bridge/claim/eur`,
    {},
    await withAuthHeader()
  );
  return response.data;
};

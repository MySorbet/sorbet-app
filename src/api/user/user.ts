import axios, { AxiosError } from 'axios';

import { env } from '@/lib/env';
import { MinimalUser, User, UserWithId } from '@/types';

import { withAuthHeader } from '../withAuthHeader';

const API_URL = env.NEXT_PUBLIC_SORBET_API_URL;

/**
 * Get a user from the db by their handle
 * @throws what axios throws
 */
export const getUserByHandle = async (handle: string) => {
  const response = await axios.get<User>(`${API_URL}/users/handle/${handle}`);
  return response.data;
};

/** Get a user from the db by their privy id */
export const getUserByPrivyId = async (id: string) => {
  try {
    const response = await axios.get<User>(`${API_URL}/users/privy/${id}`);
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        `Failed to get user by privy id: ${error.response?.data.message}`
      );
    } else {
      throw new Error(`Failed to get user by account id: ${error}`);
    }
  }
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
  } catch (error: any) {
    throw new Error(
      `Failed to delete profile image: ${error.response.data.message}`
    );
  }
};

/**
 * Get a user from the db by their email
 */
export const getUserByEmail = async (email: string) => {
  try {
    const response = await axios.get(`${API_URL}/users/email/${email}`);
    return response;
  } catch (error) {
    console.log(`Failed to get user by email: ${JSON.stringify(error)}`);
  }
};

/** Update a user's profile */
export const updateUser = async (userToUpdate: UserWithId, userId: string) => {
  try {
    const response = await axios.patch<MinimalUser>(
      `${API_URL}/users/${userId}`,
      userToUpdate,
      await withAuthHeader()
    );
    return response;
  } catch (error: any) {
    throw new Error(`Failed to update user: ${error.response.data.message}`);
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

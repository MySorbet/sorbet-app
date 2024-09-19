import axios, { AxiosError } from 'axios';

import { User, UserWithId } from '@/types';
import { API_URL, withAuthHeader } from '@/utils';

/** Get a user from the db by their handle */
export const getUserByHandle = async (handle: string) => {
  try {
    const response = await axios.get<User>(`${API_URL}/users/handle/${handle}`);
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        `Failed to get user by handle: ${error.response?.data.message}`
      );
    } else {
      throw new Error(`Failed to get user by handle: ${error}`);
    }
  }
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
    const res = await axios.get(
      `${API_URL}/users/${userId}/wallet`,
      await withAuthHeader()
    );
    return res;
  } catch (error: any) {
    throw new Error(`Failed to get Address: ${error.response.data.message}`);
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
 * 🛑 CURRENTLY THIS ENDPOINT DOES NOT WORK 🛑
 */
export const getUserByEmail = async (email: string) => {
  try {
    const response = await axios.get(`${API_URL}/users/email/${email}`);
    return response;
  } catch (error: any) {
    console.log(`Failed to get user by email: ${JSON.stringify(error)}`);
  }
};

/** Update a user's profile */
export const updateUser = async (userToUpdate: UserWithId, userId: string) => {
  try {
    const response = await axios.patch(
      `${API_URL}/users/${userId}`,
      userToUpdate,
      await withAuthHeader()
    );
    return response;
  } catch (error: any) {
    throw new Error(`Failed to update user: ${error.response.data.message}`);
  }
};

/**
 * Get a user's balances
 * 🛑 CURRENTLY THIS ENDPOINT DOES NOT WORK 🛑
 */
export const getBalances = async (userId: string) => {
  try {
    const res = await axios.get(
      `${API_URL}/users/${userId}/balances`,
      await withAuthHeader()
    );
    return res;
  } catch (error: any) {
    throw new Error(`Failed to get balances: ${error.response.data.message}`);
  }
};

/**
 * Get a user's transaction overview
 * 🛑 CURRENTLY THIS ENDPOINT DOES NOT WORK 🛑
 */
export const getOverview = async (last_days = 30) => {
  try {
    const res = await axios.get(
      `${API_URL}/transactions/overview?last_days=${last_days}`,
      await withAuthHeader()
    );
    return res;
  } catch (error: any) {
    throw new Error(`Failed to get overview`);
  }
};

/**
 * Get a user's transactions
 * 🛑 CURRENTLY THIS ENDPOINT DOES NOT WORK 🛑
 */
export const getTransactions = async (
  page = 1,
  limit = 20,
  order = 'desc',
  after_date?: string,
  before_date?: string
) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    order,
  });

  if (after_date) {
    queryParams.append('after_date', after_date);
  }

  if (before_date) {
    queryParams.append('before_date', before_date);
  }

  try {
    const res = await axios.get(
      `${API_URL}/transactions?${queryParams.toString()}`,
      await withAuthHeader()
    );
    return res;
  } catch (error: any) {
    throw new Error(`Failed to get transactions`);
  }
};

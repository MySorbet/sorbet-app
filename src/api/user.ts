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

// OLD 👇

// [POST] /api/auth/signup
export const getUserFromUserId = async (userId: string) => {
  try {
    const res = await axios.get(`${API_URL}/user/getUserFromUserId/${userId}`);
    return res;
  } catch (error: any) {
    throw new Error(
      `Failed to get get user from userId: ${error.response.data.message}`
    );
  }
};

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

export const getUserByEmail = async (email: string) => {
  try {
    const response = await axios.get(
      `${API_URL}/users/getUserByEmail/${email}`
    );
    return response;
  } catch (error: any) {
    console.log(`Failed to get user by email: ${JSON.stringify(error)}`);
  }
};

export const getUsersBySearch = async (skills: string[], location: string) => {
  const reqBody = { skills, location };

  try {
    const res = await axios.post(`${API_URL}/users/searchUsers`, reqBody);
    return res;
  } catch (error: any) {
    throw new Error(
      `Failed to get users by search: ${error.response.data.message}`
    );
  }
};

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

export const getOverview = async (address: string, last_days = 30) => {
  try {
    const res = await axios.get(
      `${API_URL}/transactions/overview?account=${address}&last_days=${last_days}`,
      await withAuthHeader()
    );
    return res;
  } catch (error: any) {
    throw new Error(`Failed to get overview`);
  }
};

export const getTransactions = async (
  address: string,
  cursor: string = '',
  limit = 20,
  order = 'DESC',
  from_date?: string,
  to_date?: string
) => {
  const queryParams = new URLSearchParams({
    account: address,
    cursor: cursor.toString(),
    limit: limit.toString(),
    order,
  });

  if (from_date) {
    queryParams.append('from_date', from_date);
  }

  if (to_date) {
    queryParams.append('to_date', to_date);
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

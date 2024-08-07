import { User } from '@/types';
import { API_URL, validateToken } from '@/utils';
import axios from 'axios';

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
  const reqHeader = validateToken({}, true);

  try {
    const res = await axios.delete(
      `${API_URL}/images/delete/${userId}`,
      reqHeader
    );
    return res.data;
  } catch (error: any) {
    throw new Error(
      `Failed to delete profile image: ${error.response.data.message}`
    );
  }
};

export const getUserByAccountId = async (accountId: string) => {
  try {
    const response = await axios.get(
      `${API_URL}/users/findByAccountId/${accountId}`
    );
    return response;
  } catch (error: any) {
    console.log(`Failed to get user by account id: ${JSON.stringify(error)}`);
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

export const updateUser = async (userToUpdate: User, userId: string) => {
  const reqHeader = validateToken({}, true);

  try {
    const response = await axios.patch(
      `${API_URL}/users/${userId}`,
      userToUpdate,
      reqHeader
    );
    return response;
  } catch (error: any) {
    throw new Error(`Failed to update user: ${error.response.data.message}`);
  }
};

export const getBalances = async (userId: string) => {
  const reqHeader = validateToken({}, true);

  try {
    const res = await axios.get(
      `${API_URL}/users/${userId}/balances`,
      reqHeader
    );
    return res;
  } catch (error: any) {
    throw new Error(`Failed to get balances: ${error.response.data.message}`);
  }
};

export const getOverview = async (last_days: number = 30) => {
  const reqHeader = validateToken({}, true);

  try {
    const res = await axios.get(
      `${API_URL}/transactions/overview?last_days=${last_days}`,
      reqHeader
    );
    return res;
  } catch (error: any) {
    throw new Error(`Failed to get overview`);
  }
};

export const getTransactions = async (
  page: number = 1,
  limit: number = 20,
  order: string = 'desc',
  after_date?: string,
  before_date?: string
) => {
  const reqHeader = validateToken({}, true);
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
      reqHeader
    );
    return res;
  } catch (error: any) {
    throw new Error(`Failed to get transactions`);
  }
};

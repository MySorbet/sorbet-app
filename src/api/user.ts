import { User } from '@/types';
import { API_URL, validateToken } from '@/utils';
import axios from 'axios';

// [POST] /api/auth/signup
export const getUserFromUserId = async (userId: string) => {
  try {
    const res = await axios.get(`${API_URL}/user/getUserFromUserId/${userId}`);
    return res;
  } catch (error: any) {
    throw new Error(error.response.data.message);
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
    throw new Error(error.response.data.message);
  }
};

export const getUserByAccountId = async (accountId: string) => {
  try {
    const response = await axios.get(
      `${API_URL}/users/findByAccountId/${accountId}`
    );
    return response;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const getUsersBySearch = async (skills: string[], location: string) => {
  const reqBody = { skills, location };

  try {
    const res = await axios.post(`${API_URL}/users/searchUsers`, reqBody);
    return res;
  } catch (error: any) {
    throw new Error(error.response.data.message);
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
    throw new Error(error.response.data.message);
  }
};

export const getTransactions = async (
  userId: string,
  currentPage: number = 1,
  itemsPerPage: number = 20
) => {
  const queryParams = `?page=${currentPage}&limit=${itemsPerPage}`;
  const reqHeader = validateToken({}, true);

  try {
    const res = await axios.get(
      `${API_URL}/transactions/user/${userId}${queryParams}`,
      reqHeader
    );
    return res;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const getBalances = async (userId: string) => {
  const reqHeader = validateToken({}, true);

  try {
    const res = axios.get(`${API_URL}/users/${userId}/balances`, reqHeader);
    return res;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

import { User } from '@/types';
import { API_URL, runApi } from '@/utils';

// [POST] /api/auth/signup

export const getUserFromUserId = async (userId: string) => {
  const res = await runApi(
    'GET',
    `${API_URL}/user/getUserFromUserId/${userId}`
  );

  return res;
};

export const deleteProfileImageAsync = async (userId: string) => {
  const res = await runApi(
    'DELETE',
    `${API_URL}/images/delete/${userId}`,
    {},
    {},
    true
  );
  return res;
};

export const getUserByAccountId = async (accountId: string) => {
  const res = await runApi(
    'GET',
    `${API_URL}/users/findByAccountId/${accountId}`
  );
  return res;
};

export const getUsersBySearch = async (skills: string[], location: string) => {
  const reqBody = { skills, location };
  const res = await runApi('POST', `${API_URL}/users/searchUsers`, reqBody);
  return res;
};

export const updateUser = async (userToUpdate: User, userId: string) => {
  const url = `${API_URL}/users/${userId}`;
  const response = await runApi('PATCH', url, userToUpdate, undefined, true);
  return response.data;
};

export const getBalances = async (userId: string) => {
  const res = await runApi(
    'GET',
    `${API_URL}/users/${userId}/balances`,
    {},
    {},
    true
  );
  return res;
};

export const getOverview = async (last_days: number = 30) => {
  const res = await runApi(
    'GET',
    `${API_URL}/transactions/overview?last_days=${last_days}`,
    {},
    {},
    true
  );
  return res;
};

export const getTransactions = async (
  page: number = 1,
  limit: number = 20,
  order: string = 'desc',
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

  const res = await runApi(
    'GET',
    `${API_URL}/transactions?${queryParams.toString()}`,
    {},
    {},
    true
  );
  return res;
};

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
  const res = await runApi('GET', `${API_URL}/users/findByAccountId/${accountId}`);
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
}

export const getTransactions = async(userId: string, currentPage: number = 1, itemsPerPage: number = 20) => {
  const queryParams = `?page=${currentPage}&limit=${itemsPerPage}`;
  const res = await runApi('GET', `${API_URL}/transactions/user/${userId}${queryParams}`, {}, {}, true);
  return res;
}


export const getBalances = async(userId: string) => {
  const res = await runApi('GET', `${API_URL}/users/${userId}/balances`, {}, {}, true);
  return res;
}
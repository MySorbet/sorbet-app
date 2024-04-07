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
    `${API_URL}/user/deleteUserAvatar/${userId}`
  );
  return res;
};

export const getUsersAll = async () => {
  const res = await runApi('GET', `${API_URL}/users/getAll`);
  return res;
};

export const getUserByAccountId = async (accountId: string) => {
  const res = await runApi('GET', `${API_URL}/users/findByAccountId/${accountId}`);
  return res;
};

export const getUsersBySearch = async (skills: string[], location: string) => {
  const reqBody = { skills, location };
  console.log(reqBody, 'reqbody');
  const res = await runApi('POST', `${API_URL}/users/searchUsers`, reqBody);
  return res;
};

export const updateUser = async (userToUpdate: User, userId: string) => {
  const url = `${API_URL}/users/${userId}`;
  const response = await runApi('PATCH', url, userToUpdate, undefined, true);
  return response.data;
}
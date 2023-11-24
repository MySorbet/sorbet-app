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

export const getWidgetsFromUserId = async (userId: string) => {
  const res = await runApi('GET', `${API_URL}/widgets/findByUserId/${userId}`);
  return res;
};

export const getUsersAll = async () => {
  const res = await runApi('GET', `${API_URL}/user/getAll`);
  return res;
};

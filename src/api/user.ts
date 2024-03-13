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

export const getUsersBySearch = async (skills: string[], location: string) => {
  const reqBody = { skills, location };
  console.log(reqBody, 'reqbody');
  const res = await runApi('POST', `${API_URL}/user/searchUsers`, reqBody);
  return res;
};

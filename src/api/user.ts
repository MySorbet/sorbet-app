import { API_URL, runApi } from '@/utils';

// [POST] /api/auth/signup

export const getUserFromUserId = async (userId: string) => {
  const res = await runApi(
    'GET',
    `${API_URL}/user/getUserFromUserId/${userId}`
  );

  return res;
};

import { API_URL, runApi } from '@/utils';

// FIXME: api is not complete
// [POST] /api/images/uploadProfileImage
export const uploadProfileImageAsync = async (data: FormData) => {
  // const reqBody = {};
  const res = await runApi('POST', `${API_URL}/images/upload`, data);
  return res;
};

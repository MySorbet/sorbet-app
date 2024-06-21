import { API_URL, runApi } from '@/utils';

export const uploadProfileImageAsync = async (data: FormData) => {
  const res = await runApi('POST', `${API_URL}/images/upload`, data, {}, true);
  return res;
};

export const uploadWidgetsImageAsync = async (data: FormData) => {
  const res = await runApi('POST', `${API_URL}/images/widgets`, data, {}, true);
  console.log('res from runApi', res);
  return res;
};

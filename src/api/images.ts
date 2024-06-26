import { API_URL, runApi, validateToken } from '@/utils';
import axios from 'axios';

export const uploadProfileImageAsync = async (data: FormData) => {
  const apiReqHeader = validateToken({}, true);
  try {
    const response = await axios.post(
      `${API_URL}/images/upload`,
      data,
      apiReqHeader
    );

    return response;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const uploadWidgetsImageAsync = async (data: FormData) => {
  const res = await runApi('POST', `${API_URL}/images/widgets`, data, {}, true);
  console.log('res from runApi', res);
  return res;
};

export const uploadWidgetsImageAsync2 = async (data: FormData) => {
  const apiReqHeaders = validateToken({}, true);

  try {
    const response = await axios.post(
      `${API_URL}/images/widgets`,
      data,
      apiReqHeaders
    );
    return response;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

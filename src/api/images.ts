import { API_URL, validateToken } from '@/utils';
import axios from 'axios';

export const uploadProfileImageAsync = async (data: FormData) => {
  const reqHeader = validateToken({}, true);
  try {
    const response = await axios.post(
      `${API_URL}/images/upload`,
      data,
      reqHeader
    );

    return response;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const uploadWidgetsImageAsync = async (data: FormData) => {
  const reqHeader = validateToken({}, true);

  try {
    const response = await axios.post(
      `${API_URL}/images/widgets`,
      data,
      reqHeader
    );
    return response;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

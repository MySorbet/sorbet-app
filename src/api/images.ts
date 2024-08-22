import axios, { AxiosError } from 'axios';

import { API_URL, withAuthHeader } from '@/utils';

export const uploadProfileImageAsync = async (data: FormData) => {
  try {
    const response = await axios.post(
      `${API_URL}/images/upload`,
      data,
      await withAuthHeader()
    );

    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        `Failed to upload profile image: ${error.response?.data.message}`
      );
    } else {
      throw new Error(`Failed to upload profile image: ${error}`);
    }
  }
};

export const uploadWidgetsImageAsync = async (data: FormData) => {
  try {
    const response = await axios.post(
      `${API_URL}/images/widgets`,
      data,
      await withAuthHeader()
    );
    return response;
  } catch (error: any) {
    throw new Error(
      `Failed to upload widgets image: ${error.response.data.message}`
    );
  }
};

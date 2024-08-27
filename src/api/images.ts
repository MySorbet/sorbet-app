import axios from 'axios';

import { API_URL, withAuthHeader } from '@/utils';

export const uploadProfileImageAsync = async (data: FormData) => {
  try {
    const response = await axios.post(
      `${API_URL}/images/upload`,
      data,
      withAuthHeader()
    );

    return response;
  } catch (error: any) {
    throw new Error(
      `Failed to upload profile image: ${error.response.data.message}`
    );
  }
};

export const uploadWidgetsImageAsync = async (data: FormData) => {
  try {
    const response = await axios.post(
      `${API_URL}/images/widgets`,
      data,
      withAuthHeader()
    );
    return response;
  } catch (error: any) {
    throw new Error(
      `Failed to upload widgets image: ${error.response.data.message}`
    );
  }
};

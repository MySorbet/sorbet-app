import axios, { AxiosError } from 'axios';

import { env } from '@/lib/env';

import { withAuthHeader } from './with-auth-header';

const API_URL = env.NEXT_PUBLIC_SORBET_API_URL;

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

export const uploadWidgetsImageAsync = async (
  data: FormData,
  options?: {
    signal?: AbortSignal;
  }
) => {
  try {
    const response = await axios.post(
      `${API_URL}/images/widgets`,
      data,
      await withAuthHeader({
        signal: options?.signal,
      })
    );
    return response;
  } catch (error) {
    if (axios.isCancel(error)) {
      throw error;
    }
    if (error instanceof AxiosError) {
      throw new Error(
        `Failed to upload widget image: ${error.response?.data.message}`
      );
    } else {
      throw new Error(`Failed to upload widget image: ${error}`);
    }
  }
};

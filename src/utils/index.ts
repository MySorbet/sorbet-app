'use client';

import { AxiosRequestConfig } from 'axios';

import { config } from '@/lib/config';
import { getAccessToken } from '@privy-io/react-auth';

// TODO: remove this abstraction
export const API_URL = config.sorbetApiUrl;

/** Adds an "Authorization: Bearer: xyz " header to an optionally provided given axios config.
 * If no config is provided, a new one is created with the Authorization header.
 *
 * If an error occurs getting the token, the error is logged and the original config is returned.
 * In case there is no original config, {} is returned.
 *
 * @example
 * const response = await axios.get('/api/endpoint', await withAuthHeader());
 */
export const withAuthHeader = async (
  config: AxiosRequestConfig = {}
): Promise<AxiosRequestConfig> => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${accessToken.replace(/['"]+/g, '')}`,
      },
    };
  } else {
    console.error('No access token found in local storage');
    return config;
  }
};

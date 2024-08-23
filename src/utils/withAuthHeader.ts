import { getAccessToken } from '@privy-io/react-auth';
import { AxiosRequestConfig } from 'axios';

/** Adds an "Authorization: Bearer: xyz " header to an optionally provided given axios config.
 * If no config is provided, a new one is created with the Authorization header.
 *
 * If an error occurs getting the token, the error is logged and the original config is returned.
 * In case there is no original config, {} is returned.
 *
 * The auth token is privy issued and fetched from local storage. Privy will refresh it before returning if need be.
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
        Authorization: `Bearer ${accessToken}`,
      },
    };
  } else {
    console.error('No access token found in local storage');
    return config;
  }
};

'use client';

import { config } from '@/lib/config';

// TODO: remove this abstraction
export const API_URL = config.sorbetApiUrl;

export const validateToken = (headers?: any, includeAuth: boolean = false) => {
  let reqHeader = { headers };

  if (includeAuth) {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      reqHeader = {
        ...reqHeader,
        headers: {
          ...reqHeader.headers,
          Authorization: `Bearer ${accessToken.replace(/['"]+/g, '')}`,
        },
      };
    }
  }

  return reqHeader;
};

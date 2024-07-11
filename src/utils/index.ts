'use client';

import { config } from '@/lib/config';

export const API_URL = config.devApiUrl;

export const validateToken = (headers?: any, includeAuth: boolean = false) => {
  let apiReqHeader = { headers };

  if (includeAuth) {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      apiReqHeader = {
        ...apiReqHeader,
        headers: {
          ...apiReqHeader.headers,
          Authorization: `Bearer ${accessToken.replace(/['"]+/g, '')}`,
        },
      };
    }
  }

  return apiReqHeader;
};

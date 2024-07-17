'use client';

import { FormattedResponse } from '../types';
import { config } from '@/lib/config';
import axios from 'axios';

export const API_URL = config.devApiUrl;

export const getFormatedResponse = (res: any): FormattedResponse => {
  let response: FormattedResponse;

  if (res?.status === 200 || res?.status === 201) {
    response = {
      status: 'success',
      statusCode: res?.data?.statusCode || res?.status,
      message: 'Request was successful',
      data: res?.data,
    };
  } else {
    response = {
      status: 'failed',
      statusCode: res?.data.statusCode,
      message: res?.data.message,
      data: null,
    };
  }

  return response;
};

export const runApi = async (
  type: string,
  url: string,
  reqBody?: any,
  headers?: any,
  includeAuth: boolean = false
) => {
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

  try {
    let res: any;
    if (type === 'GET') {
      res = await axios.get(url, apiReqHeader);
    } else if (type === 'POST') {
      res = await axios.post(url, reqBody, apiReqHeader);
    } else if (type === 'PATCH') {
      res = await axios.patch(url, reqBody, apiReqHeader);
    } else if (type === 'DELETE') {
      res = await axios.delete(url, apiReqHeader);
    }
    return getFormatedResponse(res);
  } catch (error: any) {
    return getFormatedResponse(error.response);
  }
};

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


export function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}


export const decodeIfTruthy = (paramVal: any) => {
  if (paramVal === 'true' || paramVal === 'false') return paramVal === 'true';
  if (paramVal) {
    return decodeURIComponent(paramVal);
  }

  return paramVal;
};


export function isUrlNotJavascriptProtocol(url: any) {
  if (!url) {
    return true;
  }
  try {
    const urlProtocol = new URL(url).protocol;
    // eslint-disable-next-line no-script-url
    if (urlProtocol === 'javascript:') {
      console.log('Invalid URL protocol:', urlProtocol, 'URL cannot execute JavaScript');
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
}

export const deleteOidcKeyPairOnLocalStorage = () => {
  const itemCount = localStorage.length;
  for (let i = 0; i < itemCount; i += 1) {
    const key = localStorage.key(i);
    if (key && key.startsWith('near-api-js:keystore:oidc_keypair')) {
      console.log(`removing ${key} from localStorage`);
      localStorage.removeItem(key);
    }
  }
};

// Use this function to implement wait logic for async process
export const withTimeout = async (promise, timeoutMs) => {
  // Create a promise that resolves with false after timeoutMs milliseconds
  const timeoutPromise = new Promise((resolve) => { setTimeout(() => resolve(false), timeoutMs); });

  // Race the input promise against the timeout
  return Promise.race([promise, timeoutPromise]);
};


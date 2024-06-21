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

'use client';

import { FormattedResponse } from '../types';
import axios from 'axios';
import { config } from '@/lib/config';

export const _API_URL = config.devApiUrl;
// export const API_URL = `${_API_URL}/api`;
export const API_URL = `${_API_URL}`;

export const getFormatedResponse = (res: any): FormattedResponse => {
  let response: FormattedResponse;

  if ((res?.status === 200 || res?.status === 201) && res.data != '') {
    response = {
      status: 'success',
      statusCode: res?.data?.statusCode || res?.status,
      message: 'API get success',
      data: res?.data,
    };
  } else {
    response = {
      status: 'failed',
      statusCode: res?.data?.statusCode || res?.status,
      message: '',
      data: null,
    };
  }

  return response;
};

const user = {
  accessToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRldmFyaWYubWVAZ21haWwuY29tIiwiaWQiOiI2Mzk0MmVmZmRjZTAwNTkyOGUyZDNhZTEiLCJpYXQiOjE2NzA3NTE2ODIsImV4cCI6MTY3MDgzODA4Mn0.mRveNOT1swTpfpkliWVf628nFvweEzPywyV6WQXv71A',
  bio: 'Developer',
  email: 'devarif.me@gmail.com',
  firstName: 'Md Arif',
  lastName: 'Hossain',
  profileImage: null,
};

export const apiReqHeader = {
  headers: {
    Authorization: `Bearer ${user.accessToken}`,
  },
};

export const runApi = async (type: string, url: string, reqBody?: any) => {
  // console.log(type, url, reqBody)
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
    // console.log(res)
    return getFormatedResponse(res);
  } catch (error: any) {
    console.log(error);
    return getFormatedResponse(error.response);
  }
};

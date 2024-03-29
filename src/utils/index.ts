'use client';

import { FormattedResponse } from '../types';
import axios from 'axios';
import { config } from '@/lib/config';

export const API_URL = config.devApiUrl;

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


export const runApi = async (type: string, url: string, reqBody?: any, headers?: any) => {
  const apiReqHeader = { headers };
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
    console.log(error);
    return getFormatedResponse(error.response);
  }
};

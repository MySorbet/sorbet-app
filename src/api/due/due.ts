import axios from 'axios';

import { env } from '@/lib/env';
import type { DueCustomer, DueVirtualAccount } from '@/types/due';

import { withAuthHeader } from '../with-auth-header';

const API_URL = env.NEXT_PUBLIC_SORBET_API_URL;

export const verifyDueUser = async () => {
  const response = await axios.post<DueCustomer>(
    `${API_URL}/users/due/verify`,
    {},
    await withAuthHeader()
  );
  return response.data;
};

export const getDueCustomer = async () => {
  const response = await axios.get<DueCustomer>(
    `${API_URL}/users/due/customer`,
    await withAuthHeader()
  );
  return response.data;
};

export const getDueVirtualAccounts = async () => {
  const response = await axios.get<DueVirtualAccount[]>(
    `${API_URL}/users/due/virtual-accounts`,
    await withAuthHeader()
  );
  return response.data;
};

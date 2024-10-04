import axios, { AxiosError } from 'axios';

import { env } from '@/lib/env';

import { withAuthHeader } from './withAuthHeader';

const API_URL = env.NEXT_PUBLIC_SORBET_API_URL;

export const getOverview = async (address: string, last_days = 30) => {
  try {
    const res = await axios.get(
      `${API_URL}/transactions/overview?account=${address}&last_days=${last_days}`,
      await withAuthHeader()
    );
    return res;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        `Failed to get overview: ${error.response?.data.message}`
      );
    } else {
      throw new Error(`Failed to get overview: ${error}`);
    }
  }
};

/**
 * Get a user's transactions
 */
export const getTransactions = async (
  address: string,
  cursor = '',
  limit = 20,
  order = 'DESC',
  from_date?: string,
  to_date?: string
) => {
  const queryParams = new URLSearchParams({
    account: address,
    cursor: cursor.toString(),
    limit: limit.toString(),
    order,
  });

  if (from_date) {
    queryParams.append('from_date', from_date);
  }

  if (to_date) {
    queryParams.append('to_date', to_date);
  }

  try {
    const res = await axios.get(
      `${API_URL}/transactions?${queryParams.toString()}`,
      await withAuthHeader()
    );
    return res;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        `Failed to get transactions: ${error.response?.data.message}`
      );
    } else {
      throw new Error(`Failed to get transactions: ${error}`);
    }
  }
};

import axios, { AxiosError } from 'axios';

import { env } from '@/lib/env';
import {
  TransactionOverview,
  TransactionsResponse,
  UnifiedTransactionsResponse,
  UnifiedTransactionType,
} from '@/types/transactions';

import { withAuthHeader } from '../with-auth-header';

const API_URL = env.NEXT_PUBLIC_SORBET_API_URL;

export const getOverview = async (last_days?: number) => {
  const queryParams = new URLSearchParams();
  if (last_days !== undefined) {
    queryParams.append('last_days', last_days.toString());
  }

  try {
    const res = await axios.get<TransactionOverview>(
      `${API_URL}/transactions/overview?${queryParams.toString()}`,
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
 * Get a user's transactions (legacy endpoint)
 * @deprecated Use getUnifiedTransactions instead
 */
export const getTransactions = async (
  cursor = '',
  limit = 20,
  order = 'DESC',
  from_date?: string,
  to_date?: string
) => {
  const queryParams = new URLSearchParams({
    cursor: cursor.toString(),
    limit: limit.toString(),
    order,
  });
  from_date && queryParams.append('from_date', from_date);
  to_date && queryParams.append('to_date', to_date);

  try {
    const res = await axios.get<TransactionsResponse>(
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

/**
 * Get unified transactions from all sources (Moralis, Bridge VA, Bridge LA)
 * This is the new API that combines onramp, offramp, and crypto transfers
 */
export const getUnifiedTransactions = async (options?: {
  type?: UnifiedTransactionType;
  fromDate?: string;
  toDate?: string;
  limit?: number;
  cursor?: string;
}) => {
  const queryParams = new URLSearchParams();

  if (options?.type) queryParams.append('type', options.type);
  if (options?.fromDate) queryParams.append('from_date', options.fromDate);
  if (options?.toDate) queryParams.append('to_date', options.toDate);
  if (options?.limit) queryParams.append('limit', options.limit.toString());
  if (options?.cursor) queryParams.append('cursor', options.cursor);

  try {
    const res = await axios.get<UnifiedTransactionsResponse>(
      `${API_URL}/transactions/unified?${queryParams.toString()}`,
      await withAuthHeader()
    );
    return res;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        `Failed to get unified transactions: ${error.response?.data.message}`
      );
    } else {
      throw new Error(`Failed to get unified transactions: ${error}`);
    }
  }
};

import axios from 'axios';

import { env } from '@/lib/env';

import { withAuthHeader } from '../with-auth-header';
import {
  CreateRecipientDto,
  MigrateRecipientDto,
  PrepareTransferResponse,
  RecipientAPI,
  RecipientAPIBankDetailed,
  RecipientTransfer,
} from './types';

const API_URL = env.NEXT_PUBLIC_SORBET_API_URL;

export const recipientsApi = {
  create: async (data: CreateRecipientDto) => {
    const response = await axios.post<RecipientAPI>(
      `${API_URL}/recipients`,
      data,
      await withAuthHeader()
    );
    return response.data;
  },

  getRecipients: async () => {
    const response = await axios.get<RecipientAPI[]>(
      `${API_URL}/recipients`,
      await withAuthHeader()
    );
    return response.data;
  },

  delete: async (recipientId: string) => {
    const response = await axios.delete(
      `${API_URL}/recipients/${recipientId}`,
      await withAuthHeader()
    );
    return response.data;
  },

  getRecipientDetails: async (recipientId: string) => {
    const response = await axios.get<RecipientAPIBankDetailed>(
      `${API_URL}/recipients/${recipientId}`,
      await withAuthHeader()
    );
    return response.data;
  },

  getRecipientTransfers: async (recipientId: string) => {
    const response = await axios.get<RecipientTransfer[]>(
      `${API_URL}/recipients/${recipientId}/transfers`,
      await withAuthHeader()
    );
    return response.data;
  },

  /**
   * Migrate a Bridge recipient to Due Network
   */
  migrate: async (recipientId: string, data: MigrateRecipientDto) => {
    const response = await axios.post<RecipientAPI>(
      `${API_URL}/recipients/${recipientId}/migrate`,
      data,
      await withAuthHeader()
    );
    return response.data;
  },

  /**
   * For ACH/WIRE recipients: creates a Due transfer quote, transfer, and disposable
   * funding address. Returns the address to send USDC to along with the exact amount.
   */
  prepareTransfer: async (
    recipientId: string,
    amount: string,
    senderAddress: string,
    purposeCode: string
  ): Promise<PrepareTransferResponse> => {
    const response = await axios.post<PrepareTransferResponse>(
      `${API_URL}/recipients/${recipientId}/prepare-transfer`,
      { amount, senderAddress, purposeCode },
      await withAuthHeader()
    );
    return response.data;
  },

  /**
   * Returns allowed purpose codes for a given ACH/WIRE payment method.
   * e.g. paymentMethod = 'usd_ach' | 'usd_wire'
   */
  getPurposeCodes: async (
    paymentMethod: string
  ): Promise<{ purposeCodes: string[]; required: boolean }> => {
    const response = await axios.get<{ purposeCodes: string[]; required: boolean }>(
      `${API_URL}/recipients/purpose-codes`,
      {
        params: { paymentMethod },
        ...(await withAuthHeader()),
      }
    );
    return response.data;
  },
};

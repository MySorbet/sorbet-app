import axios from 'axios';

import { env } from '@/lib/env';

import { withAuthHeader } from '../with-auth-header';
import {
  CreateRecipientDto,
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
};

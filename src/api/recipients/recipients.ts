import axios from 'axios';

import { CreateRecipientDto, RecipientAPI } from '@/api/recipients/types';
import { env } from '@/lib/env';

import { withAuthHeader } from '../with-auth-header';

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
};

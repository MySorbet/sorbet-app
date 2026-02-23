import axios from 'axios';

import { env } from '@/lib/env';

import { withAuthHeader } from '../with-auth-header';
import { ClientAPI, CreateClientDto, UpdateClientDto } from './types';

const API_URL = env.NEXT_PUBLIC_SORBET_API_URL;

export const clientsApi = {
  create: async (data: CreateClientDto) => {
    const response = await axios.post<ClientAPI>(
      `${API_URL}/clients`,
      data,
      await withAuthHeader()
    );
    return response.data;
  },

  getClients: async () => {
    const response = await axios.get<ClientAPI[]>(
      `${API_URL}/clients`,
      await withAuthHeader()
    );
    return response.data;
  },

  getClientDetails: async (clientId: string) => {
    const response = await axios.get<ClientAPI>(
      `${API_URL}/clients/${clientId}`,
      await withAuthHeader()
    );
    return response.data;
  },

  update: async (clientId: string, data: UpdateClientDto) => {
    const response = await axios.put<ClientAPI>(
      `${API_URL}/clients/${clientId}`,
      data,
      await withAuthHeader()
    );
    return response.data;
  },

  delete: async (clientId: string) => {
    const response = await axios.delete(
      `${API_URL}/clients/${clientId}`,
      await withAuthHeader()
    );
    return response.data;
  },
};

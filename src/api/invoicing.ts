import axios from 'axios';

import { env } from '@/lib/env';

import { withAuthHeader } from './with-auth-header';

const API_URL = env.NEXT_PUBLIC_SORBET_API_URL;

export interface InvoicingDetails {
  businessName?: string;
  taxId?: string;
  street?: string;
  state?: string;
  city?: string;
  country?: string;
  postalCode?: string;
}

export const getInvoicingDetails = async (userId: string) => {
  const response = await axios.get(
    `${API_URL}/users/${userId}/invoicing`,
    await withAuthHeader()
  );
  return response.data;
};

export const updateInvoicingDetails = async (
  userId: string,
  data: InvoicingDetails
) => {
  const response = await axios.patch(
    `${API_URL}/users/${userId}/invoicing`,
    data,
    await withAuthHeader()
  );
  return response.data;
};

import axios from 'axios';

import { env } from '@/lib/env';

const API_URL = env.NEXT_PUBLIC_SORBET_API_URL;

export type PublicAccountUser = {
  firstName: string | null;
  lastName: string | null;
  handle: string;
  profileImage: string | null;
};

export type PublicAccount = {
  schema: string;
  details: Record<string, unknown>;
};

export type PublicAccountsResponse = {
  user: PublicAccountUser;
  accounts: PublicAccount[];
};

/**
 * Fetch a user's public bank account details by their handle.
 * No auth required — used on the public accounts sharing page.
 */
export const getPublicAccountsByHandle = async (
  handle: string
): Promise<PublicAccountsResponse> => {
  const response = await axios.get<PublicAccountsResponse>(
    `${API_URL}/users/handle/${handle}/accounts`
  );
  return response.data;
};

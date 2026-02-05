import axios, { AxiosError } from 'axios';

import { env } from '@/lib/env';

import { withAuthHeader } from '../with-auth-header';

export type SorbetChain = 'base' | 'stellar';

const API_URL = env.NEXT_PUBLIC_SORBET_API_URL;

export const getMyChain = async (): Promise<{ chain: SorbetChain }> => {
  const res = await axios.get<{ chain: SorbetChain }>(
    `${API_URL}/users/me/chain`,
    await withAuthHeader()
  );
  return res.data;
};

export const setMyChain = async (chain: SorbetChain): Promise<{ chain: SorbetChain }> => {
  try {
    const res = await axios.patch<{ chain: SorbetChain }>(
      `${API_URL}/users/me/chain`,
      { chain },
      await withAuthHeader()
    );
    return res.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const message =
        (error.response?.data as any)?.message ?? error.message ?? 'Unknown error';
      throw new Error(String(message));
    }
    throw error;
  }
};


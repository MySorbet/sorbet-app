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

/** Accept Due Terms of Service (manual flow). Client IP is extracted server-side. */
export const acceptDueTos = async () => {
  const response = await axios.post<DueCustomer>(
    `${API_URL}/users/due/tos/accept`,
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

export type ClaimableCurrency = 'usd' | 'eur' | 'aed';

export type DueFeeStructure = {
  paymentMethod:
    | 'usd_ach'
    | 'usd_wire'
    | 'usd_swift'
    | 'eur_sepa'
    | 'eur_swift'
    | 'aed_local';
  rail: string;
  currencyCode: string;
  channelType: 'deposit' | 'static_deposit' | 'withdrawal';
  accountType: 'any' | 'individual' | 'business';
  dueFeeBps: number;
  dueFixedFee: string;
  sorbetFeeBps: number;
  sorbetFixedFee: string;
  totalFeeBps: number;
  totalFixedFee: string;
  duePurposeRequired: boolean;
  speed: string | null;
  limitMin: string | null;
  limitMax: string | null;
  syncedAt: string;
  updatedAt: string;
};

/**
 * Claim a Due virtual account on-demand.
 * @param currency - The currency to claim ('usd' | 'eur' | 'aed')
 */
export const claimDueVirtualAccount = async (currency: ClaimableCurrency) => {
  const response = await axios.post<DueVirtualAccount>(
    `${API_URL}/users/due/claim/${currency}`,
    {},
    await withAuthHeader()
  );
  return response.data;
};

export const getDueFeeStructures = async () => {
  const response = await axios.get<DueFeeStructure[]>(
    `${API_URL}/users/due/fee-structures`,
    await withAuthHeader()
  );
  return response.data;
};

/**
 * Fetch Due virtual account bank details for a specific schema by userId.
 * No auth required — called from public invoice pages.
 */
export const getDueBankDetails = async (
  userId: string,
  schema: string
): Promise<unknown> => {
  const response = await axios.get(
    `${API_URL}/users/${userId}/due/bank-details`,
    { params: { schema } }
  );
  return response.data;
};

/** Get the live mid-rate for a currency pair (e.g. EUR → USD) from Due . */
export const getFxRate = async (
  from: string,
  to: string
): Promise<{ rate: number }> => {
  const response = await axios.get<{ rate: number }>(
    `${API_URL}/users/due/fx-rate`,
    {
      params: { from, to },
      ...(await withAuthHeader()),
    }
  );
  return response.data;
};


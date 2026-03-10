import axios from 'axios';

import { env } from '@/lib/env';
import {
  BridgeCustomer,
  SourceDepositInstructions,
  SourceDepositInstructionsEUR,
} from '@/types';

import { withAuthHeader } from '../with-auth-header';

const API_URL = env.NEXT_PUBLIC_SORBET_API_URL;

/** Kick off a verification process for a user. This will return a BridgeCustomer object*/
export const verifyUser = async () => {
  const response = await axios.post<BridgeCustomer>(
    `${API_URL}/users/bridge/verify`,
    {},
    await withAuthHeader()
  );
  return response.data;
};

/** Get the bridge customer for the authed user */
export const getBridgeCustomer = async () => {
  const response = await axios.get<BridgeCustomer>(
    `${API_URL}/users/bridge/customer`,
    await withAuthHeader()
  );
  return response.data;
};

/** Get the ACH wire details for a user */
export const getACHWireDetails = async (userId: string) => {
  const response = await axios.get<SourceDepositInstructions>(
    `${API_URL}/users/${userId}/ach`
  );
  return response.data;
};

/** Get the SEPA  details for a user */
export const getSEPADetails = async (userId: string) => {
  const response = await axios.get<SourceDepositInstructionsEUR>(
    `${API_URL}/users/${userId}/sepa`
  );
  return response.data;
};

/** Upload a document for a user */
export const uploadPOA = async (file: File) => {
  const response = await axios.postForm(
    `${API_URL}/users/bridge/proof-of-address`,
    { file },
    await withAuthHeader()
  );
  return response.data;
};

export const claimVirtualAccount = async (type: 'usd' | 'eur') => {
  const response = await axios.post(
    `${API_URL}/users/bridge/claim/${type}`,
    {},
    await withAuthHeader()
  );
  return response.data;
};

export type BankExportAccount =
  | { type: 'USD'; details: SourceDepositInstructions }
  | { type: 'EUR'; details: SourceDepositInstructionsEUR };

export type DueBankExportAccount = {
  schema: string;
  currencyIn: string;
  details: Record<string, unknown>;
};

export type BankExportData = {
  bridge: {
    kycApproved: boolean;
    accounts: BankExportAccount[];
  };
  due: {
    kycApproved: boolean;
    accounts: DueBankExportAccount[];
  };
};

/** Fetch aggregated bank account export data for the authenticated user. */
export const getBankExport = async (): Promise<BankExportData> => {
  const response = await axios.get<BankExportData>(
    `${API_URL}/users/bank-export`,
    await withAuthHeader()
  );
  return response.data;
};

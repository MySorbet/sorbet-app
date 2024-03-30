import { API_URL, runApi } from '@/utils';

import { SignInWithEmailTypes, SignUpWithEmailTypes } from '@/types/auth';
import { User } from '@/types';

export const signUpAsync = async ({
  firstName,
  lastName,
  email,
  accountId,
}: SignUpWithEmailTypes) => {
  const reqBody = { firstName, lastName, email, accountId };
  const res = await runApi('POST', `${API_URL}/auth/signup/email`, reqBody);
  return res;
};

export const signInAsync = async ({ email }: SignInWithEmailTypes) => {
  const reqBody = { email };
  const res = await runApi('POST', `${API_URL}/auth/signin/email`, reqBody);
  return res;
};

// [POST] /api/auth/signin
export const signInWithWallet = async (address: string) => {
  const reqBody = { address };
  const res = await runApi('POST', `${API_URL}/auth/signin/wallet`, reqBody);
  return res;
};

// [POST] /api/auth/signin
export const signUpWithWallet = async (
  address: string,
  email: string | null,
  phone: string | null
) => {
  const reqBody = { address, email, phone };
  const res = await runApi('POST', `${API_URL}/auth/signup/wallet`, reqBody);
  return res;
};

export const fetchUserDetails = async (token: string) => {
  const headers = { Authorization: `Bearer ${token}` };
  const res = await runApi('GET', `${API_URL}/auth/me`, null, headers);
  return res;
};

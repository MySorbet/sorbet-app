import { API_URL, runApi } from '@/utils';

import { SignInWithEmailTypes, SignUpWithEmailTypes } from '@/types/auth';

export const signUpAsync = async ({
  firstName,
  lastName,
  email,
  accountId,
}: SignUpWithEmailTypes) => {
  const reqBody = { firstName, lastName, email, accountId };
  const res = await runApi('POST', `${API_URL}/auth/signUpWithEmail`, reqBody);
  return res;
};

export const signInAsync = async ({ email }: SignInWithEmailTypes) => {
  const reqBody = { email };
  const res = await runApi('POST', `${API_URL}/auth/signinWithEmail`, reqBody);
  return res;
};

// [POST] /api/auth/signin
export const signInWithWallet = async (address: string) => {
  const reqBody = { address };
  const res = await runApi('POST', `${API_URL}/auth/signInWithWallet`, reqBody);
  return res;
};

// [POST] /api/auth/signin
export const signUpWithWallet = async (
  address: string,
  email: string | null,
  phone: string | null
) => {
  const reqBody = { address, email, phone };
  const res = await runApi('POST', `${API_URL}/auth/signUpWithWallet`, reqBody);
  return res;
};

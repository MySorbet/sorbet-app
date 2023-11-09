import { API_URL, runApi } from '@/utils';

import { SigninTypes, SignupTypes } from '@/types/auth';

// [POST] /api/auth/signup
export const signUpAsync = async ({
  firstName,
  lastName,
  email,
  accountId,
}: SignupTypes) => {
  const reqBody = { firstName, lastName, email, accountId };
  const res = await runApi('POST', `${API_URL}/customuser/signup`, reqBody);
  return res;
};

export const signInAsync = async ({ email, accountId }: SigninTypes) => {
  const reqBody = { email, accountId };
  const res = await runApi('POST', `${API_URL}/customuser/signin`, reqBody);
  // console.log("signInAsync | res", res);
  return res;
};

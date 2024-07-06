import { currentNetwork } from '@/lib/config';
import { User } from '@/types';
import { SignInWithEmailTypes, SignUpWithEmailTypes } from '@/types/auth';
import { API_URL, getFormatedResponse, runApi } from '@/utils';
import axios from 'axios';

export const signUpAsync = async ({
  firstName,
  lastName,
  email,
  accountId,
  userType,
}: SignUpWithEmailTypes) => {
  try {
    const reqBody = { firstName, lastName, email, accountId, userType };
    const res = await axios.post(`${API_URL}/auth/signup/email`, reqBody);
    return res;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const signInAsync = async ({ email }: SignInWithEmailTypes) => {
  try {
    const reqBody = { email };
    const res = await axios.post(`${API_URL}/auth/signin/email`, reqBody);
    return res;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

// [POST] /api/auth/signin
// export const signInWithWallet = async (address: string) => {
//   const reqBody = { address };
//   const res = await runApi('POST', `${API_URL}/auth/signin/wallet`, reqBody);
//   return res;
// };

export const signInWithWallet = async (address: string) => {
  const reqBody = { address };
  try {
    const res = await axios.post(`${API_URL}/auth/signin/wallet`, reqBody);
    return res;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

// [POST] /api/auth/signin
// export const signUpWithWallet = async (
//   address: string,
//   email: string | null,
//   phone: string | null
// ) => {
//   const reqBody = { address, email, phone };
//   const res = await runApi('POST', `${API_URL}/auth/signup/wallet`, reqBody);
//   return res;
// };

export const signUpWithWallet = async (
  address: string,
  email: string | null,
  phone: string | null
) => {
  const reqBody = { address, email, phone };

  try {
    const res = axios.post(`${API_URL}/auth/signup/wallet`, reqBody);
    return res;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

// export const fetchUserDetails = async (token: string) => {
//   try {
//     const headers = { Authorization: `Bearer ${token}` };
// const res = await runApi('GET', `${API_URL}/auth/me`, null, headers);
//     return res.data;
//   } catch (error) {
//     console.error('Failed to fetch user details:', error);
//     throw new Error('Error fetching user details');
//   }
// };

export const fetchUserDetails = async (token: string) => {
  const headers = { Authorization: `Bearer ${token}` };
  const apiReqHeader = { headers };

  try {
    const res = await axios.get(`${API_URL}/auth/me`, apiReqHeader);
    return res;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const checkIsAccountAvailable = async (username: string) => {
  try {
    if (!username) return;

    const response = await fetch(currentNetwork.nodeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'dontcare',
        method: 'query',
        params: {
          request_type: 'view_account',
          finality: 'final',
          account_id: `${username}.${currentNetwork.fastAuth.accountIdSuffix}`,
        },
      }),
    });
    const data = await response.json();
    if (data?.error?.cause?.name == 'UNKNOWN_ACCOUNT') {
      // Account is available
      return true;
    }

    if (data?.result?.code_hash) {
      // Account is taken
      return false;
    }
  } catch (error: any) {
    // Error in checking availabilty, retry
    // console.error('Error checking account availability:', error)
    throw new Error(error.response.data.message);
  }
};
